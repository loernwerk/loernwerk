import { DataSource } from 'typeorm';
import { DBSequence } from '../../model/sequence/DBSequence';
import { DBUser } from '../../model/user/DBUser';
import { UserClass } from '../../model/user/IUser';
import bcrypt from 'bcrypt';
import { SequenceController } from '../../backend/controller/SequenceController';
import { DBSlide } from '../../model/slide/DBSlide';
import { LayoutType } from '../../model/slide/layout/Layout';
import { ISequenceWithSlides } from '../../model/sequence/ISequenceWithSlides';
import { DBH5PContent, DBH5PContentUsedBy } from '../../model/h5p/DBH5PContent';
import { DBConfigEntry } from '../../model/configuration/DBConfigEntry';
import { ConfigController } from '../../backend/controller/ConfigController';
import { LoernwerkErrorMessages } from '../../model/loernwerkError';
import { ISlide } from '../../model/slide/ISlide';

let mockDb;
beforeAll(async () => {
    mockDb = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [
            DBUser,
            DBSequence,
            DBSlide,
            DBH5PContent,
            DBConfigEntry,
            DBH5PContentUsedBy,
        ],
        synchronize: true,
        logging: false,
    });
    await mockDb.initialize();
    await ConfigController.ensureConfig();

    const sequenceByUser = new DBSequence();
    sequenceByUser.code = 'CODE66';
    sequenceByUser.authorId = 931943;
    sequenceByUser.name = 'Sequence66';
    sequenceByUser.slideCount = 1;
    sequenceByUser.writeAccess = [];
    sequenceByUser.readAccess = [];
    sequenceByUser.tags = [];
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

    const userToShareWith = new DBUser();
    userToShareWith.mail = 'anatoli@karpov.de';
    userToShareWith.id = 2351951;
    userToShareWith.type = UserClass.REGULAR;
    userToShareWith.password = await bcrypt.hash('verySecurePW', 13);
    userToShareWith.name = 'anatoli';
    userToShareWith.sharedSequencesReadAccess = ['CODE66'];
    userToShareWith.sharedSequencesWriteAccess = ['CODE66'];
    await userToShareWith.save();

    const testSlide = new DBSlide();
    testSlide.layout = LayoutType.TITLEPAGE;
    testSlide.content = {};
    testSlide.backgroundColor = 'white';
    testSlide.sequenceCode = 'CODE66';
    testSlide.order = 1;
    testSlide.id = 10404;
    await testSlide.save();
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

    it('create sequence with empty title', async () => {
        await expect(
            SequenceController.createNewSequence('', 931943)
        ).rejects.toThrowError('Invalid sequence title');
    });

    it('create sequence with invalid author', async () => {
        await expect(
            SequenceController.createNewSequence('aaaa', -1)
        ).rejects.toThrowError(LoernwerkErrorMessages.USER_NOT_FOUND);
    });

    //getSequenceByCode function
    it('get existing sequence by ID', async () => {
        const sequenceToGet = await DBSequence.findBy({ name: 'Sequence66' });
        const sequence = await SequenceController.getSequenceByCode(
            sequenceToGet[0].code
        );
        expect(sequence).toBeInstanceOf(DBSequence);
    });

    //getSequenceWithSlides function
    it('returns existing sequence and its slides', async () => {
        const testSlide = await DBSlide.findBy({ sequenceCode: 'CODE66' });
        const seqWithSlides = await SequenceController.getSequenceWithSlides(
            'CODE66'
        );
        expect(seqWithSlides.code).toEqual('CODE66');
        expect(seqWithSlides.slides.length).toEqual(1);
        expect(seqWithSlides.slides[0]).toEqual(testSlide[0]);
    });

    it('get nonexistant sequence', async () => {
        await expect(
            SequenceController.getSequenceWithSlides('NONEXISTANT')
        ).rejects.toThrowError(LoernwerkErrorMessages.SEQUENCE_NOT_FOUND);
    });

    //saveSequence function
    it('returns existing sequence and its slides with changes', async () => {
        const sequenceChanges: Partial<ISequenceWithSlides> = {
            name: 'changed',
            code: 'CODE66',
        };
        await SequenceController.saveSequence(sequenceChanges, 931943);
        const sequenceChanged = await DBSequence.findBy({ code: 'CODE66' });
        expect(sequenceChanged[0].name).toEqual('changed');
    });

    it('saveSequence without sequence code', async () => {
        await expect(
            SequenceController.saveSequence({}, -1)
        ).rejects.toThrowError(LoernwerkErrorMessages.NO_CODE_PROVIDED);
    });

    it('saveSequence with invalid sequence code', async () => {
        await expect(
            SequenceController.saveSequence({ code: 'INVALID' }, -1)
        ).rejects.toThrowError(LoernwerkErrorMessages.SEQUENCE_NOT_FOUND);
    });

    it('more complex sequence saving', async () => {
        const slide: ISlide = {
            id: 0,
            order: 0,
            backgroundColor: '#ffffff',
            content: {},
            layout: LayoutType.TITLEPAGE,
            sequenceCode: 'CODE66',
        };
        const testSlide = await DBSlide.findOneByOrFail({
            id: 10404,
            sequenceCode: 'CODE66',
        });
        const sequenceChanges: Partial<ISequenceWithSlides> = {
            code: 'CODE66',
            writeAccess: [2351951],
            slides: [slide, testSlide],
            tags: ['Some Interesting Tags'],
        };

        await SequenceController.saveSequence(sequenceChanges, 931943);
        const sequenceChanged = await DBSequence.findOneByOrFail({
            code: 'CODE66',
        });
        const slideAdded = await DBSlide.findOneByOrFail({
            id: 0,
            sequenceCode: 'CODE66',
        });
        const addedUser = await DBUser.findOneByOrFail({ id: 2351951 });
        expect(sequenceChanged.writeAccess).toEqual([2351951]);
        expect(sequenceChanged.tags).toEqual(['Some Interesting Tags']);
        expect(slideAdded).toEqual(slide);
        expect(addedUser.sharedSequencesWriteAccess).toContain('CODE66');
    });

    //getSequencesOfUser function
    it('try to get sequences from user', async () => {
        const sequences = await SequenceController.getSequencesOfUser(931943);
        expect(sequences.length).toEqual(2);
        expect(sequences[0].code).toEqual('CODE66');
    });

    it('try to get sequences from nonexistant user', async () => {
        await expect(
            SequenceController.getSequencesOfUser(-1)
        ).rejects.toThrowError(LoernwerkErrorMessages.USER_NOT_FOUND);
    });

    //getSharedSequencesOfUser function
    it('try to get sequences that are shared with a user', async () => {
        const sequences = await SequenceController.getSharedSequencesOfUser(
            2351951
        );
        expect(sequences[0].code).toEqual('CODE66');
        expect(sequences[1].code).toEqual('CODE66');
        expect(sequences[0].authorId).toEqual(931943);
    });

    it('try to get shared sequences of a nonexistant user', async () => {
        await expect(
            SequenceController.getSharedSequencesOfUser(-1)
        ).rejects.toThrowError(LoernwerkErrorMessages.USER_NOT_FOUND);
    });

    /**
     * getSequenceForExecution function
     * this function only works in suite. To test correctly for itself change "changed" to "Sequence66"
     */
    it('try to reduce a sequence to attributes name, authorId, slideCount, code', async () => {
        const reduced = await SequenceController.getSequenceForExecution(
            'CODE66'
        );
        expect(reduced.readAccess === undefined).toEqual(true);
        expect(reduced.name).toEqual('changed');
        expect(reduced.authorId).toEqual(931943);
        expect(reduced.slideCount).toEqual(2);
        expect(reduced.code).toEqual('CODE66');
    });

    it('try to get sequence for execution which doesnt exist', async () => {
        await expect(
            SequenceController.getSequenceForExecution('NONEXISTANT')
        ).rejects.toThrowError(LoernwerkErrorMessages.SEQUENCE_NOT_FOUND);
    });

    //getSequenceSlideByCode function
    it('try to get a slide with given index from a given sequence', async () => {
        const slide = await SequenceController.getSequenceSlideByCode(
            'CODE66',
            1
        );
        expect(slide).toBeInstanceOf(DBSlide);
        expect(slide.id).toEqual(10404);
    });

    it('try to get nonexistant slide', async () => {
        await expect(
            SequenceController.getSequenceSlideByCode('NONEXISTANT', -1)
        ).rejects.toThrowError(LoernwerkErrorMessages.SLIDE_NOT_FOUND);
    });

    //getCertificatePDF function
    it('try to get certificate pdf for sequence', async () => {
        const pdf = await SequenceController.getCertificatePDF('CODE66');
        expect(pdf).toBeInstanceOf(Buffer);
    });

    it('try to get certificate of nonexistant sequence', async () => {
        await expect(
            SequenceController.getCertificatePDF('NONEXISTANT')
        ).rejects.toThrowError(LoernwerkErrorMessages.SEQUENCE_NOT_FOUND);
    });

    //deleteSequence function
    it('try to delete sequence', async () => {
        const user = await DBUser.findBy({ name: 'anatoli' });
        const sequence = await DBSequence.findBy({ code: 'CODE66' });
        await SequenceController.deleteSequence(sequence[0].code, 931943);
        const userSequences = await SequenceController.getSequencesOfUser(
            user[0].id
        );
        expect(userSequences.length).toEqual(0);
    });

    it('try to delete nonexistant sequence', async () => {
        await expect(
            SequenceController.deleteSequence('NONEXISTANT', -1)
        ).rejects.toThrowError(LoernwerkErrorMessages.SEQUENCE_NOT_FOUND);
    });
});
