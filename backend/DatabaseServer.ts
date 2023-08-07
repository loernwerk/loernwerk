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
import { H5PReusability1691157808340 } from './db_migrations/1691157808340-H5P-Reusability';
import { access } from 'fs/promises';

/**
 * Handles database connection for the backend server.
 */
export class DatabaseServer {
    private static instance: DatabaseServer | null = null;

    private db: DataSource;
    private dbFile: string;

    /**
     * Builds a new database connection, without actually connecting to it.
     * @private
     */
    private constructor() {
        this.dbFile = process.env.DATABASE_FILE || 'loernwerk.db';

        this.db = new DataSource({
            type: 'sqlite',
            database: this.dbFile,
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
            migrations: [H5PReusability1691157808340],
        });

        console.log(`Loaded database file: ${this.dbFile}`);
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
        if (await this.databaseExists()) {
            await this.db.initialize();
            const migrations = await this.db.runMigrations();
            if (migrations.length > 0) {
                console.log(
                    `Successfully ran ${
                        migrations.length
                    } migrations: ${migrations
                        .map((migration) => migration.name)
                        .join(', ')}`
                );
            }
        } else {
            await this.db.initialize();
            await this.db.synchronize();
            // Faking all migrations since after the synchronize call, all our tables are up to date anyways
            await this.db.runMigrations({ fake: true });
        }
        console.log('Database connection established.');
    }

    /**
     * Destroys the database connection.
     */
    public destroy(): void {
        void this.db.destroy();
    }

    /**
     * Tries to access the database file in order to figure out if it exists.
     * @private
     * @returns true, if the database file exists, false otherwise
     */
    private async databaseExists(): Promise<boolean> {
        // Every `exists` method is deprecated, so we have to do this
        try {
            await access(this.dbFile);
            return true;
        } catch {
            return false;
        }
    }
}
