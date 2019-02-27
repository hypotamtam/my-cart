import {Field, Float, ObjectType} from 'type-graphql';
import {Item} from './Item';
import {CartEntity} from '../db/entity/CartEntity';
import {PriceGraphqlScalar} from './PriceGraphqlScalar';

@ObjectType()
export class Cart {

    @Field()
    id: number;

    @Field(() => [Item])
    items: Item[] = [];

    @Field(() => PriceGraphqlScalar, { nullable: true })
    total(): number {
        return this.items.reduce((total: number, item:Item) => total + item.total(), 0)
    }

    static from = (cartEntity: CartEntity): Cart => {
        const cart = new Cart();

        cart.id = cartEntity.id;
        if (cartEntity.items) {
            cart.items = cartEntity.items.map(itemEntity => {
                const item = new Item();
                item.id = itemEntity.storeItem.id;
                item.name = itemEntity.storeItem.name;
                item.price = itemEntity.storeItem.price;
                item.count = itemEntity.count;
                return item;
            });
        }

        return cart;
    }

}
