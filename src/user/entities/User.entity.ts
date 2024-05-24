import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './Role.enum';
import { Job } from 'src/jobs/entities/job.entity';
import { Postulation } from 'src/postulations/entities/postulation.entity';
import { Category } from 'src/category/entities/category.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { Feedback } from 'src/feedbacks/entities/feedback.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  phone: string;

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

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  coords?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 5.0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  rating: number;

  @Column({
    type: 'enum',
    enum: [Role.CLIENT, Role.PROFESSIONAL],
    nullable: false,
  })
  role: Role;

  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

  @OneToMany(() => Postulation, (postulations) => postulations.user)
  postulations: Postulation[];

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Chat, (chat) => chat.client)
  clientChats: Chat[];

  @OneToMany(() => Chat, (chat) => chat.professional)
  professionalChats: Chat[];

  @Column({ type: 'varchar', length: 100, nullable: true })
  planId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  customerId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subscriptionId: string;

  @ManyToMany(() => Feedback, (feedback) => feedback.author)
  sentFeedbacks: Feedback[];

  @ManyToMany(() => Feedback, (feedback) => feedback.recipient)
  receivedFeedbacks: Feedback[];
}
