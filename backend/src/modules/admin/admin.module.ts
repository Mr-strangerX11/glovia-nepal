import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { VendorController } from './vendor.controller';

@Module({
  controllers: [AdminController, VendorController],
  providers: [AdminService],
})
export class AdminModule {}
