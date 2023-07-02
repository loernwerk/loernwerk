import { Router } from 'express';
import { RouterFactory } from './RouterFactory';
import { AccountController } from '../controller/AccountController';
import { UserClass } from '../../model/user/IUser';
import {
    LoernwerkErrorCodes,
    requireAdmin,
    requireBody,
    requireLogin,
} from '../loernwerkUtilities';

/**
 * Builds router for request regarding Account management
 */
export class AccountRouterFactory extends RouterFactory {
    /**
     * Builds router for Account management
     * @returns built router
     */
    public buildRouter(): Router {
        const accountRouter = Router();

        accountRouter.post(
            '/login',
            requireBody('usernameOrEmail', 'password'),
            async (req, res) => {
                try {
                    const user = await AccountController.tryLogin(
                        req.body.usernameOrEmail,
                        req.body.password
                    );
                    req.session.userId = user.id;
                    req.session.isAdmin = user.type === UserClass.ADMIN;
                } catch {
                    res.sendStatus(400);
                    return;
                }
                if (req.body.stayLoggedIn) {
                    //TODO: unklar ob das so geht
                    req.session.cookie.maxAge = undefined;
                }
                res.sendStatus(204);
            }
        );

        accountRouter.put(
            '/',
            requireAdmin,
            requireBody('username', 'email', 'password'),
            async (req, res) => {
                try {
                    const user = await AccountController.createNewAccount(
                        req.body
                    );
                    res.status(201).json({ id: user.id });
                } catch {
                    res.sendStatus(400);
                }
            }
        );

        accountRouter.patch(
            '/',
            requireLogin,
            requireBody('id'),
            async (req, res) => {
                //to change user data, user has to be admin or change its own data
                if (
                    req.body.id !== req.session.userId &&
                    !req.session.isAdmin
                ) {
                    res.sendStatus(403);
                    return;
                }

                //only admins can change user class
                if (req.body.type !== undefined && !req.session.isAdmin) {
                    res.sendStatus(403);
                    return;
                }

                try {
                    await AccountController.saveAccount(req.body);
                    res.sendStatus(204);
                } catch (error) {
                    switch (error.code) {
                        case LoernwerkErrorCodes.NOT_FOUND:
                            res.sendStatus(404);
                            break;
                        default:
                            res.sendStatus(400);
                            break;
                    }
                }
            }
        );

        accountRouter.delete(
            '/',
            requireAdmin,
            requireBody('id'),
            async (req, res) => {
                try {
                    await AccountController.deleteAccount(req.body.id);
                    res.sendStatus(204);
                } catch {
                    res.sendStatus(404);
                    return;
                }
            }
        );

        accountRouter.get('/', requireLogin, async (req, res) => {
            const user = await AccountController.getAccountById(
                req.session.userId as number
            );
            res.status(200).json({
                id: user.id,
                username: user.name,
                email: user.mail,
            });
        });

        accountRouter.get('/:ids', async (req, res) => {
            const map = {};
            const listIds = req.params.ids.split(',');
            for (const id of listIds) {
                try {
                    const user = await AccountController.getAccountById(
                        parseInt(id)
                    );
                    map[parseInt(id)] = user.name;
                } catch {
                    continue;
                }
            }

            if (Object.keys(map).length === 0) {
                res.sendStatus(404);
            } else {
                res.status(200).json(map);
            }
        });

        accountRouter.get('/list', requireAdmin, async (req, res) => {
            const listUsers = await AccountController.getAllAccounts();
            res.status(200).json({ listUsers });
        });

        return accountRouter;
    }
}
