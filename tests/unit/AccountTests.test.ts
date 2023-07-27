import { AccountController } from '../../backend/controller/AccountController';
import { DataSource } from 'typeorm';
import { UserClass } from '../../model/user/IUser';
import { DBUser } from '../../model/user/DBUser';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../model/loernwerkError';
import bcrypt from 'bcrypt';
import { DBSequence } from '../../model/sequence/DBSequence';
import { SequenceController } from '../../backend/controller/SequenceController';
import { DBH5PContent } from '../../model/h5p/DBH5PContent';
import { DBSlide } from '../../model/slide/DBSlide';

let mockDb;
beforeAll(async () => {
    mockDb = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [DBUser, DBSequence, DBSlide, DBH5PContent],
        synchronize: true,
        logging: false,
    });

    await mockDb.initialize();
    const mockUser = new DBUser();
    mockUser.mail = 'magnus@carlsen.de';
    mockUser.id = 12345;
    mockUser.type = UserClass.REGULAR;
    mockUser.password = await bcrypt.hash('verySecurePW', 13);
    mockUser.name = 'magnus';
    mockUser.sharedSequencesReadAccess = [];
    mockUser.sharedSequencesWriteAccess = [];
    await mockUser.save();

    const toBeDeleted = new DBUser();
    toBeDeleted.mail = 'bobby@fischer.de';
    toBeDeleted.id = 931943;
    toBeDeleted.type = UserClass.REGULAR;
    toBeDeleted.password = await bcrypt.hash('verySecurePW', 13);
    toBeDeleted.name = 'bobby';
    toBeDeleted.sharedSequencesReadAccess = [];
    toBeDeleted.sharedSequencesWriteAccess = [];
    await toBeDeleted.save();

    const sequenceByDeletedAccount = new DBSequence();
    sequenceByDeletedAccount.code = 'CODE66';
    sequenceByDeletedAccount.authorId = 931943;
    sequenceByDeletedAccount.name = 'Sequence66';
    sequenceByDeletedAccount.slideCount = 0;
    sequenceByDeletedAccount.writeAccess = [];
    sequenceByDeletedAccount.readAccess = [];
    sequenceByDeletedAccount.tags = [];
    await sequenceByDeletedAccount.save();
});
afterAll(async () => {
    await mockDb.destroy();
});
describe('AccountController Tests', () => {
    const doubledName = {
        name: 'magnus',
        mail: 'notmagnus@carlsen.de',
        password: 'verySecurePW',
    };
    const correctUser = {
        name: 'garry',
        mail: 'garry@kasparov.de',
        password: 'verySecurePW',
        id: 54321,
    };
    const insufficientDetails = {
        name: null,
        mail: 'anish@giri.de',
        password: 'verySecurePW',
    };
    const illegalDefaultAdmin = {
        name: 'definetlyNotAdmin',
        mail: 'erigaisi@admin.de',
        password: 'verySecurePW',
    };

    //createNewAccount function
    it('create new user correctly', async () => {
        const newAccount = await AccountController.createNewAccount(
            correctUser
        );
        const hashComparison = await bcrypt.compare(
            'verySecurePW',
            newAccount.password
        );
        expect(newAccount).toBeInstanceOf(DBUser);
        expect(newAccount.name).toEqual('garry');
        expect(hashComparison).toEqual(true);
        expect(newAccount.mail).toEqual('garry@kasparov.de');
        expect(newAccount.id).not.toEqual(null);
    });

    it('create new user but name already exists', async () => {
        await expect(() =>
            AccountController.createNewAccount(doubledName)
        ).rejects.toThrow(
            new LoernwerkError(
                'username already exists',
                LoernwerkErrorCodes.ALREADY_EXISTS
            )
        );
    });

    it('create user with insufficient details', async () => {
        await expect(() =>
            AccountController.createNewAccount(insufficientDetails)
        ).rejects.toThrow(
            new LoernwerkError(
                'Insufficent User Details',
                LoernwerkErrorCodes.INSUFFICENT_INFORMATION
            )
        );
    });

    it('create user with admin in mail', async () => {
        await expect(() =>
            AccountController.createNewAccount(illegalDefaultAdmin)
        ).rejects.toThrow(
            new LoernwerkError(
                'Given information do not satisfy the requirements',
                LoernwerkErrorCodes.BAD_REQUEST
            )
        );
    });

    //tryLogin function
    it('correct login by email', async () => {
        const mockUser = await DBUser.findBy({ name: 'magnus' });
        expect(mockUser.length).toEqual(1);
        const tryLogin = await AccountController.tryLogin(
            mockUser[0].mail,
            'verySecurePW'
        );
        expect(tryLogin).toBeInstanceOf(DBUser);
        expect(tryLogin.name).toEqual('magnus');
        expect(tryLogin.mail).toEqual('magnus@carlsen.de');
        expect(tryLogin.id).not.toEqual(null);
    });

    it('login with no matching user', async () => {
        await expect(() =>
            AccountController.tryLogin(
                'vanforeest@notexisting.de',
                'verySecurePW'
            )
        ).rejects.toThrow(
            new LoernwerkError(
                'Mail/Name not matching an existing User',
                LoernwerkErrorCodes.NOT_FOUND
            )
        );
    });
    it('login with wrong password', async () => {
        const mockUser = await DBUser.findBy({ name: 'magnus' });
        expect(mockUser.length).toEqual(1);
        await expect(() =>
            AccountController.tryLogin(mockUser[0].name, 'wrongPassword')
        ).rejects.toThrow(
            new LoernwerkError(
                'Incorrect Password',
                LoernwerkErrorCodes.NOT_FOUND
            )
        );
    });

    //getAccountById function
    it('get existing account', async () => {
        const mockUser = await DBUser.findBy({ name: 'magnus' });
        expect(mockUser.length).toEqual(1);
        const returnedUser = await AccountController.getAccountById(
            mockUser[0].id
        );
        const hashComparison = await bcrypt.compare(
            'verySecurePW',
            returnedUser.password
        );
        expect(returnedUser).toBeInstanceOf(DBUser);
        expect(returnedUser.name).toEqual('magnus');
        expect(hashComparison).toEqual(true);
        expect(returnedUser.mail).toEqual('magnus@carlsen.de');
        expect(returnedUser.id).not.toEqual(null);
    });

    it('try getting nonexistent account', async () => {
        await expect(() =>
            AccountController.getAccountById(correctUser.id)
        ).rejects.toThrow(
            new LoernwerkError(
                'No existing User with given ID',
                LoernwerkErrorCodes.NOT_FOUND
            )
        );
    });

    //getAllAccounts function
    it('get all accounts', async () => {
        const allAccounts = await AccountController.getAllAccounts();
        expect(allAccounts[0]).toBeInstanceOf(DBUser);
        expect(allAccounts[0].name).not.toBe(null);
        expect(allAccounts[0].id).not.toBe(null);
    });

    //deleteAccount function
    it('delete a correct account', async () => {
        const accountToBeDeleted = await DBUser.findOne({
            where: { id: 931943 },
        });
        await AccountController.deleteAccount(accountToBeDeleted.id);
        await expect(() =>
            SequenceController.getSequenceByCode('CODE66')
        ).rejects.toThrow(
            new LoernwerkError(
                'No matching sequence',
                LoernwerkErrorCodes.NOT_FOUND
            )
        );
    });

    //ensureAdminExists function
    it('create Admin, because no admin exists', async () => {
        const noAdmin = await DBUser.findBy({ type: UserClass.ADMIN });
        expect(noAdmin.length).toEqual(0);
        await AccountController.ensureAdminAccount();
        const admin = await DBUser.findBy({ type: UserClass.ADMIN });
        expect(admin[0]).toBeInstanceOf(DBUser);
        expect(admin[0]).toHaveProperty('type', UserClass.ADMIN);
    });

    //saveAccount function
    it('valid account changes', async () => {
        const user = await DBUser.findBy({ name: 'magnus' });
        user[0].name = 'mugnus';
        await AccountController.saveAccount(user[0]);
        const newUser = await DBUser.findBy({ id: 12345 });
        expect(newUser[0]).toHaveProperty('name', 'mugnus');
    });
});
