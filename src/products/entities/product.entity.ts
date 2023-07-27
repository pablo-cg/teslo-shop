import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: '417e02a2-72a9-4f33-89aa-dda8134c301f',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Teslo T-Shirt',
    description: 'Product Title',
    uniqueItems: true,
  })
  @Column({ type: 'text', unique: true })
  title: string;

  @ApiProperty({
    example: 5.99,
    description: 'Product Price',
    default: 0,
  })
  @Column({ type: 'float', default: 0 })
  price: number;

  @ApiProperty({
    example: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
    description: 'Product Description',
    default: null,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 'teslo_t_shirt',
    description: 'Product Slug for seo routes',
    uniqueItems: true,
  })
  @Column({ type: 'text', unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product Stock',
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL'],
    description: 'Product Sizes',
    isArray: true,
  })
  @Column({ type: 'text', array: true })
  sizes: string[];

  @ApiProperty({
    example: 'unisex',
    description: 'Product Gender',
  })
  @Column({ type: 'text' })
  gender: string;

  @ApiProperty({
    example: ['shirt', 't-shirt', 'teslo'],
    description: 'Product Tags',
    isArray: true,
  })
  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @ApiProperty({
    example: ['7652426-00-A_0_2000.jpg', '7652426-00-A_1.jpg'],
    description: 'Product Images',
    isArray: true,
    type: ProductImage,
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ApiProperty({
    description: 'The user that created the product',
    type: User,
  })
  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;

  @BeforeInsert()
  beforeSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll(`'`, '');
  }

  @BeforeUpdate()
  beforeSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll(`'`, '');
  }
}
