import {Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {ItemEntity} from './ItemEntity';

@Entity({name: "cart"})
export class CartEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => ItemEntity, item => item.cart, {eager: true, cascade: true, nullable: true   })
    items: ItemEntity[];
}

