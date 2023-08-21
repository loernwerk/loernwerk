import { AccountRouterFactory } from '../../backend/router/AccountRouterFactory';
import { Router } from 'express';
import { AccountController } from '../../backend/controller/AccountController';
import { UserClass } from '../../model/user/IUser';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../model/loernwerkError';
import { ConfigController } from '../../backend/controller/ConfigController';
import { RegistrationType } from '../../model/configuration/RegistrationType';
import { ConfigKey } from '../../model/configuration/ConfigKey';

const sendStatusFn = jest.fn();
const statusFn = jest.fn();
/**
 * Calls the handlefunction on the given router
 * @param router the router to call on
 * @param req params that can be an value assigned on
 */
function handleRouter(router: Router, req: RouterOption): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.handle(req, { sendStatus: sendStatusFn, status: statusFn });
}

let router = new AccountRouterFactory().buildRouter();
const testUser = {
    name: 'test',
    mail: 'test@test.de',
    type: UserClass.ADMIN,
    sharedSequencesReadAccess: [],
    sharedSequencesWriteAccess: [],
    password: 'test',
    id: 1234,
};

describe('Accountrouter tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
        router = new AccountRouterFactory().buildRouter();
    });
    test('Logout', () => {
        const destroyFn = jest.fn().mockImplementation((func) => {
            func();
        });

        handleRouter(router, {
            url: '/logout',
            method: 'POST',
            session: {
                destroy: destroyFn,
                userId: 80,
            },
        });

        expect(destroyFn).toBeCalledTimes(1);
        expect(sendStatusFn).toBeCalledWith(204);
    });

    test('incorrect login', () => {
        const loginFn = jest.spyOn(AccountController, 'tryLogin');
        loginFn.mockImplementationOnce(() => {
            throw new LoernwerkError(
                'irgendwas',
                LoernwerkErrorCodes.BAD_REQUEST
            );
        });
        handleRouter(router, {
            url: '/login',
            method: 'post',
            body: {
                usernameOrEmail: 'test',
                password: 'test',
            },
        });

        expect(loginFn).toBeCalledTimes(1);
        expect(loginFn).toBeCalledWith('test', 'test');
        expect(sendStatusFn).toBeCalledWith(400);
    });

    test('login', () => {
        //not working however
        const loginFn = jest.spyOn(AccountController, 'tryLogin');
        loginFn.mockResolvedValueOnce(testUser);

        handleRouter(router, {
            url: '/login',
            method: 'post',
            body: {
                usernameOrEmail: 'test',
                password: 'test',
                stayLoggedIn: false,
            },
        });

        expect(loginFn).toBeCalledTimes(1);
        expect(loginFn).toBeCalledWith('test', 'test');
        expect(sendStatusFn).toBeCalledWith(204);
    });

    test('Add Account Admin', () => {
        const createAccountFn = jest.spyOn(
            AccountController,
            'createNewAccount'
        );
        createAccountFn.mockResolvedValueOnce(testUser);
        const body = {
            name: 'test',
            mail: 'test@test.de',
            password: 'test',
        };
        handleRouter(router, {
            url: '/',
            method: 'put',
            body: body,
            session: {
                isAdmin: true,
            },
        });

        expect(createAccountFn).toBeCalledTimes(1);
        expect(createAccountFn).toBeCalledWith(body);
        expect(statusFn).toBeCalledWith(204);
    });

    test('Add Account not Admin reject', () => {
        const getRegTypeFn = jest.spyOn(ConfigController, 'getConfigEntry');
        const createAccountFn = jest.spyOn(
            AccountController,
            'createNewAccount'
        );
        createAccountFn.mockResolvedValueOnce(testUser);
        getRegTypeFn.mockResolvedValueOnce(RegistrationType.CLOSED);
        const body = {
            name: 'test',
            mail: 'test@test.de',
            password: 'test',
        };
        handleRouter(router, {
            url: '/',
            method: 'put',
            body: body,
            session: {
                isAdmin: false,
            },
        });

        expect(getRegTypeFn).toBeCalledTimes(1);
        expect(getRegTypeFn).toBeCalledWith(ConfigKey.REGISTRATION_TYPE);
        expect(createAccountFn).toBeCalledTimes(0);
        expect(sendStatusFn).toBeCalledWith(401);
    });

    test('patch Account reject', () => {
        handleRouter(router, {
            url: '/',
            method: 'patch',
            body: testUser,
            session: {
                isAdmin: false,
                userId: 1,
                username: 'test',
                email: 'test@test.de',
            },
        });

        expect(sendStatusFn).toBeCalledWith(403);
    });

    test('delete Account', () => {
        const deleteAccountFn = jest.spyOn(AccountController, 'deleteAccount');
        deleteAccountFn.mockResolvedValueOnce();

        handleRouter(router, {
            url: '/',
            method: 'delete',
            body: testUser,
            session: {
                isAdmin: true,
                userId: 1,
                username: 'test',
                email: 'test@test.de',
            },
        });

        expect(deleteAccountFn).toBeCalledTimes(1);
        expect(deleteAccountFn).toBeCalledWith(1234);
        expect(sendStatusFn).toBeCalledWith(204);
    });

    test('get own account', () => {
        const getAccountByIdFn = jest.spyOn(
            AccountController,
            'getAccountById'
        );
        getAccountByIdFn.mockResolvedValueOnce(testUser);
        handleRouter(router, {
            url: '/',
            method: 'get',
            body: testUser,
            session: {
                isAdmin: true,
                userId: 1,
                username: 'test',
                email: 'test@test.de',
            },
            query: {
                id: undefined,
                name: undefined,
                mail: undefined,
            },
        });

        expect(getAccountByIdFn).toBeCalledTimes(1);
        expect(getAccountByIdFn).toBeCalledWith(testUser.id);
        expect(sendStatusFn).toBeCalledWith(200);
    });
});

interface RouterOption {
    url?: string;
    method?: string;
    session?: {
        userId?: number;
        // eslint-disable-next-line
        destroy?: any;
        isAdmin?: boolean;
        username?: string;
        email?: string;
    };
    query?: {
        id?: number;
        name?: string;
        mail?: string;
    };
    // eslint-disable-next-line
    body?: any;
}
