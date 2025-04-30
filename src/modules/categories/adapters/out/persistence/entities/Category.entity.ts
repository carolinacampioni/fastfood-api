import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductEntity } from '../../../../../products/adapters/out/persistence/entities/Product.entity';

/**
 * Category Entity for TypeORM
 * 
 * This is the TypeORM entity that maps to the 'categories' table in the database.
 */
@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @OneToMany(() => ProductEntity, product => product.category)
  products: ProductEntity[];
}
