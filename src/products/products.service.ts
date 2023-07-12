import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly log = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...prodDetails } = createProductDto;

      const newProduct = this.productRepository.create({
        ...prodDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });

      await this.productRepository.save(newProduct);

      return { ...newProduct, images };
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { offset = 0, limit = 10 } = paginationDto;

    const allProducts = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true },
    });

    return allProducts.map((product) => {
      return {
        ...product,
        images: product.images.map((img) => img.url),
      };
    });
  }

  async findOneFlat(value: string) {
    const { images = [], ...productDetails } = await this.findOne(value);
    return {
      ...productDetails,
      images: images.map((img) => img.url),
    };
  }

  async findOne(value: string) {
    let foundProduct: Product;

    if (isUUID(value)) {
      foundProduct = await this.productRepository.findOneBy({ id: value });
    } else {
      const query = this.productRepository.createQueryBuilder('product');

      foundProduct = await query
        .where('lower(title) =:value or slug =:value', {
          value: value.toLowerCase(),
        })
        .leftJoinAndSelect('product.images', 'images')
        .getOne();
    }

    if (!foundProduct)
      throw new NotFoundException(`The product '${value}' doesn't exist`);

    return foundProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...detailsToUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...detailsToUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with id: '${id}' not found`);

    // El Query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images.map((img) =>
          this.productImageRepository.create({ url: img }),
        );
      }

      await queryRunner.manager.save(product);

      await queryRunner.commitTransaction();

      // await this.productRepository.save(product);

      return this.findOneFlat(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.handleDbError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const foundProduct = await this.findOne(id);

    await this.productRepository.remove(foundProduct);
  }

  private handleDbError(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.log.error(error);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  async deleteAll() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      await query.delete().execute();
    } catch (error) {
      this.handleDbError(error);
    }
  }
}
