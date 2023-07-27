import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ nullable: false, description: 'Product Title', minLength: 1 })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({ nullable: true, description: 'Product Price', default: 0 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({ nullable: true, description: 'Product Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ nullable: true, description: 'Product Slug' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ nullable: true, description: 'Product Stock', default: 0 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({ nullable: false, description: 'Product Sizes' })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({ nullable: false, description: 'Product Gender' })
  @IsString()
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({ nullable: true, description: 'Product Tags' })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ nullable: true, description: 'Product Images' })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
