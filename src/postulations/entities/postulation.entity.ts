import { Chat } from 'src/chat/entities/chat.entity';
import { Job } from 'src/jobs/entities/job.entity';
import { User } from 'src/user/entities/User.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export enum PostulationStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  Cancelled = 'cancelled',
}

@Entity({ name: 'postulations' })
export class Postulation {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  offered_price: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: PostulationStatus.OPEN })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.postulations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Job, (job) => job.postulations)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  
}
