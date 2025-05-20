import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Client Entity for TypeORM
 *
 * This is the TypeORM entity that maps to the 'clients' table in the database.
 */
@Entity("clients")
export class ClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 11, unique: true, nullable: false })
  cpf: string;

  @Column({ length: 100, unique: true, nullable: false })
  email: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
