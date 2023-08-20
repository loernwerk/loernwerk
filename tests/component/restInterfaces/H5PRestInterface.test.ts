import axios from 'axios';
import { H5PRestInterface } from '../../../frontend/src/restInterfaces/H5PRestInterface';
import { vi } from 'vitest';

/**
 * This test does not mock actual H5P data and rather creates dummy data to check if calls happened to the correct endpoints
 */
describe('H5PRestInterface', () => {
    beforeAll(() => {
        vi.mock('axios');
        const mockWindow = Object.create(window);
        vi.spyOn(window, 'window', 'get').mockImplementation(() => {
            mockWindow.location.hostname = 'localhost';
            return mockWindow;
        });
    });

    test('createH5PContent', async () => {
        axios.put = vi.fn().mockResolvedValue({ data: { dummy: 'data' } });
        const result = await H5PRestInterface.createH5PContent({
            library: 'test',
            params: 'test',
        });

        expect(axios.put).toBeCalledWith(
            'http://localhost:5000/api/h5p/',
            { library: 'test', params: 'test' },
            { withCredentials: true }
        );
        expect(result).toStrictEqual({ dummy: 'data' });
    });

    test('getH5PContent', async () => {
        axios.get = vi.fn().mockResolvedValue({ data: { dummy: 'data' } });
        const result = await H5PRestInterface.getH5PContent('test', 'de');

        expect(axios.get).toBeCalledWith(
            'http://localhost:5000/api/h5p/test/edit?lang=de',
            {
                withCredentials: true,
            }
        );
        expect(result).toStrictEqual({ dummy: 'data' });
    });

    test('editH5PContent', async () => {
        axios.patch = vi.fn().mockResolvedValue({ data: { dummy: 'data' } });
        const result = await H5PRestInterface.editH5PContent('test', {
            library: 'test',
            params: 'test',
        });

        expect(axios.patch).toBeCalledWith(
            'http://localhost:5000/api/h5p/test/edit',
            { library: 'test', params: 'test' },
            { withCredentials: true }
        );
        expect(result).toStrictEqual({ dummy: 'data' });
    });

    test('getH5PContentForExecution', async () => {
        axios.get = vi.fn().mockResolvedValue({ data: { dummy: 'data' } });
        const result = await H5PRestInterface.getH5PContentForExecution('test');

        expect(axios.get).toBeCalledWith(
            'http://localhost:5000/api/h5p/test/view',
            {
                withCredentials: true,
            }
        );
        expect(result).toStrictEqual({ dummy: 'data' });
    });
});
