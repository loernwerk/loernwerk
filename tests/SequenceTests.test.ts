import { DataSource } from 'typeorm';
import { DBSequence } from '../model/sequence/DBSequence';
import { DBUser } from '../model/user/DBUser';
import { UserClass } from '../model/user/IUser';
import bcrypt from 'bcrypt';
import { SequenceController } from '../backend/controller/SequenceController';

let mockDb;
beforeAll(async () => {
    mockDb = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [DBUser, DBSequence],
        synchronize: true,
        logging: false,
    });
    await mockDb.initialize();

    const sequenceByUser = new DBSequence();
    sequenceByUser.code = 'CODE66';
    sequenceByUser.authorId = 931943;
    sequenceByUser.name = 'Sequence66';
    sequenceByUser.slideCount = 0;
    sequenceByUser.writeAccess = [];
    sequenceByUser.readAccess = [];
    await sequenceByUser.save();

    const userWithSeq = new DBUser();
    userWithSeq.mail = 'bobby@fischer.de';
    userWithSeq.id = 931943;
    userWithSeq.type = UserClass.REGULAR;
    userWithSeq.password = await bcrypt.hash('verySecurePW', 13);
    userWithSeq.name = 'bobby';
    userWithSeq.sharedSequencesReadAccess = [];
    userWithSeq.sharedSequencesWriteAccess = [];
    await userWithSeq.save();
});
afterAll(async () => {
    await mockDb.destroy();
});
describe('SequenceController Tests', () => {
    //createNewSequence function
    it('create sequence correctly', async () => {
        await SequenceController.createNewSequence('newSequence', 931943);
        const sequencesByUser = await DBSequence.findBy({ authorId: 931943 });
        expect(sequencesByUser.length).toEqual(2);
    });

    //getSequenceByCode function
    it('get existing sequence by ID', async () => {
        const sequenceToGet = await DBSequence.findBy({ name: 'Sequence66' });
        const sequence = await SequenceController.getSequenceByCode(
            sequenceToGet[0].code
        );
        expect(sequence).toBeInstanceOf(DBSequence);
    });
});
