import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';
import { OrderOperation } from './order-operation.enum';
@Entity({ name: 'order-outbox' })
export class OrderOutBox {
  @PrimaryColumn()
  transactionId: string;

  @Column({
    type: 'enum',
    enum: OrderOperation,
  })
  operationType: OrderOperation;

  @Column()
  orderId: string;

  @Column({ nullable: true })
  sentDate?: Date;
}
