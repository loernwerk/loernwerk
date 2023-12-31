import { Router } from 'express';
import { RouterFactory } from './RouterFactory';
import { AccountController } from '../controller/AccountController';
import { IUser, UserClass } from '../../model/user/IUser';
import { requireAdmin, requireBody, requireLogin } from '../loernwerkUtilities';
import { LoernwerkErrorCodes } from '../../model/loernwerkError';
import { ConfigController } from '../controller/ConfigController';
import { ConfigKey } from '../../model/configuration/ConfigKey';
import { RegistrationType } from '../../model/configuration/RegistrationType';

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
                } catch (e) {
                    res.status(400).send(e.message);
                    return;
                }
                if (req.body.stayLoggedIn) {
                    req.session.cookie.maxAge = undefined;
                }
                res.sendStatus(204);
            }
        );

        accountRouter.post('/logout', requireLogin, (req, res) => {
            req.session.destroy(() => {
                res.sendStatus(204);
            });
        });

        accountRouter.put(
            '/',
            requireBody('name', 'mail', 'password'),
            async (req, res) => {
                let removecode = '';
                if (!req.session.isAdmin) {
                    const registrationConfig =
                        await ConfigController.getConfigEntry(
                            ConfigKey.REGISTRATION_TYPE
                        );
                    switch (registrationConfig) {
                        case RegistrationType.CLOSED: {
                            res.sendStatus(401);
                            return;
                        }
                        case RegistrationType.INVITATION: {
                            const code = req.body.registrationCode?.toString();
                            if (
                                code === undefined ||
                                !(await ConfigController.isValidInviteCode(
                                    code
                                ))
                            ) {
                                res.sendStatus(401);
                                return;
                            }
                            if (
                                (await ConfigController.getConfigEntry(
                                    ConfigKey.REGISTRATION_CODES_EXPIRES_AFTER_USE
                                )) === true
                            ) {
                                removecode = code;
                            }
                        }
                    }
                }

                try {
                    const user = await AccountController.createNewAccount(
                        req.body
                    );
                    if (removecode !== '') {
                        ConfigController.removeInviteCode(removecode);
                    }
                    res.status(201).json({ id: user.id });
                } catch (e) {
                    res.status(400).send(e.message);
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
                            res.status(404).send(error.message);
                            break;
                        default:
                            res.status(400).send(error.message);
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
            let id = req.session.userId as number;
            if (req.query.id !== undefined) {
                id = parseInt(req.query.id as string);
                if (req.session.isAdmin !== true) {
                    res.sendStatus(403);
                    return;
                }
            }

            let user: IUser;
            try {
                if (req.query.name !== undefined) {
                    user = await AccountController.getAccountByUsername(
                        req.query.name as string
                    );
                } else if (req.query.mail !== undefined) {
                    user = await AccountController.getAccountByEmail(
                        req.query.mail as string
                    );
                } else {
                    user = await AccountController.getAccountById(id);
                }
            } catch {
                res.sendStatus(404);
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

        return accountRouter;
    }
}
