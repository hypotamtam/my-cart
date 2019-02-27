import {Connection, EntityManager, ObjectType, Repository} from 'typeorm';

export class DatabaseClient {
    protected readonly connection: Connection;

    protected tsEntityManager: EntityManager | null;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    protected getRepository<T>(target: ObjectType<T>): Repository<T> {
        return this.tsEntityManager ? this.tsEntityManager.getRepository(target) : this.connection.getRepository(target)
    }

    public doTransaction<T>(body: () => Promise<T>): Promise<T> {
        return this.connection.transaction(async tsEntityManager => {
            this.tsEntityManager = tsEntityManager;
            const res = await body();
            this.tsEntityManager = null;
            return res;
        })
    }

}

