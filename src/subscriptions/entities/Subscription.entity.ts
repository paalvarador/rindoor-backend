import { User } from 'src/user/entities/User.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryColumn()
  id: string;

  @Column({
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column()
  name: string;

  @Column()
  currency: string;

  @Column({
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price_cents: number;

  @Column()
  interval: string;

  @OneToMany(() => User, (user) => user.subscription)
  users: User[];
}
