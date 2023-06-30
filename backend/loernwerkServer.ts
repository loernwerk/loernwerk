import express, { json, urlencoded } from 'express';
import cors from 'cors';
import { DatabaseServer } from './DatabaseServer';
import session from 'express-session';
import { randomBytes } from 'crypto';
import MemoryStore from 'memorystore';

/**
 * Main class and entrypoint of the backend server.
 */
class loernwerkServer {
    /**
     * Entrypoint of the backend server.
     */
    public static async main(): Promise<void> {
        console.log('loernwerk booting up.');

        // Setting up webserver, database server
        const app = express();
        await DatabaseServer.getInstance().initialize();

        // Setting up Cross-Origin-Resource-Sharing for dev environment
        app.use(
            cors({
                credentials: true,
                origin: 'http://localhost:8080',
            })
        );

        // Setting up parsers to parse HTTP bodies
        app.use(json());
        app.use(urlencoded({ extended: true }));

        // Setting up cookies
        app.use(
            session({
                name: 'loernwerk.session',
                resave: false,
                saveUninitialized: false,
                secret: randomBytes(64).toString('hex'),
                cookie: {
                    maxAge: 1000 * 60 * 60 * 24,
                },
                store: new (MemoryStore(session))({
                    checkPeriod: 1000 * 60 * 60,
                }),
            })
        );

        // Setting up routers, TODO
        app.get('/', (req, res) => {
            res.send('Yup, working');
        });

        // Graceful shutdown listener
        process.on('SIGINT', () => {
            console.log(''); // Empty line to avoid ^C from some shells
            console.log('loernwerk shutting down');
            DatabaseServer.getInstance().destroy();
            process.exit(0);
        });

        // Starting the server
        app.listen(5000, () => {
            console.log('loernwerk running @ localhost:5000');
        });
    }
}

void loernwerkServer.main();
