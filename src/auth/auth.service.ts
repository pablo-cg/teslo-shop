import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  logger = new Logger('Auth Service');

  constructor(
    @InjectRepository(User) private readonly userRespository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const newUser = this.userRespository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRespository.save(newUser);

      delete newUser.password;

      return { ...newUser, token: this.getJwt({ userId: newUser.id }) };
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const foundUser = await this.userRespository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!foundUser) throw new UnauthorizedException('Invalid Credentials');

    if (!bcrypt.compareSync(password, foundUser.password)) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return { ...foundUser, token: this.getJwt({ userId: foundUser.id }) };
  }

  async checkAuthStatus(user: User) {
    return { ...user, token: this.getJwt({ userId: user.id }) };
  }

  private getJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDbError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
