import "reflect-metadata";
import * as express from 'express';
import {Application} from 'express';
import Config from './Config';
import {GraphqlServer} from './GraphqlServer';

const startServer = async () => {

    const app: Application = express();
    await GraphqlServer.provide(app, "/cart");

    app.listen(Config.port, () => Config.logger.info(`Cart GraphQL API server instance listening on port ${Config.port}`));
};

startServer()
    .then(() => Config.logger.info('Server started'))
    .catch(reason => Config.logger.error(`${JSON.stringify(reason)}`));
