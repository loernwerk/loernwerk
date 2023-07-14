import { Router } from 'express';
import { RouterFactory } from './RouterFactory';
import { requireAdmin, requireBody } from '../loernwerkUtilities';

/**
 * Builds router for requests regarding configuration (by admin).
 */
export class ConfigRouterFactory extends RouterFactory {
    /**
     * Builds router for configuration management
     * @returns built router
     */
    public buildRouter(): Router {
        const configRouter = Router();

        configRouter.patch(
            '/:key',
            requireAdmin,
            requireBody('value'),
            async (req, res) => {
                try {
                    /*
                     *await ConfigController.changeConig(
                     *  req.params.key,
                     *  req.body.value
                     *);
                     */
                    res.sendStatus(204);
                } catch {
                    res.sendStatus(404);
                }
            }
        );

        configRouter.get('/', requireAdmin, async (req, res) => {
            /*const config = await ConfigController.loadConfig(); */
            res.sendStatus(200);
        });

        configRouter.get('/:key', async (req, res) => {
            //TODO Überpfrüfe ob berechtigungen
            try {
                /*
                 *const value = await ConfigController.loadSingeConfig(
                 *req.params.key
                 *)
                 */
                res.status(200).json(value);
            } catch {
                res.sendStatus(400);
            }
        });

        return configRouter;
    }
}
