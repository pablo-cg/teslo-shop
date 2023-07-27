import { Controller, Post, Body, Get, UseGuards, Type } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';
// import { Auth, GetUser, RawHeaders, RoleProtected } from './decorators';
// import { UserRoleGuard } from './guards';
// import { ValidRoles } from './interfaces';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'User Created',
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'User Logged In',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Invalid Credentials' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // @Get('check-status')
  // @Auth()
  // checkAuthStatus(@GetUser() user: User) {
  //   return this.authService.checkAuthStatus(user);
  // }

  // @Get('greet')
  // @UseGuards(AuthGuard())
  // greetUser(
  //   @GetUser() user: User,
  //   @GetUser('email') userEmail: string,
  //   @RawHeaders() rawHeaders: string[],
  // ) {
  //   return { user, userEmail, rawHeaders };
  // }

  // @Get('greet2')
  // @RoleProtected(ValidRoles.SUPERUSER, ValidRoles.ADMIN, ValidRoles.USER)
  // @UseGuards(AuthGuard(), UserRoleGuard)
  // greetUser2(@GetUser() user: User) {
  //   return { user };
  // }

  // @Get('greet3')
  // @Auth()
  // greetUser3(@GetUser() user: User) {
  //   return { user };
  // }
}
