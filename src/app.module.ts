import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobsModule } from './jobs/jobs.module';
import { UserModule } from './user/user.module';
import { PostulationsModule } from './postulations/postulations.module';
import typeOrmConfig from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ChatModule } from './chat/chat.module';
import { UbicationModule } from './ubication/ubication.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    CategoryModule,
    JobsModule,
    UserModule,
    PostulationsModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
    AuthModule,
    EmailModule,
    SubscriptionsModule.forRootAsync(),
    ChatModule,
    UbicationModule,
    FeedbacksModule,
  ],
})
export class AppModule {}
