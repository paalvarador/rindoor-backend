import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/User.entity';
import { Category } from 'src/category/entities/category.entity';
import { Postulation } from 'src/postulations/entities/postulation.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User, Category, Postulation, Job]),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
