import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class MessagePublisher implements OnModuleInit, OnModuleDestroy {
  private producer: Producer;
  private topic: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const kafkaConfig: Kafka = new Kafka({
      brokers: this.configService.get<string[]>('kafkaBroker'),
      clientId: this.configService.get<string>('kafkaClientId'),
    });
    this.producer = kafkaConfig.producer();
    this.topic = this.configService.get<string>('kafkaOrderSendTopic');
  }
  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
    } catch (error) {
      this.logger.log(error);
    }
  }
  async onModuleInit() {
    try {
      await this.producer.connect();
    } catch (error) {
      this.logger.log(error);
    }
  }

  publish(payloadMessage: any): Promise<any> {
    return this.producer
      .send({
        topic: this.topic,
        messages: [{ value: JSON.stringify(payloadMessage) }],
      })
      .catch((e) => this.logger.error(e.message, e));
  }
}
