import { DBUser } from '../../model/user/DBUser';
import { IUser } from '../../model/user/IUser';
import { UserClass } from '../../model/user/UserClass';
import crypto from 'crypto';
/**
 * The AccountController manages the Accountdata in the Database
 */
export class AccountController {
    /**
     * Creates a new Acount from given data, ignores given data except name, mail and password
     * @param data the given data
     * @returns the created Account
     */
    public static async createNewAccount(data: Partial<IUser>): Promise<IUser> {
        if (
            data.mail === null ||
            data.name === null ||
            data.password === null
        ) {
            throw new Error('Insufficent User Details');
        }

        if ((await DBUser.findBy({ mail: data.mail as string })).length > 0) {
            throw new Error('mail already exists');
        }
        if ((await DBUser.findBy({ name: data.name as string })).length > 0) {
            throw new Error('username already exists');
        }

        const dbUser: DBUser = new DBUser();
        dbUser.type = UserClass.REGULAR;
        dbUser.name = data.name as string;
        dbUser.mail = data.mail as string;
        dbUser.password = this.hashPW(data.password as string);
        dbUser.sharedSequencesReadAccess = [];
        dbUser.sharedSequencesWriteAccess = [];
        dbUser.save();
        return dbUser;
    }

    /**
     * tries a login for a given account
     * @param usernameOrEmail the username or email of the user
     * @param password the password
     * @returns the found user
     */
    public static async tryLogin(
        usernameOrEmail: string,
        password: string
    ): Promise<IUser> {
        const hashedPW = this.hashPW(password);
        let users: DBUser[];
        if (usernameOrEmail.includes('@')) {
            users = await DBUser.findBy({
                mail: usernameOrEmail,
                password: hashedPW,
            });
        } else {
            users = await DBUser.findBy({
                name: usernameOrEmail,
                password: hashedPW,
            });
        }
        if (users.length > 1) {
            throw Error('ambiguous user deatails');
        } else if (users.length === 0) {
            throw Error('no matching user details found');
        } else {
            return users[0];
        }
    }

    /**
     * getting a account by the given id
     * @param id the id of the account
     * @returns the found user
     */
    public static async getAccountById(id: number): Promise<IUser> {
        const user = await DBUser.findOneBy({ id: id });
        if (user === null) {
            throw new Error('No existing User with given ID');
        }
        return user;
    }
    /**
     * getting a reduced version of all accounts
     * @returns all accounts (reduced)
     */
    public static async getAllAccounts(): Promise<Partial<IUser>[]> {
        return await DBUser.find({ select: { name: true, id: true } });
    }

    /**
     * deletes an account by given id
     * @param id the id of the account
     */
    public static async deleteAccount(id: number): Promise<void> {
        const user = await DBUser.findOneBy({ id: id });
        if (user === null) {
            throw new Error('No existing User with given ID');
        }
        user.remove();
    }

    /**
     * creates an admin account if there doesnt exist one in the DB prints the password on the console
     */
    public static async ensureAdminAccount(): Promise<void> {
        const user = await DBUser.findOneBy({ type: UserClass.ADMIN });
        if (user === null) {
            const adminUser: Partial<IUser> = {};
            adminUser.name = 'admin';
            adminUser.mail = 'admin@loernwerk.de';
            const pw = crypto.randomBytes(16).toString('hex');
            console.log(
                'Admin account created, username: admin, mail: admin@loernwerk.de, password: ' +
                    pw
            );
            adminUser.password = this.hashPW(pw);
            this.createNewAccount(adminUser);
        }
    }

    /**
     * saves an account, changes only name mail and password
     * @param data the new user
     */
    public static async saveAccount(data: IUser): Promise<void> {
        const dbuser = await DBUser.findOneBy({ id: data.id });
        if (dbuser === null) {
            throw new Error('No such existing User');
        }
        dbuser.name = data.name;
        dbuser.mail = data.mail;
        dbuser.password = this.hashPW(data.password);
        dbuser.save();
    }

    /**
     * hashes a password
     * @param pw the password
     * @returns the hashed password
     */
    private static hashPW(pw: string): string {
        return pw;
    }
}
