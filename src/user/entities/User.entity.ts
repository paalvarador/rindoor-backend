import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './Role.enum';
import { Job } from 'src/jobs/entities/job.entity';
import { Service } from 'src/services/entities/service.entity';
import { Postulation } from 'src/postulations/entities/postulation.entity';
import { Category } from 'src/category/entities/category.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'varchar', length: 50, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 150, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  address: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    precision: 2,
    scale: 2,
  })
  rating: number;

  @Column({
    type: 'enum',
    enum: Role,
    nullable: false,
  })
  role: Role;

  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

  @OneToMany(() => Service, (service) => service.user)
  services: Service[];

  @OneToMany(() => Postulation, (postulations) => postulations.user)
  postulations: Postulation[];

  @ManyToOne(() => Category, (category) => category.user)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 100, nullable: true })
  planId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  customerId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subscriptionId: string;
}
