import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/common/dto/pagination-result';

@Injectable()
export class ProductsService {
  private readonly log = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct = this.productRepository.create(createProductDto);

      await this.productRepository.save(newProduct);

      return newProduct;
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { offset = 0, limit = 10 } = paginationDto;

    return await this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO RELACIONES
    });
  }

  async findOne(value: string) {
    let foundProduct: Product;

    if (isUUID(value)) {
      foundProduct = await this.productRepository.findOneBy({ id: value });
    } else {
      const query = this.productRepository.createQueryBuilder();

      foundProduct = await query
        .where('lower(title) =:value or slug =:value', {
          value: value.toLowerCase(),
        })
        .getOne();
    }

    if (!foundProduct)
      throw new NotFoundException(`The product '${value}' doesn't exist`);

    return foundProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product)
      throw new NotFoundException(`Product with id: '${id}' not found`);

    try {
      await this.productRepository.save(product);

      return product;
    } catch (error) {
      this.handleDbError(error);
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

  async findAllPaginated(paginationOptions: PaginationOptions) {
    const { page = 0, size = 10 } = paginationOptions;

    const [rawData, total] = await this.productRepository.findAndCount({
      take: size,
      skip: page * size,
    });

    return new PaginationResult(rawData, total, paginationOptions);
  }
}
