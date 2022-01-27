import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Connection } from 'typeorm';
import { OrderStatus } from '../model/order-status.enum';
import { Order } from '../model/order.entity';
import { v4 as uuidv4 } from 'uuid';
import { OrderOutBox } from '../model/order-outbox.entity';
import { OrderOperation } from '../model/order-operation.enum';

@Injectable()
export class OrderService {
  constructor(
    private connection: Connection,
    private readonly logger: LoggerService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.connection.transaction(async (manager) => {
      const transactionId: string = uuidv4();
      const orderRepository = manager.getRepository(Order);
      const order: Order = orderRepository.create({
        consumerId: createOrderDto.consumerId,
        lineItems: createOrderDto.lineItems,
        status: OrderStatus.CREATED,
        version: transactionId,
      });
      await orderRepository.save(order);

      const orderOutboxRepository = manager.getRepository(OrderOutBox);
      const orderOutbox: OrderOutBox = orderOutboxRepository.create({
        orderId: order.id,
        transactionId: transactionId,
        operationType: OrderOperation.PAYMENT_VALIDATE,
      });

      await orderOutboxRepository.save(orderOutbox);
      return order;
    });
  }

  async findAllByConsumerId(consumerId: string): Promise<Array<Order>> {
    return await this.connection.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      const orderList: Array<Order> = await orderRepository.find({
        where: {
          consumerId: consumerId,
        },
      });
      return orderList;
    });
  }

  async cancelOrder(consumerId: string, orderId: string): Promise<Order> {
    return await this.connection.transaction(async (manager) => {
      const transactionId: string = uuidv4();
      const orderRepository = manager.getRepository(Order);
      const order: Order = await orderRepository.findOne({
        where: {
          consumerId: consumerId,
          id: orderId,
        },
      });

      if (!order) {
        throw new NotFoundException();
      }

      if (order.status === OrderStatus.DELIVERED) {
        throw new BadRequestException();
      }

      order.status = OrderStatus.CANCELLED;
      order.version = transactionId;
      return await orderRepository.save(order);
    });
  }

  async confirmOrder(orderId: string, transactionId: string) {
    return await this.connection.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      const order: Order = await orderRepository.findOne({
        where: {
          id: orderId,
          version: transactionId,
        },
      });

      if (!order) {
        order.status = OrderStatus.CONFIRMED;
        await orderRepository.save(order);
      }
    });
  }

  async declineOrder(orderId: string, transactionId: string) {
    return await this.connection.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      const order: Order = await orderRepository.findOne({
        where: {
          id: orderId,
          version: transactionId,
        },
      });

      if (!order) {
        order.status = OrderStatus.CANCELLED;
        await orderRepository.save(order);
      }
    });
  }

  async getOrderById(consumerId: string, orderId: string): Promise<Order> {
    return await this.connection.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      return await orderRepository.findOne({
        where: {
          consumerId: consumerId,
          id: orderId,
        },
      });
    });
  }
}
