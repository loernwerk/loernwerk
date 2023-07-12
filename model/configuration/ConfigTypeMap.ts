import { ConfigKey } from './ConfigKey';
import { IConfigType } from './IConfigType';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../backend/loernwerkError';

/**
 * Utility class to get the type of a configuration setting.
 */
export class ConfigTypeMap {
    /**
     * Gets the type of the value to the given configuration setting
     * @param key configuration of which the type is requested
     * @returns type of the value of the setting
     */
    public static getType(key: ConfigKey): IConfigType {
        switch (key) {
            case ConfigKey.MAX_SEQUENCES_PER_USER:
                return { type: 'number' };

            case ConfigKey.MAX_SLIDES_PER_SEQUENCE:
                return { type: 'number' };

            default:
                throw new LoernwerkError(
                    'Unknown config key',
                    LoernwerkErrorCodes.INVALID_PARAMETER
                );
        }
    }
}
