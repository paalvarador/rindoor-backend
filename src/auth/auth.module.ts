import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/User.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User, Category])],
  controllers: [AuthController],
  providers: [AuthService, EmailService, UserService],
})
export class AuthModule {}
