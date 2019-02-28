import 'reflect-metadata';
import {StoreItemEntity} from '../db/entity/StoreItemEntity';


export const STORE_ITEM_ENTITIES: StoreItemEntity[] = [
    {
        id: 12,
        price: 2.2,
        name: 'item12'
    },
    {
        id: 13,
        price: 10,
        name: 'item13'
    }
];

it("empty test to make JEST happy", () =>{});
