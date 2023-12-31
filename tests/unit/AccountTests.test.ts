import { AccountController } from '../../backend/controller/AccountController';
import { DataSource } from 'typeorm';
import { UserClass } from '../../model/user/IUser';
import { DBUser } from '../../model/user/DBUser';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
    LoernwerkErrorMessages,
} from '../../model/loernwerkError';
import bcrypt from 'bcrypt';
import { DBSequence } from '../../model/sequence/DBSequence';
import { SequenceController } from '../../backend/controller/SequenceController';
import { DBH5PContent, DBH5PContentUsedBy } from '../../model/h5p/DBH5PContent';
import { DBSlide } from '../../model/slide/DBSlide';

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
            DBH5PContentUsedBy,
        ],
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
    mockUser.sharedSequencesReadAccess = ['CODE66'];
    mockUser.sharedSequencesWriteAccess = [];
    await mockUser.save();

    const mockSequence = new DBSequence();
    mockSequence.code = 'CODE01';
    mockSequence.authorId = 12345;
    mockSequence.name = 'sequence1';
    mockSequence.slideCount = 0;
    mockSequence.writeAccess = [931943];
    mockSequence.readAccess = [931943];
    mockSequence.tags = [];
    await mockSequence.save();

    const toBeDeleted = new DBUser();
    toBeDeleted.mail = 'bobby@fischer.de';
    toBeDeleted.id = 931943;
    toBeDeleted.type = UserClass.REGULAR;
    toBeDeleted.password = await bcrypt.hash('verySecurePW', 13);
    toBeDeleted.name = 'bobby';
    toBeDeleted.sharedSequencesReadAccess = ['CODE01'];
    toBeDeleted.sharedSequencesWriteAccess = ['CODE01'];
    await toBeDeleted.save();

    const sequenceByDeletedAccount = new DBSequence();
    sequenceByDeletedAccount.code = 'CODE66';
    sequenceByDeletedAccount.authorId = 931943;
    sequenceByDeletedAccount.name = 'Sequence66';
    sequenceByDeletedAccount.slideCount = 0;
    sequenceByDeletedAccount.writeAccess = [12345];
    sequenceByDeletedAccount.readAccess = [12345];
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
        type: UserClass.REGULAR,
        sharedSequencesReadAccess: [],
        sharedSequencesWriteAccess: [],
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
                LoernwerkErrorMessages.USERNAME_ALREADY_EXISTS,
                LoernwerkErrorCodes.ALREADY_EXISTS
            )
        );
    });

    it('create user with insufficient details', async () => {
        await expect(() =>
            AccountController.createNewAccount(insufficientDetails)
        ).rejects.toThrow(
            new LoernwerkError(
                LoernwerkErrorMessages.INSUFFICENT_USER_DETAILS,
                LoernwerkErrorCodes.INSUFFICENT_INFORMATION
            )
        );
    });

    it('create user with admin in mail', async () => {
        await expect(() =>
            AccountController.createNewAccount(illegalDefaultAdmin)
        ).rejects.toThrow(
            new LoernwerkError(
                LoernwerkErrorMessages.MAIL_DOES_NOT_SATISFY_REQUIREMENTS,
                LoernwerkErrorCodes.BAD_REQUEST
            )
        );
    });

    it('create user but mail already exists', async () => {
        await expect(
            AccountController.createNewAccount({
                name: 'Magnus Smurf',
                mail: 'magnus@carlsen.de',
                password: 'VerySecure',
            })
        ).rejects.toThrowError(LoernwerkErrorMessages.MAIL_ALREADY_EXISTS);
    });

    it('create user with empty name', async () => {
        await expect(
            AccountController.createNewAccount({
                name: '',
                mail: 'empty@carlsen.de',
                password: 'VerySecure',
            })
        ).rejects.toThrowError(
            LoernwerkErrorMessages.USERNAME_DOES_NOT_SATISFY_REQUIREMENTS
        );
    });

    it('create user with empty mail', async () => {
        await expect(
            AccountController.createNewAccount({
                name: 'Magnus Smurf',
                mail: '',
                password: 'VerySecure',
            })
        ).rejects.toThrowError(
            LoernwerkErrorMessages.MAIL_DOES_NOT_SATISFY_REQUIREMENTS
        );
    });

    it('create user with admin in name', async () => {
        await expect(
            AccountController.createNewAccount({
                name: 'Admin Carlson',
                mail: 'goat@carlsen.de',
                password: 'VerySecure',
            })
        ).rejects.toThrowError(
            LoernwerkErrorMessages.USERNAME_DOES_NOT_SATISFY_REQUIREMENTS
        );
    });

    it('create user with too short password', async () => {
        await expect(
            AccountController.createNewAccount({
                name: 'Magnus Smurf',
                mail: 'smurf@carlsen.de',
                password: 'short',
            })
        ).rejects.toThrowError(
            LoernwerkErrorMessages.PASSWORD_DOES_NOT_SATISFY_REQUIREMENTS
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
                LoernwerkErrorMessages.USERNAME_PASSWORD_INCORRECT,
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
                LoernwerkErrorMessages.USERNAME_PASSWORD_INCORRECT,
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
                LoernwerkErrorMessages.USER_NOT_FOUND,
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
                LoernwerkErrorMessages.SEQUENCE_NOT_FOUND,
                LoernwerkErrorCodes.NOT_FOUND
            )
        );
        await expect(() =>
            AccountController.getAccountById(931943)
        ).rejects.toThrow(
            new LoernwerkError(
                LoernwerkErrorMessages.USER_NOT_FOUND,
                LoernwerkErrorCodes.NOT_FOUND
            )
        );
        const sharedSequence = await DBSequence.findOne({
            where: { code: 'CODE01' },
        });
        expect(sharedSequence.readAccess.length).toEqual(0);
        expect(sharedSequence.writeAccess.length).toEqual(0);
    });

    it('delete account that does not exist', async () => {
        await expect(() =>
            AccountController.deleteAccount(66666)
        ).rejects.toThrow(
            new LoernwerkError(
                LoernwerkErrorMessages.USER_NOT_FOUND,
                LoernwerkErrorCodes.NOT_FOUND
            )
        );
    });

    //ensureAdminAccount function
    it('create Admin, because no admin exists', async () => {
        const noAdmin = await DBUser.findBy({ type: UserClass.ADMIN });
        expect(noAdmin.length).toEqual(0);
        await AccountController.ensureAdminAccount();
        const admin = await DBUser.findBy({ type: UserClass.ADMIN });
        expect(admin[0]).toBeInstanceOf(DBUser);
        expect(admin[0]).toHaveProperty('type', UserClass.ADMIN);
    });

    //this test only works in suite
    it('dont create Admin because it already exists', async () => {
        await AccountController.ensureAdminAccount();
        const allAdminAccounts = await DBUser.findBy({ type: UserClass.ADMIN });
        expect(allAdminAccounts.length).toEqual(1);
        expect(allAdminAccounts[0].type).toEqual(UserClass.ADMIN);
    });

    //getAccountByUsername function
    it('valid gets account by username', async () => {
        const user = await DBUser.findOneByOrFail({ name: 'magnus' });
        const queriedUser = await AccountController.getAccountByUsername(
            'magnus'
        );
        expect(queriedUser).toEqual(user);
    });

    it('invalid gets account by username', async () => {
        await expect(
            AccountController.getAccountByUsername('USERNAME DOESNT EXIST')
        ).rejects.toThrowError(LoernwerkErrorMessages.USER_NOT_FOUND);
    });

    //getAccountByEmail function
    it('valid gets account by mail', async () => {
        const user = await DBUser.findOneByOrFail({
            mail: 'magnus@carlsen.de',
        });
        const queriedUser = await AccountController.getAccountByEmail(
            'magnus@carlsen.de'
        );
        expect(queriedUser).toEqual(user);
    });

    it('invalid gets account by mail', async () => {
        await expect(
            AccountController.getAccountByEmail('MAIL DOESNT EXIST')
        ).rejects.toThrowError(LoernwerkErrorMessages.USER_NOT_FOUND);
    });

    //saveAccount function
    it('valid account changes', async () => {
        const user = await DBUser.findBy({ name: 'magnus' });
        user[0].name = 'mugnus';
        user[0].mail = 'mungus@carlson.de';
        await AccountController.saveAccount(user[0]);
        const newUser = await DBUser.findBy({ id: 12345 });
        expect(newUser[0]).toHaveProperty('name', 'mugnus');
        expect(newUser[0]).toHaveProperty('mail', 'mungus@carlson.de');
    });
    it('try to change non-existent account', async () => {
        const iUser = correctUser;
        iUser.id = 200000; //nonexistent id
        await expect(() =>
            AccountController.saveAccount(iUser)
        ).rejects.toThrow(
            new LoernwerkError(
                LoernwerkErrorMessages.USER_NOT_FOUND,
                LoernwerkErrorCodes.NOT_FOUND
            )
        );
    });

    it('try to save account with invalid username', async () => {
        const userToChange = await DBUser.findOneByOrFail({ id: 12345 });
        userToChange.name = '';
        await expect(
            AccountController.saveAccount(userToChange)
        ).rejects.toThrowError(
            LoernwerkErrorMessages.USERNAME_DOES_NOT_SATISFY_REQUIREMENTS
        );
    });

    it('try to save account with invalid mail', async () => {
        const userToChange = await DBUser.findOneByOrFail({ id: 12345 });
        userToChange.mail = '';
        await expect(
            AccountController.saveAccount(userToChange)
        ).rejects.toThrowError(
            LoernwerkErrorMessages.MAIL_DOES_NOT_SATISFY_REQUIREMENTS
        );
    });

    it('try to save account with too short password', async () => {
        const userToChange = await DBUser.findOneByOrFail({ id: 12345 });
        userToChange.password = '123';
        await expect(
            AccountController.saveAccount(userToChange)
        ).rejects.toThrowError(
            LoernwerkErrorMessages.PASSWORD_DOES_NOT_SATISFY_REQUIREMENTS
        );
    });
});
