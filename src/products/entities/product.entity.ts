import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  product_id: string;
  @Column()
  product_date: string;
  @Column()
  product_name: string;
  @Column('decimal', { precision: 6, scale: 2 })
  product_price: number;
  @Column()
  product_sku: string;
  @Column()
  product_brand: string;
  @Column()
  product_model: string;
  @Column()
  product_category: string;
  @Column()
  product_color: string;
  @Column()
  product_currency: string;
  @Column()
  product_stock: number;
}
