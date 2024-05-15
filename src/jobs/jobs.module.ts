import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { User } from 'src/user/entities/User.entity';
import { Category } from 'src/category/entities/category.entity';
import { CloudinaryConfig } from 'src/config/cloudinaryConfig';
import { FileUpload } from 'src/cloudinary/FileUpload';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job, User, Category])],
  controllers: [JobsController],
  providers: [JobsService, FileUpload, CloudinaryConfig, EmailService],
})
export class JobsModule {}
