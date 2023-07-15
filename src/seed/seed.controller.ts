import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
// import { Auth } from 'src/auth/decorators';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth('super-user')
  runSeed() {
    return this.seedService.runSeed();
  }
}
