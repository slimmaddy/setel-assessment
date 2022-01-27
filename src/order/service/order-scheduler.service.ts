import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule/dist/decorators/cron.decorator';
import { OrderService } from './order.service';
import { OrderOutBox } from '../model/order-outbox.entity';
import { Connection, Raw } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { MessagePublisher } from './message-publisher.service';
import { Order } from '../model/order.entity';

@Injectable()
export class OutBoxSchedulerService {
  constructor(
    private messagePublisher: MessagePublisher,
    private connection: Connection,
    private readonly logger: LoggerService,
    private orderService: OrderService,
  ) {}

  //every 5th second
  @Cron('*/5 * * * * *')
  async handleCron() {
    return await this.connection.transaction(async (manager) => {
      const orderOutBoxRepository = manager.getRepository(OrderOutBox);
      const orderOutboxList = await orderOutBoxRepository.find({
        where: {
          sentDate: Raw((alias) => `${alias} <= NOW() or ${alias} IS NULL`),
        },
      });

      const orderRepository = manager.getRepository(Order);

      if (orderOutboxList) {
        for (const orderOutbox of orderOutboxList) {
          const order = await orderRepository.find({
            where: {
              id: orderOutbox.orderId,
              version: orderOutbox.transactionId,
            },
          });

          if (order) {
            await this.messagePublisher.publish(order);
          }
          await orderOutBoxRepository.remove(orderOutbox);
        }
      }
    });
  }
}
