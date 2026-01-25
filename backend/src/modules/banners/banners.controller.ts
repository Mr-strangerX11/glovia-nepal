import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BannersService } from './banners.service';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active banners' })
  findAll() {
    return this.bannersService.findAll();
  }
}
