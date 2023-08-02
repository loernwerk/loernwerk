import { DataSource } from 'typeorm';
import { DBSequence } from '../model/sequence/DBSequence';
import { DBSlide } from '../model/slide/DBSlide';
import { DBUser } from '../model/user/DBUser';
import 'reflect-metadata';
import 'dotenv/config';
import { DBH5PFile } from '../model/h5p/DBH5PFile';
import { DBH5PContent, DBH5PContentUsedBy } from '../model/h5p/DBH5PContent';
import { DBH5PLibrary } from '../model/h5p/DBH5PLibrary';
import { DBConfigEntry } from '../model/configuration/DBConfigEntry';

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
        const database = process.env.DATABASE_FILE || 'loernwerk.db';

        this.db = new DataSource({
            type: 'sqlite',
            database: database,
            entities: [
                DBSlide,
                DBSequence,
                DBUser,
                DBH5PFile,
                DBH5PContent,
                DBH5PLibrary,
                DBH5PContentUsedBy,
                DBConfigEntry,
            ],
        });

        console.log(`Loaded database file: ${database}`);
    }

    /**
     * Returns the current instance of the DatabaseServer, or creates a new one, if none exists.
     * @returns Current instance of the database server
     */
    public static getInstance(): DatabaseServer {
        if (DatabaseServer.instance === null) {
            this.instance = new DatabaseServer();
        }
        return this.instance as DatabaseServer;
    }

    /**
     * Initializes the database connection and connects to the database.
     */
    public async initialize(): Promise<void> {
        await this.db.initialize();
        await this.db.synchronize();
        console.log('Database connection established.');
    }

    /**
     * Destroys the database connection.
     */
    public destroy(): void {
        void this.db.destroy();
    }
}
