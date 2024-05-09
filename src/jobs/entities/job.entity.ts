import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
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

  @Column({ type: 'varchar', length: 50, nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  base_price: number;

  @Column({ default: JobStatus.Active })
  status: string;

  @OneToOne(() => Category, (category) => category.job)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'date', nullable: false })
  created_at: Date;
}
