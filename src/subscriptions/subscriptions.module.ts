import { DynamicModule, Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/User.entity';
import { Subscription } from './entities/Subscription.entity';

@Module({})
export class SubscriptionsModule {
  static forRootAsync(): DynamicModule {
    return {
      module: SubscriptionsModule,
      controllers: [SubscriptionsController],
      imports: [
        ConfigModule.forRoot(),
        UserModule,
        TypeOrmModule.forFeature([User, Subscription]),
      ],
      providers: [
        SubscriptionsService,
        {
          provide: 'STRIPE_API_KEY',
          useFactory: async (configService: ConfigService) =>
            configService.get('STRIPE_API_KEY'),
          inject: [ConfigService],
        },
        UserService,
      ],
    };
  }
}
