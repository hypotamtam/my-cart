import {Field, ObjectType} from 'type-graphql';
import {PriceGraphqlScalar} from './PriceGraphqlScalar';
import {StoreItemEntity} from '../db/entity/StoreItemEntity';

@ObjectType()
export class Product {
    @Field()
    id: number;

    @Field()
    name: string;

    @Field(() => PriceGraphqlScalar)
    price: number;

    static from = (storeEntity: StoreItemEntity): Product =>  {
        const storeItem = new Product();

        storeItem.id = storeEntity.id;
        storeItem.name = storeEntity.name;
        storeItem.price = storeEntity.price;

        return storeItem;
    }
}
