import { DataSource } from 'typeorm';
import { DBUser } from '../../model/user/DBUser';
import { DBSequence } from '../../model/sequence/DBSequence';
import { DBSlide } from '../../model/slide/DBSlide';
import { DBH5PContent } from '../../model/h5p/DBH5PContent';
import { DBConfigEntry } from '../../model/configuration/DBConfigEntry';
import { ConfigController } from '../../backend/controller/ConfigController';
import { ConfigKey } from '../../model/configuration/ConfigKey';
import { RegistrationType } from '../../model/configuration/RegistrationType';

let mockDb;

/**
 * Implements a timeout
 * @param ms the milliseconds
 * @returns setTimeout
 */
function delay(ms: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
beforeAll(async () => {
    mockDb = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [DBUser, DBSequence, DBSlide, DBH5PContent, DBConfigEntry],
        synchronize: true,
        logging: false,
    });
    await mockDb.initialize();

    const configMaxSeq = new DBConfigEntry();
    configMaxSeq.key = ConfigKey.MAX_SEQUENCES_PER_USER;
    configMaxSeq.value = 4;
    await configMaxSeq.save();

    const configMaxSlides = new DBConfigEntry();
    configMaxSlides.key = ConfigKey.MAX_SLIDES_PER_SEQUENCE;
    configMaxSlides.value = 4;
    await configMaxSlides.save();

    const configRegType = new DBConfigEntry();
    configRegType.key = ConfigKey.REGISTRATION_TYPE;
    configRegType.value = RegistrationType.CLOSED;
    await configRegType.save();

    const configCode = new DBConfigEntry();
    configCode.key = ConfigKey.REGISTRATION_CODES;
    configCode.value = 'realCode,niceCode';
    await configCode.save();
});
afterAll(async () => {
    await mockDb.destroy();
});

describe('Config Controller', () => {
    //getConfigEntry function
    it('Try to get config entry', async () => {
        const testConf = await ConfigController.getConfigEntry(
            ConfigKey.REGISTRATION_TYPE
        );
        expect(testConf).toEqual(RegistrationType.CLOSED);
    });

    //setConfigEntry function
    it('Change config', async () => {
        await ConfigController.setConfigEntry(
            ConfigKey.MAX_SEQUENCES_PER_USER,
            5
        );
        const value = await DBConfigEntry.findBy({
            key: ConfigKey.MAX_SEQUENCES_PER_USER,
        });
        expect(value[0].value).toEqual(5);
    });

    //getAllConfigEntries function
    it('Retrieve all Config-Entries', async () => {
        const allEntries = await ConfigController.getAllConfigEntries();
        const keys = Object.keys(allEntries);
        expect(keys.length).toEqual(5);
        expect(Object.values(allEntries)[1]).toEqual(4);
        expect(Object.values(allEntries)[2]).toEqual(RegistrationType.CLOSED);
        expect(Object.values(allEntries)[4]).toEqual('not present');
    });

    //isValidInviteCode function
    it('test for invalid invite code', async () => {
        const code = await ConfigController.isValidInviteCode('someCode');
        expect(code).toEqual(false);
    });

    it('test for valid invite code', async () => {
        const code = await ConfigController.isValidInviteCode('realCode');
        expect(code).toEqual(true);
    });

    //removeInviteCode function
    it('removing existing invite code', async () => {
        await ConfigController.removeInviteCode('niceCode');
        await delay(1000);
        const remainingCodes = await DBConfigEntry.findBy({
            key: ConfigKey.REGISTRATION_CODES,
        });
        expect(remainingCodes[0].value).toEqual('realCode');
    });

    //ensureConfig function
    it('ensure default values are set', async () => {
        await mockDb.destroy();

        const newDb = new DataSource({
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            entities: [
                DBUser,
                DBSequence,
                DBSlide,
                DBH5PContent,
                DBConfigEntry,
            ],
            synchronize: true,
            logging: false,
        });
        await newDb.initialize();
        await ConfigController.ensureConfig();
        const allEntries = await ConfigController.getAllConfigEntries();
        const values = Object.values(allEntries);
        expect(values.length).toEqual(5);
        for (const value in values) {
            expect(value).not.toEqual('not present');
        }
    });
});
