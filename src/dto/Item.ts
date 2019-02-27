import {Field, Float, ObjectType} from 'type-graphql';
import {PriceGraphqlScalar} from './PriceGraphqlScalar';

@ObjectType()
export class Item {
    @Field()
    id: number;

    @Field()
    name: string;

    @Field(() => PriceGraphqlScalar)
    price: number;

    @Field(() => Float)
    count: number;

    @Field(() => PriceGraphqlScalar, { nullable: true })
    total(): number {
        return this.count * this.price;
    }
}
