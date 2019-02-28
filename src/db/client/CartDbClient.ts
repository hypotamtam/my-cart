import {DatabaseClient} from './DatabaseClient';
import {CartEntity} from '../entity/CartEntity';
import {StoreItemEntity} from '../entity/StoreItemEntity';
import {ItemEntity} from '../entity/ItemEntity';


export interface ICartDbClient {
    findCart: (id: number) => Promise<CartEntity>;
    createCart: () => Promise<CartEntity>;
    saveCart: (cartEntity: CartEntity) => Promise<CartEntity>;
    findStoreItem: (id: number) => Promise<StoreItemEntity>;
    findAllStoreItem: () => Promise<StoreItemEntity[]>;
    createItem: () => Promise<ItemEntity>;
    removeItem: (itemEntity: ItemEntity) => Promise<void>;

    doTransaction: <T>(body: () => Promise<T>) => Promise<T>;
}

export class CartDbClient extends DatabaseClient implements ICartDbClient {
    findCart = async (id: number): Promise<CartEntity> => {
        return this.getRepository(CartEntity).findOne(id)
            .then(result => {
                if (result) {
                    return result;
                }
                throw new Error(`Cart ${id} not found")`);
            });
    };

    createCart = async (): Promise<CartEntity> => {
        return this.getRepository(CartEntity).create();
    };

    saveCart = async (cartEntity: CartEntity): Promise<CartEntity> => {
        return this.getRepository(CartEntity).save(cartEntity);
    };

    findStoreItem = async (id: number): Promise<StoreItemEntity> => {
        return this.getRepository(StoreItemEntity).findOne(id).then(result => {
            if (result) {
                return result;
            }
            throw new Error(`Item ${id} not found")`);
        });
    };

    findAllStoreItem = async (): Promise<StoreItemEntity[]> => {
        return this.getRepository(StoreItemEntity).find();
    };

    createItem = async (): Promise<ItemEntity> => {
        return this.getRepository(ItemEntity).create();
    };

    removeItem = async (itemEntity: ItemEntity): Promise<void> => {
        return this.getRepository(ItemEntity).delete(itemEntity.id).then(() => {
        });
    };
}
