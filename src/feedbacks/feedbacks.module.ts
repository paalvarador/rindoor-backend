import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/user/entities/User.entity';
import { Category } from 'src/category/entities/category.entity';
import { Postulation } from 'src/postulations/entities/postulation.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback, Job, User, Category, Postulation]),
    UserModule,
  ],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
