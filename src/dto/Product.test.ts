import 'reflect-metadata';
import {STORE_ITEM_ENTITIES} from './FakeData.test';
import {Product} from './Product';

describe('Given a Product', () => {
    it('When from is called with a StoreItemEntity, then the Product is matching it', () => {
        const storeItem = STORE_ITEM_ENTITIES[0];
        const product = Product.from(storeItem);

        expect(product.id).toBe(storeItem.id);
        expect(product.name).toBe(storeItem.name);
        expect(product.price).toBe(storeItem.price);
    })
});
