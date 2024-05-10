import { Category } from 'src/category/entities/category.entity';
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

enum JobStatus {
  Active = 'active',
  Pending = 'pending',
  Cancelled = 'cancelled',
}

@Entity({ name: 'jobs' })
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  base_price: number;

  @Column({ default: JobStatus.Active })
  status: string;

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

  @OneToMany(() => Postulation, (postulations) => postulations.job)
  postulations: Postulation[];
}
