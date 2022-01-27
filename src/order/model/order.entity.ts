import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LineItem } from './line-item.vo';
import { OrderStatus } from './order-status.enum';

@Entity({ name: 'order' })
export class Order extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  consumerId: string;

  @Column('simple-json')
  lineItems: Array<LineItem> = [];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  status: OrderStatus;

  @Column()
  version: string;

  @CreateDateColumn({
    default: `now()`,
    nullable: true,
  })
  createdAt: Date;

  @UpdateDateColumn({
    default: `now()`,
    nullable: true,
  })
  updatedAt: Date;
}
