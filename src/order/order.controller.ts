import { Body, Controller, Get, Param, Post, Headers } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './service/order.service';
import { Order } from './model/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @Headers('consumerId') consumerId: string,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    createOrderDto.consumerId = consumerId;
    return this.orderService.createOrder(createOrderDto);
  }

  @Post(':id/cancel')
  cancel(
    @Headers('consumerId') consumerId: string,
    @Param('id') orderId,
  ): Promise<Order> {
    return this.orderService.cancelOrder(consumerId, orderId);
  }

  @Get()
  async findAll(
    @Headers('consumerId') consumerId: string,
  ): Promise<Array<Order>> {
    return this.orderService.findAllByConsumerId(consumerId);
  }

  @Get(':id')
  async findOne(
    @Headers('consumerId') consumerId: string,
    @Param('id') orderId: string,
  ): Promise<Order> {
    return this.orderService.getOrderById(consumerId, orderId);
  }
}
