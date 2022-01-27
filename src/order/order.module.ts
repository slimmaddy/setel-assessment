import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './order.controller';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './model/order.entity';
import { OrderOutBox } from './model/order-outbox.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { MessageConsumer } from './service/message-consumer.service';
import { MessagePublisher } from './service/message-publisher.service';
import { OutBoxSchedulerService } from './service/order-scheduler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderOutBox]),
    ConfigService,
    LoggerService,
    ScheduleModule.forRoot(),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    MessageConsumer,
    MessagePublisher,
    OutBoxSchedulerService,
  ],
})
export class OrderModule {}
