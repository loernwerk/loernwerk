import * as express from 'express';
import * as cors from 'cors';
import { DatabaseServer } from './DatabaseServer';

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
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

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
