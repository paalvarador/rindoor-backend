import { Category } from 'src/category/entities/category.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';
import { Postulation } from 'src/postulations/entities/postulation.entity';
import { User } from 'src/user/entities/User.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

export enum JobStatus {
  Active = 'active',
  InProgress = 'InProgress',
  Cancelled = 'cancelled',
  Finished = 'finished',
}

@Entity({ name: 'jobs' })
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  base_price: number;

  @Column({ default: JobStatus.Active })
  status: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  country: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  province: string;

  @Column({ type: 'varchar', nullable: false, default: 682 })
  city: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  coords?: string;

  @Column({
    type: 'varchar',
  })
  img: string;

  @CreateDateColumn()
  created_at: Date;

  @Index({ unique: false })
  @ManyToOne(() => Category, (category) => category.job)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Index({ unique: false })
  @ManyToOne(() => User, (user) => user.jobs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Feedback, (feeback) => feeback.job)
  feedback: Feedback[];

  @OneToMany(() => Postulation, (postulations) => postulations.job)
  postulations: Postulation[];
}
