import 'reflect-metadata';
import {STORE_ITEM_ENTITIES} from './FakeData.test';
import {CartEntity} from '../db/entity/CartEntity';
import {Cart} from './Cart';

describe('Given a Cart', () => {
    it('When from is called with a CartEntity without item, then the Cart is matching the CartEntity', () => {
        const cartEntity: CartEntity = {id: 1, items: []};
        const cart = Cart.from(cartEntity);

        expect(cart.id).toBe(1);
        expect(cart.items).toEqual([]);
        expect(cart.total()).toBe(0);
    });

    it('When from is called with a cartEntity with item, then the Cart is matching the CartEntity ', () => {
        const cartEntity: CartEntity = {id: 1, items: []};
        cartEntity.items = [
            {
                id: 2,
                count: 3,
                cart: cartEntity,
                storeItem: STORE_ITEM_ENTITIES[0]
            },
            {
                id: 3,
                count: 1,
                cart: cartEntity,
                storeItem: STORE_ITEM_ENTITIES[1]
            }
        ];
        const cart = Cart.from(cartEntity);

        expect(cart.id).toBe(1);
        expect(cart.items[0].id).toBe(STORE_ITEM_ENTITIES[0].id);
        expect(cart.items[0].count).toBe(3);
        expect(cart.items[0].price).toBe(STORE_ITEM_ENTITIES[0].price);
        expect(cart.items[0].name).toBe(STORE_ITEM_ENTITIES[0].name);
        expect(cart.items[0].total()).toBe(STORE_ITEM_ENTITIES[0].price * 3);

        expect(cart.items[1].id).toBe(STORE_ITEM_ENTITIES[1].id);
        expect(cart.items[1].count).toBe(1);
        expect(cart.items[1].price).toBe(STORE_ITEM_ENTITIES[1].price);
        expect(cart.items[1].name).toBe(STORE_ITEM_ENTITIES[1].name);
        expect(cart.items[1].total()).toBe(STORE_ITEM_ENTITIES[1].price);

        expect(cart.total()).toBe(cart.items[0].total() + cart.items[1].total());
    });
});
