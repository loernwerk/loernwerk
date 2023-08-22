import { AccountRouterFactory } from '../../backend/router/AccountRouterFactory';
import { SequenceRouterFactory } from '../../backend/router/SequenceRouterFactory';
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
import { ISequence } from '../../model/sequence/ISequence';
import { SequenceController } from '../../backend/controller/SequenceController';

interface ResponseToolkit {
    sendStatus: jest.Func;
    status: jest.Func;
    send: jest.Func;
    json: jest.Func;
}

/**
 * Calls the handlefunction on the given router, and awaits until either the timeout runs out, or a send-type function is called.
 * @param router the router to call on
 * @param req params that can be an value assigned on
 * @param timeout Optional timeout parameter for the request in ms. Defaults to 30s.
 * @returns ResponseToolkit containing all response-mock-functions
 */
async function handleRouter(
    router: Router,
    req: RouterOption,
    timeout = 30000
): Promise<ResponseToolkit> {
    return new Promise((resolve, reject) => {
        // implementing timeout so this doesnt hang forever
        const timeoutFunc = setTimeout(reject, timeout, 'Timeout exceeded');

        const responseToolkit = {
            sendStatus: jest.fn(),
            status: jest.fn(),
            send: jest.fn(),
            json: jest.fn(),
        };

        /**
         * Local helper function for clearing the timeout and resolving the promise.
         */
        function resolveFunc(): void {
            clearTimeout(timeoutFunc);
            resolve(responseToolkit);
        }

        // Terminal
        responseToolkit.sendStatus.mockImplementation(resolveFunc);
        responseToolkit.send.mockImplementation(resolveFunc);
        responseToolkit.json.mockImplementation(resolveFunc);

        // Non-terminal
        responseToolkit.status.mockImplementation(() => {
            return responseToolkit;
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        router.handle(req, responseToolkit);
    });
}

const accountRouter = new AccountRouterFactory().buildRouter();
const sequenceRouter = new SequenceRouterFactory().buildRouter();

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
    });

    test('Logout', async () => {
        const destroyFn = jest.fn().mockImplementation((func) => {
            func();
        });

        const responseToolkit = await handleRouter(accountRouter, {
            url: '/logout',
            method: 'POST',
            session: {
                destroy: destroyFn,
                userId: 80,
            },
        });

        expect(destroyFn).toBeCalledTimes(1);
        expect(responseToolkit.sendStatus).toBeCalledWith(204);
    });

    test('incorrect login', async () => {
        const loginFn = jest.spyOn(AccountController, 'tryLogin');
        loginFn.mockImplementationOnce(() => {
            throw new LoernwerkError(
                'irgendwas',
                LoernwerkErrorCodes.BAD_REQUEST
            );
        });

        const responseToolkit = await handleRouter(accountRouter, {
            url: '/login',
            method: 'post',
            body: {
                usernameOrEmail: 'test',
                password: 'test',
            },
        });

        expect(loginFn).toBeCalledTimes(1);
        expect(loginFn).toBeCalledWith('test', 'test');
        expect(responseToolkit.sendStatus).toBeCalledWith(400);
    });

    test('login', async () => {
        //not working however
        const loginFn = jest.spyOn(AccountController, 'tryLogin');
        loginFn.mockResolvedValueOnce(testUser);

        const responseToolkit = await handleRouter(accountRouter, {
            url: '/login',
            method: 'post',
            body: {
                usernameOrEmail: 'test',
                password: 'test',
                stayLoggedIn: false,
            },
            session: {},
        });

        expect(loginFn).toBeCalledTimes(1);
        expect(loginFn).toBeCalledWith('test', 'test');
        expect(responseToolkit.sendStatus).toBeCalledWith(204);
    });

    test('Add Account Admin', async () => {
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
        const responseToolkit = await handleRouter(accountRouter, {
            url: '/',
            method: 'put',
            body: body,
            session: {
                isAdmin: true,
            },
        });

        expect(createAccountFn).toBeCalledTimes(1);
        expect(createAccountFn).toBeCalledWith(body);
        expect(responseToolkit.status).toBeCalledWith(201);
    });

    test('Add Account not Admin reject', async () => {
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

        const responseToolkit = await handleRouter(accountRouter, {
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
        expect(responseToolkit.sendStatus).toBeCalledWith(401);
    });

    test('patch Account reject', async () => {
        const responseToolkit = await handleRouter(accountRouter, {
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

        expect(responseToolkit.sendStatus).toBeCalledWith(403);
    });

    test('delete Account', async () => {
        const deleteAccountFn = jest.spyOn(AccountController, 'deleteAccount');
        deleteAccountFn.mockResolvedValueOnce();

        const responseToolkit = await handleRouter(accountRouter, {
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
        expect(responseToolkit.sendStatus).toBeCalledWith(204);
    });

    test('get own account', async () => {
        const getAccountByIdFn = jest.spyOn(
            AccountController,
            'getAccountById'
        );
        getAccountByIdFn.mockResolvedValueOnce(testUser);
        const responseToolkit = await handleRouter(accountRouter, {
            url: '/',
            method: 'get',
            body: testUser,
            session: {
                isAdmin: true,
                userId: testUser.id,
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
        expect(responseToolkit.status).toBeCalledWith(200);
        expect(responseToolkit.json).toBeCalledWith({
            id: testUser.id,
            mail: testUser.mail,
            name: testUser.name,
            type: testUser.type,
        });
    });

    test('get account by id as admin', async () => {
        const getAccountByIdFn = jest.spyOn(
            AccountController,
            'getAccountById'
        );
        getAccountByIdFn.mockResolvedValueOnce(testUser);
        const responseToolkit = await handleRouter(accountRouter, {
            url: '/',
            method: 'get',
            body: testUser,
            session: {
                isAdmin: true,
                userId: 100,
                username: 'test',
                email: 'test@test.de',
            },
            query: {
                id: testUser.id,
                name: undefined,
                mail: undefined,
            },
        });

        expect(getAccountByIdFn).toBeCalledTimes(1);
        expect(getAccountByIdFn).toBeCalledWith(testUser.id);
        expect(responseToolkit.status).toBeCalledWith(200);
        expect(responseToolkit.json).toBeCalledWith({
            id: testUser.id,
            mail: testUser.mail,
            name: testUser.name,
            type: testUser.type,
        });
    });

    test('get account by id not as admin', async () => {
        const getAccountByIdFn = jest.spyOn(
            AccountController,
            'getAccountById'
        );
        getAccountByIdFn.mockResolvedValueOnce(testUser);
        const responseToolkit = await handleRouter(accountRouter, {
            url: '/',
            method: 'get',
            body: testUser,
            session: {
                isAdmin: false,
                userId: 100,
                username: 'test',
                email: 'test@test.de',
            },
            query: {
                id: testUser.id,
                name: undefined,
                mail: undefined,
            },
        });

        expect(getAccountByIdFn).toBeCalledTimes(0);
        expect(responseToolkit.sendStatus).toBeCalledWith(403);
    });
    test('get account by mail', async () => {
        const getAccountByMailFn = jest.spyOn(
            AccountController,
            'getAccountByEmail'
        );
        getAccountByMailFn.mockResolvedValueOnce(testUser);
        const responseToolkit = await handleRouter(accountRouter, {
            url: '/',
            method: 'get',
            body: testUser,
            session: {
                isAdmin: false,
                userId: 100,
                username: 'test',
                email: 'test@test.de',
            },
            query: {
                id: undefined,
                name: undefined,
                mail: testUser.mail,
            },
        });

        expect(getAccountByMailFn).toBeCalledTimes(1);
        expect(getAccountByMailFn).toBeCalledWith(testUser.mail);
        expect(responseToolkit.status).toBeCalledWith(200);
        expect(responseToolkit.json).toBeCalledWith({
            id: testUser.id,
            mail: testUser.mail,
            name: testUser.name,
            type: testUser.type,
        });
    });
    test('get account by name', async () => {
        const getAccountByMailFn = jest.spyOn(
            AccountController,
            'getAccountByEmail'
        );
        getAccountByMailFn.mockResolvedValueOnce(testUser);
        const responseToolkit = await handleRouter(accountRouter, {
            url: '/',
            method: 'get',
            body: testUser,
            session: {
                isAdmin: false,
                userId: 100,
                username: 'test',
                email: 'test@test.de',
            },
            query: {
                id: undefined,
                name: undefined,
                mail: testUser.mail,
            },
        });

        expect(getAccountByMailFn).toBeCalledTimes(1);
        expect(getAccountByMailFn).toBeCalledWith(testUser.mail);
        expect(responseToolkit.status).toBeCalledWith(200);
        expect(responseToolkit.json).toBeCalledWith({
            id: testUser.id,
            mail: testUser.mail,
            name: testUser.name,
            type: testUser.type,
        });
    });

    test('get list', async () => {
        const listFn = jest.spyOn(AccountController, 'getAllAccounts');
        const userlist = [
            {
                name: 'test',
            },
            {
                name: 'test2',
            },
        ];
        listFn.mockResolvedValueOnce(userlist);

        const responseToolkit = await handleRouter(accountRouter, {
            url: '/list',
            method: 'get',
            body: testUser,
            session: {
                isAdmin: true,
                userId: 100,
                username: 'test',
                email: 'test@test.de',
            },
        });
        expect(listFn).toBeCalledTimes(1);
        expect(responseToolkit.status).toBeCalledWith(200);
        expect(responseToolkit.json).toBeCalledWith(userlist);
    });

    test('get ids', async () => {
        const getAccountByIdFn = jest.spyOn(
            AccountController,
            'getAccountById'
        );
        getAccountByIdFn.mockRejectedValue(testUser);

        const list = '1,2,3';

        const responseToolkit = await handleRouter(accountRouter, {
            url: '/' + list,
            method: 'get',
            params: {
                ids: list,
            },
            session: {
                isAdmin: true,
                userId: 100,
                username: 'test',
                email: 'test@test.de',
            },
        });

        const map = {};
        const intarray: Array<Array<number>> = [];

        for (const x of list.split(',')) {
            map[x] = testUser.name;
            intarray.push([parseInt(x)]);
        }

        expect(getAccountByIdFn).toBeCalledTimes(intarray.length);
        expect(getAccountByIdFn.mock.calls).toEqual(intarray);
        expect(responseToolkit.status).toBeCalledWith(200);
        expect(responseToolkit.json).toBeCalledWith(map); // not working whyever
    });
});

const testSequence: ISequence = {
    name: 'test',
    code: 'ABCDEF',
    creationDate: new Date(),
    modificationDate: new Date(),
    readAccess: [],
    writeAccess: [],
    authorId: 1234,
    slideCount: 2,
    tags: [],
};

describe('Accountrouter tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('create Sequence', async () => {
        const createSeqFn = jest.spyOn(SequenceController, 'createNewSequence');
        createSeqFn.mockResolvedValueOnce(testSequence);
        const responseToolkit = await handleRouter(sequenceRouter, {
            url: '/',
            method: 'put',
            body: {
                name: testSequence.name,
            },
            session: {
                isAdmin: true,
                userId: testUser.id,
                username: testUser.name,
                email: testUser.mail,
            },
        });

        expect(createSeqFn).toBeCalledTimes(1);
        expect(createSeqFn).toBeCalledWith(testSequence.name, testUser.id);
        expect(responseToolkit.status).toBeCalledWith(201);
        expect(responseToolkit.json).toBeCalledWith({
            code: testSequence.code,
        });
    });
});

interface RouterOption {
    url?: string;
    method?: string;
    session?: {
        userId?: number;
        destroy?: jest.Func;
        isAdmin?: boolean;
        username?: string;
        email?: string;
    };
    query?: {
        id?: number;
        name?: string;
        mail?: string;
    };
    params?: unknown;
    body?: unknown;
}
