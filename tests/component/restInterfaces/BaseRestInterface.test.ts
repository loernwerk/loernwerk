import { BaseRestInterface } from '../../../frontend/src/restInterfaces/BaseRestInterface';
import { vi } from 'vitest';
import axios, { AxiosError, AxiosHeaders } from 'axios';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../../model/loernwerkError';

/**
 * Dummy class to test BaseRestInterface
 */
class DummyRestInterface extends BaseRestInterface {
    /**
     * Wrapper for get
     * @param url url
     * @returns axios result data
     */
    public static async getWrapper<T>(url: string): Promise<T> {
        return await BaseRestInterface.get<T>(url);
    }

    /**
     * Wrapper for post
     * @param url url
     * @param body body
     * @returns axios result data
     */
    public static async postWrapper<T>(url: string, body: unknown): Promise<T> {
        return await BaseRestInterface.post<T>(url, body);
    }

    /**
     * Wrapper for put
     * @param url url
     * @param body body
     * @returns axios result data
     */
    public static async putWrapper<T>(url: string, body: unknown): Promise<T> {
        return await BaseRestInterface.put<T>(url, body);
    }

    /**
     * Wrapper for patch
     * @param url url
     * @param body body
     * @returns axios result data
     */
    public static async patchWrapper<T>(
        url: string,
        body: unknown
    ): Promise<T> {
        return await BaseRestInterface.patch<T>(url, body);
    }

    /**
     * Wrapper for delete
     * @param url url
     * @param body body
     */
    public static async deleteWrapper(
        url: string,
        body: unknown
    ): Promise<void> {
        await BaseRestInterface.delete(url, body);
    }

    /**
     * Wrapper for getBaseURL
     * @returns the base url
     */
    public static getBaseURLWrapper(): string {
        return BaseRestInterface.getBaseURL();
    }
}

