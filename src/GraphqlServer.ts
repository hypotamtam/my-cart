import {buildSchema} from 'type-graphql';
import * as graphqlHTTP from 'express-graphql'
import Config from './Config';
import {Application, Request, Response} from 'express';
import {CartResolver} from './CartResolver';

export type Context = {
    request: Request
}

export const GraphqlServer = {
    provide: async (app: Application, path: string) => {
        const schema = await buildSchema({
            resolvers: [CartResolver]
        });
        app.use(path, async (request: Request, response: Response) => {
            return graphqlHTTP({
                context: { request } as Context,
                graphiql: true,
                formatError: error => {
                    Config.logger.error(error.message, error.stack);
                    return error.message;
                },
                schema
            })(request, response);
        });
    }
};
