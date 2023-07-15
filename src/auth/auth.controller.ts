import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('greet')
  @UseGuards(AuthGuard())
  greetUser(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    return { user, userEmail, rawHeaders };
  }

  @Get('greet2')
  @RoleProtected(ValidRoles.SUPERUSER, ValidRoles.ADMIN, ValidRoles.USER)
  @UseGuards(AuthGuard(), UserRoleGuard)
  greetUser2(@GetUser() user: User) {
    return { user };
  }

  @Get('greet3')
  @Auth()
  greetUser3(@GetUser() user: User) {
    return { user };
  }
}
