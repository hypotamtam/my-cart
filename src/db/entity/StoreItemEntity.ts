import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'storeitem'})
export class StoreItemEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column()
    name: string;
}
