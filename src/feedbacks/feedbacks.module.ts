import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/user/entities/User.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, Job, User, Category])],
  controllers: [FeedbacksController],
  providers: [FeedbacksService, UserService],
})
export class FeedbacksModule {}
