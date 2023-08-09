import axios from 'axios';
import { ConfigRestInterface } from '../../../frontend/src/restInterfaces/ConfigRestInterface';
import { ConfigKey } from '../../../model/configuration/ConfigKey';
import { RegistrationType } from '../../../model/configuration/RegistrationType';
import { vi } from 'vitest';;

describe('ConfigRestInterface', () => {
    beforeAll(() => {
        vi.mock('axios');
        const mockWindow = Object.create(window);
        vi.spyOn(window, 'window', 'get').mockImplementation(() => {
            mockWindow.location.hostname = 'localhost';
            return mockWindow;
        });
    });

    test('getValue', async () => {
        axios.get = vi.fn().mockResolvedValue({ data: { value: 2 } });
        const result = await ConfigRestInterface.getValue(
            ConfigKey.MAX_SEQUENCES_PER_USER
        );

        expect(axios.get).toBeCalledWith(
            'null/api/config/max_sequences_per_user',
            { withCredentials: true }
        );
        expect(result).toBe(2);
    });

    test('setValue', async () => {
        axios.patch = vi.fn().mockResolvedValue({ data: {} });
        await ConfigRestInterface.setValue(ConfigKey.MAX_SEQUENCES_PER_USER, 2);

        expect(axios.patch).toBeCalledWith(
            'null/api/config/max_sequences_per_user',
            { value: 2 },
            { withCredentials: true }
        );
    });

    test('getAllValue', async () => {
        axios.get = vi
            .fn()
            .mockResolvedValue({
                data: {
                    max_sequences_per_user: 2,
                    max_slides_per_sequence: 10,
                    registration_codes: 'test123',
                    registration_type: RegistrationType.CLOSED,
                    registration_codes_expires_after_use: true,
                },
            });
        const result = await ConfigRestInterface.getAllValue();

        expect(axios.get).toBeCalledWith('null/api/config/', {
            withCredentials: true,
        });
        expect(result[ConfigKey.MAX_SEQUENCES_PER_USER]).toBe(2);
        expect(result[ConfigKey.MAX_SLIDES_PER_SEQUENCE]).toBe(10);
        expect(result[ConfigKey.REGISTRATION_CODES]).toBe('test123');
        expect(result[ConfigKey.REGISTRATION_TYPE]).toBe(
            RegistrationType.CLOSED
        );
        expect(result[ConfigKey.REGISTRATION_CODES_EXPIRES_AFTER_USE]).toBe(
            true
        );
    });
});
