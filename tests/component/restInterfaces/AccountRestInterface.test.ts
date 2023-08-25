import { AccountRestInterface } from '../../../frontend/src/restInterfaces/AccountRestInterface';
import { vi } from 'vitest';
import axios from 'axios';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../../model/loernwerkError';

describe('AccountRestInterface', () => {
    beforeAll(() => {
        vi.mock('axios');
    });

    test('login', async () => {
        axios.post = vi.fn().mockResolvedValue({ data: true });
        await AccountRestInterface.tryLogin('test', 'test', false);

        expect(axios.post).toBeCalledWith(
            'http://localhost:5000/api/account/login',
            { usernameOrEmail: 'test', password: 'test', stayLoggedIn: false },
            { withCredentials: true }
        );
    });

    test('wrong login', async () => {
        axios.post = vi.fn().mockRejectedValue({});

        expect(
            AccountRestInterface.tryLogin('test', 'test', false)
        ).rejects.toStrictEqual(
            new LoernwerkError('', LoernwerkErrorCodes.UNKNOWN)
        );

        expect(axios.post).toBeCalledWith(
            'http://localhost:5000/api/account/login',
            { usernameOrEmail: 'test', password: 'test', stayLoggedIn: false },
            { withCredentials: true }
        );
    });

    test('logout', async () => {
        axios.post = vi.fn().mockResolvedValue({ data: {} });
        await AccountRestInterface.logout();

        expect(axios.post).toBeCalledWith(
            'http://localhost:5000/api/account/logout',
            {},
            { withCredentials: true }
        );
    });

    test('addAccount', async () => {
        axios.put = vi.fn().mockResolvedValue({ data: { id: 2 } });
        const result = await AccountRestInterface.addAccount(
            { name: 'test', password: 'test', mail: 'test@test.de' },
            'testCode'
        );

        expect(axios.put).toBeCalledWith(
            'http://localhost:5000/api/account/',
            {
                name: 'test',
                password: 'test',
                mail: 'test@test.de',
                registrationCode: 'testCode',
            },
            { withCredentials: true }
        );
        expect(result).toBe(2);
    });

    test('updateAccount', async () => {
        axios.patch = vi.fn().mockResolvedValue({ data: {} });
        await AccountRestInterface.updateAccount({
            name: 'test',
            mail: 'test',
            password: 'test',
        });

        expect(axios.patch).toBeCalledWith(
            'http://localhost:5000/api/account/',
            { name: 'test', mail: 'test', password: 'test' },
            { withCredentials: true }
        );
    });

    test('deleteAccount', async () => {
        axios.delete = vi.fn().mockResolvedValue({ data: {} });
        await AccountRestInterface.deleteAccount(2);

        expect(axios.delete).toBeCalledWith(
            'http://localhost:5000/api/account/',
            {
                data: { id: 2 },
                withCredentials: true,
            }
        );
    });

    test('getOwnAccount', async () => {
        axios.get = vi.fn().mockResolvedValue({
            data: { id: 2, name: 'test', mail: 'test@test.de' },
        });

        const result = await AccountRestInterface.getOwnAccount();

        expect(axios.get).toBeCalledWith('http://localhost:5000/api/account/', {
            withCredentials: true,
        });

        expect(result.id).toBe(2);
        expect(result.name).toBe('test');
        expect(result.mail).toBe('test@test.de');
    });

    test('getAccount', async () => {
        axios.get = vi.fn().mockResolvedValue({
            data: { id: 2, name: 'test', mail: 'test@test.de' },
        });
        const result = await AccountRestInterface.getAccount(2);

        expect(axios.get).toBeCalledWith(
            'http://localhost:5000/api/account/?id=2',
            {
                withCredentials: true,
            }
        );
        expect(result.id).toBe(2);
        expect(result.name).toBe('test');
        expect(result.mail).toBe('test@test.de');
    });

    test('getAccounts', async () => {
        axios.get = vi.fn().mockResolvedValue({
            data: {
                2: 'test',
                3: 'test2',
            },
        });
        const result = await AccountRestInterface.getAccounts([2, 3]);

        expect(axios.get).toBeCalledWith(
            'http://localhost:5000/api/account/2,3',
            {
                withCredentials: true,
            }
        );
        expect(Object.keys(result).length).toBe(2);
        expect(result[2]).toBe('test');
        expect(result[3]).toBe('test2');
    });

    test('getAccountMetaDataList', async () => {
        axios.get = vi.fn().mockResolvedValue({
            data: [
                { id: 2, name: 'test', mail: 'test@test.de' },
                { id: 3, name: 'test2', mail: 'test2@test.de' },
            ],
        });
        const result = await AccountRestInterface.getAccountMetaDataList();

        expect(axios.get).toBeCalledWith(
            'http://localhost:5000/api/account/list',
            {
                withCredentials: true,
            }
        );
        expect(result.length).toBe(2);
        expect(result[0].id).toBe(2);
        expect(result[0].name).toBe('test');
        expect(result[0].mail).toBe('test@test.de');
        expect(result[1].id).toBe(3);
        expect(result[1].name).toBe('test2');
        expect(result[1].mail).toBe('test2@test.de');
    });

    test('getAccountByUserName', async () => {
        axios.get = vi.fn().mockResolvedValue({
            data: { id: 2, name: 'test', mail: 'test@test.de' },
        });
        const result = await AccountRestInterface.getAccountByUserName('test');

        expect(axios.get).toBeCalledWith(
            'http://localhost:5000/api/account/?name=test',
            {
                withCredentials: true,
            }
        );
        expect(result.id).toBe(2);
        expect(result.name).toBe('test');
        expect(result.mail).toBe('test@test.de');
    });

    test('getAccountByEmail', async () => {
        axios.get = vi.fn().mockResolvedValue({
            data: { id: 2, name: 'test', mail: 'test@test.de' },
        });

        const result = await AccountRestInterface.getAccountByEmail(
            'test@test.de'
        );

        expect(axios.get).toBeCalledWith(
            'http://localhost:5000/api/account/?mail=test@test.de',
            {
                withCredentials: true,
            }
        );
        expect(result.id).toBe(2);
        expect(result.name).toBe('test');
        expect(result.mail).toBe('test@test.de');
    });
});
