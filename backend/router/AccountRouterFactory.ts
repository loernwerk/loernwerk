import { Router } from 'express';
import { RouterFactory } from './RouterFactory';
import { AccountController } from '../controller/AccountController';
import { IUser, UserClass } from '../../model/user/IUser';
import { requireAdmin, requireBody, requireLogin } from '../loernwerkUtilities';
import { LoernwerkErrorCodes } from '../../model/loernwerkError';

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
                    req.session.username = user.name;
                    req.session.email = user.mail;
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
            requireBody('name', 'mail', 'password'),
            async (req, res) => {
                try {
                    const user = await AccountController.createNewAccount(
                        req.body
                    );
                    res.status(201).json({ id: user.id });
                } catch (e) {
                    console.log(e.message);
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
            const reqUserId = req.query.id;
            let id: number;
            if (reqUserId !== null) {
                id = parseInt(reqUserId as string);
                if (req.session.isAdmin !== true) {
                    res.status(403);
                    return;
                }
            } else {
                id = req.session.userId as number;
            }
            let user: IUser;

            try {
                user = await AccountController.getAccountById(id);
            } catch (e) {
                res.status(404);
                return;
            }

            res.status(200).json({
                id: user.id,
                name: user.name,
                mail: user.mail,
                type: user.type,
            });
        });

        accountRouter.get('/list', requireAdmin, async (req, res) => {
            const listUsers = await AccountController.getAllAccounts();
            res.status(200).json(listUsers);
        });

        return accountRouter;

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
    }
}
