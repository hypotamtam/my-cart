import {Connection, createConnection, Logger, QueryRunner} from 'typeorm';
import Config, {DatabaseConfiguration} from '../../Config';
import {CartEntity} from '../entity/CartEntity';
import {ItemEntity} from '../entity/ItemEntity';
import {StoreItemEntity} from '../entity/StoreItemEntity';

export class ConnectionProvider {

    public static getCartConnection = async (): Promise<Connection> => {
        return connect('cart', Config.cartDb,  [CartEntity, ItemEntity, StoreItemEntity]);
    };

}

const connect = (name: string, configuration: DatabaseConfiguration, entities: Function[]): Promise<Connection> => createConnection({
    type: 'postgres',
    host: configuration.host,
    port: configuration.port,
    database: configuration.database,
    schema: configuration.schema,
    username: configuration.username,
    password: configuration.password,
    entities: entities,
    logging: configuration.log,
    name: name,
    ssl: configuration.ssl,
    logger: logger()
});

const logger = (): Logger => ({
    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
        const logger = Config.logger;
        if (level == 'info' || level == 'log') {
            logger.debug(message);
        } else if (level == 'warn') {
            logger.warn(message);
        }
    },
    logMigration(message: string, queryRunner?: QueryRunner): any {
        Config.logger.debug(message);
    },
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        Config.logger.debug(`running query ${query} with ${parameters && parameters.join(`, `)}`);
    },
    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        Config.logger.error(error);
    },
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        Config.logger.warn(`slow query ${query} ran with ${parameters && parameters.join(', ')}. Took ${time / 1000} sec`);
    },
    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        Config.logger.debug(message);
    }
});
