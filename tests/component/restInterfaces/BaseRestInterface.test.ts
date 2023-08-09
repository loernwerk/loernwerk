import { BaseRestInterface } from '../../../frontend/src/restInterfaces/BaseRestInterface';
import { vi } from 'vitest';
import axios from 'axios';

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
});
