import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/user/entities/User.entity';
import { Job } from 'src/jobs/entities/job.entity';

@Entity({ name: 'feedbacks' })
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'text', nullable: false })
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'decimal',
    default: 5.0,
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  rating: number;

  @ManyToMany(() => User, (user) => user.sentFeedbacks, { nullable: false })
  @JoinTable()
  author: User[];

  @ManyToMany(() => User, (user) => user.receivedFeedbacks, { nullable: false })
  @JoinTable()
  recipient: User[];

  @ManyToOne(() => Job, (job) => job.feedback)
  @JoinColumn({ name: 'job_id' })
  job: Job;
}
