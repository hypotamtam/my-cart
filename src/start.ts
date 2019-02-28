import 'reflect-metadata';
import * as express from 'express';
import {Application} from 'express';
import Config from './Config';
import {GraphqlServer} from './GraphqlServer';
import {CartDbClient} from './db/client/CartDbClient';
import {ConnectionProvider} from './db/client/ConnectionProvider';

const GRAPHQL_PATH = "/cart";

export type CartDbProvider = () => CartDbClient;

export const startServer = async (app: Application, cartDbProvider: CartDbProvider) => {
    await GraphqlServer.provide(app, cartDbProvider, GRAPHQL_PATH);
    app.listen(Config.port, () => Config.logger.info(`Cart GraphQL API server instance listening on port ${Config.port}`));
};

ConnectionProvider.getCartConnection()
    .then(connection => {
        const cartDbProvider: CartDbProvider = () => new CartDbClient(connection);
        startServer(express(), cartDbProvider).then(() => Config.logger.info('Server started'))
    })
    .catch(reason => Config.logger.error(`${JSON.stringify(reason)}`));
