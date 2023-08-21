import { AccountRouterFactory } from '../../backend/router/AccountRouterFactory';
import { Router } from 'express';
import { AccountController } from '../../backend/controller/AccountController';
import { UserClass } from '../../model/user/IUser';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../model/loernwerkError';

const sendStatusFn = jest.fn();
/**
 * Calls the handlefunction on the given router
 * @param router the router to call on
 * @param param params that can be an value assigned on
 */
function handleRouter(router: Router, param: RouterOption): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.handle(param, { sendStatus: sendStatusFn });
}

describe('Accountrouter tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('Logout', () => {
        const router = new AccountRouterFactory().buildRouter();

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
        const router = new AccountRouterFactory().buildRouter();
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
        const router = new AccountRouterFactory().buildRouter();
        const loginFn = jest.spyOn(AccountController, 'tryLogin');
        loginFn.mockResolvedValueOnce({
            name: 'test',
            mail: 'test@test.de',
            type: UserClass.ADMIN,
            sharedSequencesReadAccess: [],
            sharedSequencesWriteAccess: [],
            password: 'test',
            id: 1234,
        });

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
});

interface RouterOption {
    url?: string;
    method?: string;
    session?: {
        userId?: number;
        // eslint-disable-next-line
        destroy?: any;
    };
    // eslint-disable-next-line
    body?: any;
}
