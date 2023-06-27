import { DataSource } from 'typeorm';
import { DBSequence } from '../model/sequence/DBSequence';
import { DBSlide } from '../model/slide/DBSlide';
import { DBUser } from '../model/user/DBUser';
import 'reflect-metadata';

/**
 * Handles database connection for the backend server.
 */
export class DatabaseServer {
    private static instance: DatabaseServer | null = null;

    private db: DataSource;

    /**
     * Builds a new database connection, without actually connecting to it.
     * @private
     */
    private constructor() {
        this.db = new DataSource({
            type: 'better-sqlite3',
            database: 'dev.db', // TODO
            entities: [DBSlide, DBSequence, DBUser],
        });
    }

    /**
     * Returns the current instance of the DatabaseServer, or creates a new one, if none exists.
     * @returns Current instance of the database server
     */
    public static getInstance(): DatabaseServer {
        if (DatabaseServer.instance === null) {
            this.instance = new DatabaseServer();
        }
        return this.instance;
    }

    /**
     * Initializes the database connection and connects to the database.
     */
    public async initialize(): Promise<void> {
        await this.db.initialize();
        await this.db.synchronize(); // TODO: Other option to avoid dataloss?
        console.log('Database connection established.');
    }

    /**
     * Destroys the database connection.
     */
    public destroy(): void {
        void this.db.destroy();
    }
}
