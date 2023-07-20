import { ConfigKey } from './ConfigKey';
import { ConfigType } from './ConfigType';
import { LoernwerkError, LoernwerkErrorCodes } from '../loernwerkError';
import { RegistrationType } from './RegistrationType';

/**
 * Utility class to get the type of a configuration setting.
 */
export class ConfigTypeMap {
    /**
     * Gets the type of the value to the given configuration setting
     * @param key configuration of which the type is requested
     * @returns type of the value of the setting
     */
    public static getType(key: ConfigKey): ConfigType {
        switch (key) {
            case ConfigKey.MAX_SEQUENCES_PER_USER:
                return { type: 'number', options: 'unlimited' };

            case ConfigKey.MAX_SLIDES_PER_SEQUENCE:
                return { type: 'number', options: 'unlimited' };

            case ConfigKey.REGISTRATION_TYPE:
                return { type: 'enum', options: Object.values(RegistrationType) };
            case ConfigKey.REGISTRATION_CODE:
                return {type: 'code', options: {length: 8, rollable: true}}
            default:
                throw new LoernwerkError(
                    'Unknown config key',
                    LoernwerkErrorCodes.INVALID_PARAMETER
                );
        }
    }
}
