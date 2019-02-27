import * as winston from "winston";
import {LoggerOptions} from "winston";

export type DatabaseConfiguration = {
    host: string,
    port: number,
    database: string,
    schema: string,
    username: string,
    password: string,
    log: boolean,
    ssl: boolean,
}

export default class Config {

    public static port = Number(process.env.PORT) || 3000;

    private static env = process.env.ENVIRONMENT || "local";

    public static cartDb: DatabaseConfiguration = {
        host: process.env.gtfs_db_host || 'localhost',
        port: Number(process.env.gtfs_db_port) || 5432,
        database: process.env.gtfs_db_database || 'postgres',
        schema: process.env.gtfs_db_schema || 'public',
        username: process.env.gtfs_db_username || 'postgres',
        password: process.env.gtfs_db_password || '',
        log: process.env.gtfs_db_logging ? process.env.database_logging === 'true' : true,
        ssl: Config.env !== "local"
    };

    private static loggerFormat = winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.json()
    );

    private static getLoggerOption = (env: string): LoggerOptions => {
        if (env === "local") {
            return {
                level: "debug",
                format: Config.loggerFormat,
                transports: [
                    new winston.transports.Console(),
                ]
            };
        } else {
            return {
                level: "info",
                format: Config.loggerFormat,
                transports: [
                    new winston.transports.File({filename: "error.log", level: "error"}),
                    new winston.transports.File({filename: "combined.log"})
                ]
            };
        }
    };

    public static logger = winston.createLogger(Config.getLoggerOption(Config.env));
};