describe('BaseRestInterface', () => {
    beforeAll(() => {
        vi.mock('axios');
        const mockWindow = Object.create(window);
        vi.spyOn(global.window, 'window', 'get').mockImplementation(() => {
            mockWindow.location.hostname = 'http://localhost:8080';
            return mockWindow;
        });
    });

    test('get', async () => {
        axios.get = vi.fn().mockResolvedValue({ data: { value: 2 } });
        const result = await DummyRestInterface.getWrapper<{ value: number }>(
            '/test'
        );

        expect(axios.get).toBeCalledWith('null/api/test', {
            withCredentials: true,
        });
        expect(result.value).toBe(2);
    });

    test('get error', async () => {
        axios.get = vi.fn().mockRejectedValue({});
        await expect(
            DummyRestInterface.getWrapper<{ value: number }>('test')
        ).rejects.toThrow();
    });

    test('post', async () => {
        axios.post = vi.fn().mockResolvedValue({ data: { value: 2 } });
        const result = await DummyRestInterface.postWrapper<{ value: number }>(
            '/test',
            { value: 2 }
        );

        expect(axios.post).toBeCalledWith(
            'null/api/test',
            { value: 2 },
            { withCredentials: true }
        );
        expect(result.value).toBe(2);
    });

    test('post error', async () => {
        axios.post = vi.fn().mockRejectedValue({});
        await expect(
            DummyRestInterface.postWrapper<{ value: number }>('test', {
                value: 2,
            })
        ).rejects.toThrow();
    });

    test('put', async () => {
        axios.put = vi.fn().mockResolvedValue({ data: { value: 2 } });
        const result = await DummyRestInterface.putWrapper<{ value: number }>(
            '/test',
            { value: 2 }
        );

        expect(axios.put).toBeCalledWith(
            'null/api/test',
            { value: 2 },
            { withCredentials: true }
        );
        expect(result.value).toBe(2);
    });

    test('put error', async () => {
        axios.put = vi.fn().mockRejectedValue({});
        await expect(
            DummyRestInterface.putWrapper<{ value: number }>('test', {
                value: 2,
            })
        ).rejects.toThrow();
    });

    test('patch', async () => {
        axios.patch = vi.fn().mockResolvedValue({ data: { value: 2 } });
        const result = await DummyRestInterface.patchWrapper<{ value: number }>(
            '/test',
            { value: 2 }
        );

        expect(axios.patch).toBeCalledWith(
            'null/api/test',
            { value: 2 },
            { withCredentials: true }
        );
        expect(result.value).toBe(2);
    });

    test('patch error', async () => {
        axios.patch = vi.fn().mockRejectedValue({});
        await expect(
            DummyRestInterface.patchWrapper<{ value: number }>('test', {
                value: 2,
            })
        ).rejects.toThrow();
    });

    test('delete', async () => {
        axios.delete = vi.fn().mockResolvedValue({ data: {} });
        await DummyRestInterface.deleteWrapper('/test', { value: 2 });

        expect(axios.delete).toBeCalledWith('null/api/test', {
            withCredentials: true,
            data: { value: 2 },
        });
    });

    test('delete error', async () => {
        axios.delete = vi.fn().mockRejectedValue({});
        await expect(
            DummyRestInterface.deleteWrapper('test', { value: 2 })
        ).rejects.toThrow();
    });

    test('getBaseURL', () => {
        expect(DummyRestInterface.getBaseURLWrapper()).toBe('null/api');
    });

    test('Error 404', async () => {
        axios.get = vi.fn().mockImplementation(() => {
            throw getAxiosError('Not found', 404);
        });

        let error: LoernwerkError | null = null;
        try {
            await DummyRestInterface.getWrapper('test');
        } catch (e) {
            error = e;
        }

        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(LoernwerkError);
        expect(error?.code).toBe(LoernwerkErrorCodes.NOT_FOUND);
    });

    test('Error 400', async () => {
        axios.get = vi.fn().mockImplementation(() => {
            throw getAxiosError('Bad Request', 400);
        });

        let error: LoernwerkError | null = null;
        try {
            await DummyRestInterface.getWrapper('test');
        } catch (e) {
            error = e;
        }

        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(LoernwerkError);
        expect(error?.code).toBe(LoernwerkErrorCodes.BAD_REQUEST);
    });

    test('Error 401', async () => {
        axios.get = vi.fn().mockImplementation(() => {
            throw getAxiosError('Unauthorized', 401);
        });

        let error: LoernwerkError | null = null;
        try {
            await DummyRestInterface.getWrapper('test');
        } catch (e) {
            error = e;
        }

        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(LoernwerkError);
        expect(error?.code).toBe(LoernwerkErrorCodes.UNAUTHORIZED);
    });

    test('Error 403', async () => {
        axios.get = vi.fn().mockImplementation(() => {
            throw getAxiosError('Forbidden', 403);
        });

        let error: LoernwerkError | null = null;
        try {
            await DummyRestInterface.getWrapper('test');
        } catch (e) {
            error = e;
        }

        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(LoernwerkError);
        expect(error?.code).toBe(LoernwerkErrorCodes.FORBIDDEN);
    });

    test('Error 402', async () => {
        axios.get = vi.fn().mockImplementation(() => {
            throw getAxiosError('Payment Required', 402);
        });

        let error: LoernwerkError | null = null;
        try {
            await DummyRestInterface.getWrapper('test');
        } catch (e) {
            error = e;
        }

        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(LoernwerkError);
        expect(error?.code).toBe(LoernwerkErrorCodes.UNKNOWN);
    });
});

/**
 * Creates a dummy AxiosError
 * @param message text of the error
 * @param status html status code
 * @returns a dummy AxiosError
 */
function getAxiosError(message: string, status: number): AxiosError {
    const error = new AxiosError(message, status.toString(), undefined, null);
    error.response = {
        data: message,
        status,
        statusText: message,
        headers: {},
        config: {
            headers: new AxiosHeaders(),
        },
    };
    return error;
}
