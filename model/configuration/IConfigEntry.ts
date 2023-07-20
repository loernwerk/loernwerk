import { ConfigKey } from './ConfigKey';

/**
 * Contains configuration setting as pair of values.
 */
export interface IConfigEntry {
    /**
     * Corresponds the type of the configruation setting
     */
    key: ConfigKey;

    /**
     * Corresponds the value of the configruation setting
     */
    value: unknown;
}
