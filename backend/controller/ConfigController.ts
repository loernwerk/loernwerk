import { ConfigKey } from '../../model/configuration/ConfigKey';
import { DBConfigEntry } from '../../model/configuration/DBConfigEntry';
import { LoernwerkError, LoernwerkErrorCodes } from '../loernwerkError';

/**
 * Manages configuration data in the database and handles requests for config requests
 */
export class ConfigController {
    /**
     * Searches a configurationentry from the database
     * @param key the configurationkey of the entry
     * @returns the value of the entry
     */
    public static async getConfigEntry(key: ConfigKey): Promise<unknown> {
        return await DBConfigEntry.findOneBy({ key: key });
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
        const entry = await DBConfigEntry.findOneBy({ key: key });
        if (entry === null) {
            throw new LoernwerkError(
                'Config not Found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        entry.value = value;
        entry.save();
    }

    /**
     * returns all configurationentries from the database
     */
    public static async getAllConfigEntries(): Promise<
        Record<ConfigKey, unknown>
    > {
        const config = await DBConfigEntry.find();
        void config;
        throw new Error();
    }
}
