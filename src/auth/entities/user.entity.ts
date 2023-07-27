import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/products/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    example: '417e02a2-72a9-4f33-89aa-dda8134c301f',
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'email@email.com',
    description: 'User Email',
    uniqueItems: true,
    nullable: false,
  })
  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User Full Name',
    nullable: false,
  })
  @Column({ type: 'text' })
  fullname: string;

  @ApiProperty({
    example: true,
    description: 'User active status',
    nullable: false,
    default: true,
  })
  @Column({ type: 'bool', default: true })
  isActive: boolean;

  @ApiProperty({
    example: ['user'],
    description: 'User Roles',
    nullable: false,
    type: [String],
    default: ['user'],
  })
  @Column({ type: 'text', array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @BeforeInsert()
  @BeforeUpdate()
  beforeEmailInsertOrUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
