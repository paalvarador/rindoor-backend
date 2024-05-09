import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServicesModule } from './services/services.module';
import { JobsModule } from './jobs/jobs.module';
import { UserModule } from './user/user.module';
import typeOrmConfig from './config/typeorm';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    CategoryModule,
    ServicesModule,
    JobsModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
