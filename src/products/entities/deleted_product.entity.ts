import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeletedProduct {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  product_id: string;
}
