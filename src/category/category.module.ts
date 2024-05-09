import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { FileUpload } from 'src/cloudinary/FileUpload';
import { CloudinaryConfig } from 'src/config/cloudinaryConfig';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, FileUpload, CloudinaryConfig],
})
export class CategoryModule {}
