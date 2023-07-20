import { ConfigKey } from '../../model/configuration/ConfigKey';
import { DBConfigEntry } from '../../model/configuration/DBConfigEntry';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../model/loernwerkError';

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
        const entry = await DBConfigEntry.findOneBy({ key: key });
        if (entry === null) {
            throw new LoernwerkError(
                'Config key not found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        return entry.value;
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
        await entry.save();
    }

    /**
     * returns all configurationentries from the database
     * @returns a record with all config entries
     */
    public static async getAllConfigEntries(): Promise<
        Record<ConfigKey, unknown>
    > {
        const config = await DBConfigEntry.find();
        const rec: Record<ConfigKey, unknown> = Object.assign(
            {},
            ...Object.values(ConfigKey).map((x) => ({ [x]: 'not present' }))
        );
        for (const x of config) {
            rec[x.key] = x.value;
        }
        return rec;
    }

    /**
     * Sets a default value for non existing configentries
     */
    public static async ensureConfig(): Promise<void> {
        const nullInitialized = [
            ConfigKey.MAX_SEQUENCES_PER_USER,
            ConfigKey.MAX_SLIDES_PER_SEQUENCE,
        ];
        let nnn = await DBConfigEntry.findOneBy({
            key: ConfigKey.OPEN_REGISTRATION,
        });
        if (nnn === null) {
            nnn = new DBConfigEntry();
        }
        nnn.key = ConfigKey.OPEN_REGISTRATION;
        nnn.value = true;
        nnn.save();
        for (const x of nullInitialized) {
            const entry = await DBConfigEntry.findOneBy({ key: x });
            if (entry !== null) {
                continue;
            }
            const newEntry = new DBConfigEntry();
            newEntry.key = x;
            newEntry.value = -1;
            await newEntry.save();
        }
    }
}
