import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter } from './filter/exception.filter';
import { ResponseTransformInterceptor } from './interceptor/response.transform.interceptor';
import kafkaConfig from './config/kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, kafkaConfig],
    }),
    LoggerModule,
    DatabaseModule,
    OrderModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
  ],
})
export class AppModule {}
