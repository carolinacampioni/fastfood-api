import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrderStatus } from '../../../../domain/entities/Order';
import { OrderItemEntity } from './OrderItem.entity';

/**
 * Order Entity for TypeORM
 * 
 * This is the TypeORM entity that maps to the 'orders' table in the database.
 */
@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_name', length: 100, nullable: false })
  customerName: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalAmount: number;

  @OneToMany(() => OrderItemEntity, orderItem => orderItem.order, {
    cascade: true,
    eager: true
  })
  items: OrderItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
