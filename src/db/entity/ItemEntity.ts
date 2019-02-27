import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {CartEntity} from './CartEntity';
import {StoreItemEntity} from './StoreItemEntity';

@Entity({name: "item"})
export class ItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => StoreItemEntity, {eager: true})
    @JoinColumn({name: "storeid"})
    storeItem: StoreItemEntity;

    @ManyToOne(type => CartEntity, cart => cart.items, {nullable: true})
    @JoinColumn({name: "cartid"})
    cart: CartEntity;

    @Column()
    count: number;
}
