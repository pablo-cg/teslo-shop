import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.dropTables();

    const admin = await this.insertNewUsers();

    await this.insertNewProducts(admin);
    return 'Seed Executed';
  }

  private async dropTables() {
    await this.productsService.deleteAll();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder.delete().execute();
  }

  private async insertNewUsers() {
    const users = initialData.users;

    const arrayUsers: User[] = [];

    users.forEach((user) => {
      user.password = bcrypt.hashSync(user.password, 10);
      arrayUsers.push(this.userRepository.create(user));
    });

    await this.userRepository.save(arrayUsers);

    return arrayUsers[1];
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAll();

    const products = initialData.products;

    const inserts = [];

    for (const product of products) {
      inserts.push(this.productsService.create(product, user));
    }

    await Promise.all(inserts);

    return true;
  }
}
