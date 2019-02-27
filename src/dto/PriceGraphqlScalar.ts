import {GraphQLError, GraphQLScalarType, Kind} from 'graphql';

export const PriceGraphqlScalar = new GraphQLScalarType({
    name: "Price",
    description: "The price of the item. Always with 2 decimals",
        serialize(value: number) {
            return Number(value).toFixed(2);
        },

    });

