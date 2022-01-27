import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger/logger.service';
import { OrderService } from './order.service';

@Injectable()
export class MessageConsumer implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;
  private readonly topic: string;
  private readonly groupId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly orderService: OrderService,
  ) {
    const kafkaConfig: Kafka = new Kafka({
      brokers: this.configService.get<string[]>('kafkaBroker'),
      clientId: this.configService.get<string>('kafkaClientId'),
    });
    this.groupId = this.configService.get<string>('kafkaGroupId');
    this.topic = this.configService.get<string>('kafkaOrderReceiveTopic');
    this.consumer = kafkaConfig.consumer({ groupId: this.groupId });

    this.consume();
  }
  async onModuleDestroy() {
    try {
      await this.consumer.disconnect();
    } catch (error) {
      this.logger.log(error);
    }
  }
  async onModuleInit() {
    try {
      await this.consumer.connect();
    } catch (error) {
      this.logger.log(error);
    }
  }

  async consume() {
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        //process payment response -> confirm or decline order
        //process delivery event
      },
    });
  }
}
