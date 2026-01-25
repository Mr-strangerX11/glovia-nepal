import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { AdminService } from './admin.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@ApiTags('Vendor')
@Controller('vendor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.VENDOR)
@ApiBearerAuth()
export class VendorController {
  constructor(private adminService: AdminService) {}

  @Get('products')
  @ApiOperation({ summary: 'List products (vendor view)' })
  getProducts(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllProducts({
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by id (vendor)' })
  getProduct(@Param('id') id: string) {
    return this.adminService.getProduct(id);
  }

  @Post('products')
  @ApiOperation({ summary: 'Create product (vendor)' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Update product (vendor)' })
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.adminService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product (vendor)' })
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }
}
