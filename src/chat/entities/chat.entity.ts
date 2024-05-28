import { Postulation } from 'src/postulations/entities/postulation.entity';
import { User } from 'src/user/entities/User.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({
    type: 'text',
  })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.chats)
  from: User;

  @ManyToOne(() => User, (user) => user.chats)
  to: User;

}
