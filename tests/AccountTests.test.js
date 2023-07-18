import {AccountController} from "../backend/controller/AccountController";
import {DataSource} from "typeorm";
import {UserClass} from "../model/user/IUser";
import {DBUser} from "../model/user/DBUser";
import {LoernwerkError} from "../model/loernwerkError";
let mockDb;
beforeEach(async () => {
    mockDb = new DataSource({
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [DBUser],
        synchronize: true,
        logging: false
    });
    await mockDb.initialize();
    const mockUser = new DBUser();
    mockUser.mail = 'magnus@carlsen.de';
    mockUser.id = 12345;
    mockUser.type = UserClass.REGULAR;
    mockUser.password = 'verySecurePW';
    mockUser.name = 'magnus';
});
afterEach(async () => {
    await mockDb.destroy();
});
describe('AccountController Tests', () => {
    const correctUser = {
        name: 'garry',
        mail: 'garry@kasparov.de',
        password: 'verySecurePW',
    };
    const doubledName = {
        name: 'magnus',
        mail: 'notmagnus@carlsen.de',
        password: 'verySecurePW',
    }
    const insufficientDetails = {
        name: null,
        mail: 'anish@giri.de',
        password : 'verySecurePW'
    }
    const illegalDefaultAdmin = {
        name: 'definetlyNotAdmin',
        mail: 'erigaisi@admin.de',
        password: 'verySecurePW'
    }
//createNewAccount function
    it('create new user correctly', async () => {
        const newAccount = await AccountController.createNewAccount(correctUser);
        expect(newAccount).toBeInstanceOf(DBUser);
        expect(newAccount.name).toEqual('garry');
        expect(newAccount.password).toEqual('verySecurePW');
        expect(newAccount.mail).toEqual('garry@kasparov.de');
        expect(newAccount.id).not.toEqual(null);
    });

    it('create new user put name already exists', async () => {
        const newAccount = await AccountController.createNewAccount(doubledName);
        expect(newAccount).toThrow(LoernwerkError);
        expect(newAccount).toThrow('username already exists');
    });

    it('create user with insufficient details', async () => {
        const newAccount = await AccountController.createNewAccount(insufficientDetails);
        expect(newAccount).toThrow(LoernwerkError);
        expect(newAccount).toThrow('Insufficent User Details');
    })

    it('create user with admin in mail', async () => {
        const newAccount = await AccountController.createNewAccount(illegalDefaultAdmin);
        expect(newAccount).toThrow(LoernwerkError);
        expect(newAccount).toThrow('Given information do not satisfy the requirements');
    })

    //tryLogin function
    it('correct login by email', async () => {
        const mockUser = mockDb.findBy({name: 'magnus'});
        const tryLogin = await AccountController.tryLogin(mockUser.email, mockUser.password);
        expect(tryLogin).toBeInstanceOf(DBUser);
        expect(tryLogin.name).toEqual('magnus');
        expect(tryLogin.password).toEqual('verySecurePW');
        expect(tryLogin.mail).toEqual('magnus@carlsen.de');
        expect(tryLogin.id).not.toEqual(null);
    });

    it('login by name with ambiguous information', async () => {
        const mockUser = mockDb.findBy({name: 'magnus'});
        const ambiguousUser = new DBUser();
        ambiguousUser.mail = 'magnus@carlsen.de';
        ambiguousUser.id = 12345;
        ambiguousUser.type = UserClass.REGULAR;
        ambiguousUser.password = 'verySecurePW';
        ambiguousUser.name = 'magnus';

        const tryLogin = await AccountController.tryLogin(mockUser.name, mockUser.password);
        expect(tryLogin).toThrow(LoernwerkError);
        expect(tryLogin).toThrow('ambiguous user details');
    });

    it('login with no matching user', async () => {
        const tryLogin = await AccountController.tryLogin('vanforeest@notexisting.de', 'verySecurePW');
        expect(tryLogin).toThrow(LoernwerkError);
        expect(tryLogin).toThrow('Mail/Name not matching an existing User');
    });
    it('login with wrong password', async () => {
        const mockUser = mockDb.findBy({name: 'magnus'});
        const tryLogin = await AccountController.tryLogin(mockUser.name, 'wrongPassword');
        expect(tryLogin).toThrow(LoernwerkError);
        expect(tryLogin).toThrow('Incorrect Password');
    });
    //getAccountById function
    it('get existing account', async () => {
        const mockUser = mockDb.findBy({name: 'magnus'});
        const returnedUser = await AccountController.getAccountById(mockUser.id);
        expect(returnedUser).toBeInstanceOf(DBUser);
        expect(returnedUser.name).toEqual('magnus');
        expect(returnedUser.password).toEqual('verySecurePW');
        expect(returnedUser.mail).toEqual('magnus@carlsen.de');
        expect(returnedUser.id).not.toEqual(null);
    });

    it('try getting nonexistent account', async () => {
        const returnedUser = await AccountController.getAccountById(correctUser.id);
        expect(returnedUser).toThrow(LoernwerkError);
        expect(returnedUser).toThrow('No existing User with given ID');
    });
    //getAllAccounts function
    it('get all accounts', async () => {
        const allAccounts = await AccountController.getAllAccounts();
        expect(allAccounts[0]).toBeInstanceOf(DBUser);
        expect(allAccounts[0].name).not.toBe(null);
        expect(allAccounts[0].id).not.toBe(null);
    });
});
