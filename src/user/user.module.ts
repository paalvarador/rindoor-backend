import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { Category } from 'src/category/entities/category.entity';
import { Postulation } from 'src/postulations/entities/postulation.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { ROOMS } from './constants';

@Module({
  imports: [TypeOrmModule.forFeature([User, Category, Postulation, Job])],
  controllers: [UserController],
  providers: [UserService, { provide: ROOMS, useValue: [] }],
  exports: [UserService],
})
export class UserModule {}
