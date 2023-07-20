import { ConfigKey } from '../../model/configuration/ConfigKey';
import { ConfigTypeMap } from '../../model/configuration/ConfigTypeMap';
import { DBConfigEntry } from '../../model/configuration/DBConfigEntry';
import { RegistrationType } from '../../model/configuration/RegistrationType';
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

    public static async isValidInviteCode(code:string) {
        const codes = (await this.getConfigEntry(ConfigKey.REGISTRATION_CODE) as string).split(',')
        for (const c of codes) {
            if (c === code) {
                return true
            }
        }
        return false
    }

    public static async removeInviteCode(code: string) {
        let codes = (await this.getConfigEntry(ConfigKey.REGISTRATION_CODE) as string).split(',')
        const index = codes.indexOf(code)
        codes = codes.splice(index, 1)
        this.setConfigEntry(ConfigKey.REGISTRATION_CODE, codes.join(','))
    }

    /**
     * Sets a default value for non existing configentries
     */
    public static async ensureConfig(): Promise<void> {
        const defaultValueMap: Map<ConfigKey, unknown> = new Map([
            [ConfigKey.MAX_SEQUENCES_PER_USER, -1],
            [ConfigKey.MAX_SLIDES_PER_SEQUENCE, -1],
            [ConfigKey.REGISTRATION_TYPE, RegistrationType.CLOSED as unknown],
            [ConfigKey.REGISTRATION_CODE, Math.floor(Math.random() * 10 ** 8)],
        ]);
        for (const [key, value] of defaultValueMap) {
            const entry = await DBConfigEntry.findOneBy({ key: key });
            if (entry !== null) {
                continue;
            }
            const newEntry = new DBConfigEntry();
            newEntry.key = key;
            newEntry.value = value;
            await newEntry.save();
        }
    }
}
