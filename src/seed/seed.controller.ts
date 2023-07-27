import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
// import { Auth } from 'src/auth/decorators';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  // @Auth('super-user')
  @ApiResponse({ status: 200, description: 'Database seeded' })
  runSeed() {
    return this.seedService.runSeed();
  }
}
