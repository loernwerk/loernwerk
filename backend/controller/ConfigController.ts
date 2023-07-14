import { ConfigKey } from '../../model/configuration/ConfigKey';

/**
 * Manages configuration data in the database and handles requests for config requests
 */
export class ConfigController {
    /**
     * Searches a configurationentry from the database
     * @param key the configurationkey of the entry
     */
    public static async getConfigEntry(key: ConfigKey): Promise<unknown> {
        void key;
        throw new Error('Not implemented');
    }

    /**
     * Changes a configurationentry in the database
     * @param key the configurationkey of the entry
     * @param value the new value
     */
    public static async setConfigEntry(
        key: ConfigKey,
        value: unknown
    ): Promise<void> {
        void key;
        void value;
        throw new Error('Not implemented');
    }

    /**
     * returns all configurationentries from the database
     */
    public static async getAllConfigEntries(): Promise<
        Record<ConfigKey, unknown>
    > {
        throw new Error('Not implemented');
    }
}
