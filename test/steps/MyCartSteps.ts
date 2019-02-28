import 'reflect-metadata';
import {after, before, binding, given, then, when} from 'cucumber-tsflow';
import * as express from 'express';
import {Application} from 'express';
import {CartEntity} from '../../src/db/entity/CartEntity';
import {GRAPHQL_PATH, startServer} from '../../src/start';
import {Server} from 'http';
import * as supertest from 'supertest';
import * as assert from 'assert';
import {ICartDbClient} from '../../src/db/client/CartDbClient';
import {StoreItemEntity} from '../../src/db/entity/StoreItemEntity';
import {ItemEntity} from '../../src/db/entity/ItemEntity';


@binding()
class MyCartSteps {

    dbClient: InMemoryCartDdClient;
    app: Application;
    server: Server;

    cartEntity?: CartEntity;

    @before('publish')
    public async before() {
        this.app = express();
        this.dbClient = new InMemoryCartDdClient();
        this.server = await startServer(this.app, () => this.dbClient);
    }

    @after('publish')
    public after() {
        this.server.close();
        this.cartEntity = undefined;
    }

    @given(/^a user with a cart$/)
    public a_user_with_a_cart() {
        this.cartEntity = {id: 1, items: []};
        this.dbClient.addCart(this.cartEntity);
    }


    @given(/^the cart already contains an? (.*?) at (\d*\.\d{0,2})$/)
    public the_cart_already_contains(name: string, price: number) {
        this.the_cart_already_contains_several('1', name, price);
    }

    @given(/^the user already contains (\d) (.*?) at (\d*\.\d{0,2})$/)
    public the_cart_already_contains_several(count: string, name: string, price: number) {
        if (this.cartEntity) {
            const storeItem = this.dbClient.addStoreItem(name, price);
            this.cartEntity.items.push({
                id: Math.random(),
                storeItem: storeItem,
                count: Number(count),
                cart: this.cartEntity
            });
        }
    }

    @then(/^the cart item count is (\d*)$/)
    public async the_cart_item_count_is(itemCount: string) {
        const cart = await getCart(this.app, this.cartEntity);
        assert.strictEqual(cart.items.length, Number(itemCount));
    }

    @then(/^the cart price is (.*)$/)
    public async the_price_is(price: string) {
        const cart = await getCart(this.app, this.cartEntity);
        assert.strictEqual(cart.total, price);
    }

    @when(/^the user adds (\d) (.*?) at (\d*\.\d{0,2})$/)
    public async the_user_adds(count: string, name: string, price: number) {
        const storeItem = this.dbClient.addStoreItem(name, price);
        await updateQuantity(this.app, storeItem.id, Number(count), this.cartEntity);
    }

    @when(/^the user removes (\d) (.*?)$/)
    public async the_user_removes(count: string, name: string) {
        const storeItem = this.dbClient.getStoreItem(name);
        if (!storeItem) {
            return assert.fail();
        }
        await updateQuantity(this.app, storeItem.id, -1 * Number(count), this.cartEntity);
    }

    @then(/^the cart contains (\d) (.*?) for (\d*\.\d{0,2})$/)
    public async the_cart_contains(count: string, name: string, total: string) {
        const cart = await getCart(this.app, this.cartEntity);
        const item = cart.items.find(item => (item.count === Number(count) && (item.name === name) && (item.total === total)));
        assert(item !== undefined);
    }
}

type CartResponse = {
    items: ItemResponse[]
    total: string
}

type ItemResponse = {
    name: string,
    price: string,
    count: number,
    total: string,
}

const getCart = async (app: Application, cartEntity?: CartEntity): Promise<CartResponse> => {
    const cartId = cartEntity ? cartEntity.id : -1;

    return await supertest(app)
        .post(GRAPHQL_PATH)
        .send({
            query: `{cart(cartId: ${cartId}){items{name price count total} total}}`
        })
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => res.body.data.cart);
};

const updateQuantity = async (app: Application, storeItemId: number, delta: number, cartEntity?: CartEntity): Promise<void> => {
    const cartId = cartEntity ? cartEntity.id : -1;
    return await supertest(app)
        .post(GRAPHQL_PATH)
        .send({
            query: `mutation {itemQuantityUpdate(delta:${delta}, itemId:${storeItemId}, cartId:${cartId}){items{id name price count total} total}}`
        })
        .set('Accept', 'application/json')
        .expect(200)
        .then(res => {});
};

class InMemoryCartDdClient implements ICartDbClient {
    private cartEntities = new Map<number, CartEntity>();

    private storeItems = new Map<number, StoreItemEntity>();

    createCart = (): Promise<CartEntity> => {
        const cartEntity: CartEntity = {id: this.cartEntities.size + 1, items: []};
        return Promise.resolve(cartEntity);
    };

    createItem = (): Promise<ItemEntity> => {
        return Promise.resolve({id: Math.random(), count: 0} as ItemEntity);
    };

    findAllStoreItem = (): Promise<StoreItemEntity[]> => {
        return Promise.resolve(Array.from(this.storeItems.values()));
    };

    findCart = (id: number): Promise<CartEntity> => {
        const cart = this.cartEntities.get(id);
        return cart !== undefined ? Promise.resolve(cart) : Promise.reject(new Error('No cart'));
    };

    findStoreItem = (id: number): Promise<StoreItemEntity> => {
        const storeItem = this.storeItems.get(id);
        return storeItem !== undefined ? Promise.resolve(storeItem) : Promise.reject(new Error('No storeItem'));
    };

    removeItem = (itemEntity: ItemEntity): Promise<void> => {
        return Promise.resolve();
    };

    saveCart = (cartEntity: CartEntity): Promise<CartEntity> => {
        this.cartEntities.set(cartEntity.id, cartEntity);
        return Promise.resolve(cartEntity);
    };

    doTransaction = <T>(body: () => Promise<T>): Promise<T> => {
        return body();
    };

    addCart = (cart: CartEntity) => {
        this.cartEntities.set(cart.id, cart);
    };

    addStoreItem = (name: string, price: number): StoreItemEntity => {
        const item = this.getStoreItem(name, price);
        if (item) {
            return item;
        }
        const storeItem: StoreItemEntity = {id: Math.random(), name, price};
        this.storeItems.set(storeItem.id, storeItem);
        return storeItem;
    };

    getStoreItem = (name: string, price?: number): StoreItemEntity | undefined => {
        return Array.from(this.storeItems.values()).find(item => (item.name === name) && (price ? (item.price === price) : true));
    };

}
