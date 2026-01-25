import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PaymentsModule } from '../payments/payments.module';
import { TrustScoreMiddleware } from '../../common/middleware/trust-score.middleware';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PaymentsModule, PrismaModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TrustScoreMiddleware)
      .forRoutes({ path: 'orders', method: RequestMethod.POST });
  }
}
