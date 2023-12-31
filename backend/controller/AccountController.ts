import { DBUser } from '../../model/user/DBUser';
import { IUser, UserClass } from '../../model/user/IUser';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
    LoernwerkErrorMessages,
} from '../../model/loernwerkError';
import { DBSequence } from '../../model/sequence/DBSequence';
import { SequenceController } from './SequenceController';
/**
 * Manages account data in the database and handles requests for account requests regarding account data
 */
export class AccountController {
    static defaultAdminName = 'admin';
    static defaultMailSuffix = '@loernwerk.de';

    /**
     * Creates a new account with given mail, name, password (ignoring the other values existing in the Partial<IUser>) in the database
     * @param data A user object that contains the initial values to be saved
     * @returns the created Account
     */
    public static async createNewAccount(data: Partial<IUser>): Promise<IUser> {
        if (
            data.mail === null ||
            data.name === null ||
            data.password === null
        ) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.INSUFFICENT_USER_DETAILS,
                LoernwerkErrorCodes.INSUFFICENT_INFORMATION
            );
        }

        if (await this.mailExists(data.mail as string)) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.MAIL_ALREADY_EXISTS,
                LoernwerkErrorCodes.ALREADY_EXISTS
            );
        }
        if (await this.nameExists(data.name as string)) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.USERNAME_ALREADY_EXISTS,
                LoernwerkErrorCodes.ALREADY_EXISTS
            );
        }

        if (!this.isValidMail(data.mail, false)) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.MAIL_DOES_NOT_SATISFY_REQUIREMENTS,
                LoernwerkErrorCodes.BAD_REQUEST
            );
        }

        if (!this.isValidUsername(data.name, false)) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.USERNAME_DOES_NOT_SATISFY_REQUIREMENTS,
                LoernwerkErrorCodes.BAD_REQUEST
            );
        }

        if (!this.isValidPassword(data.password)) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.PASSWORD_DOES_NOT_SATISFY_REQUIREMENTS,
                LoernwerkErrorCodes.BAD_REQUEST
            );
        }

        const dbUser: DBUser = new DBUser();
        dbUser.type = UserClass.REGULAR;
        dbUser.name = data.name as string;
        dbUser.mail = data.mail as string;
        dbUser.password = await this.hashPW(data.password as string);
        dbUser.sharedSequencesReadAccess = [];
        dbUser.sharedSequencesWriteAccess = [];
        await dbUser.save();
        return dbUser;
    }

    /**
     * Try to find a user with corresponding username/e- mail and matching password in the database. Throws an error if no account was found
     * @param usernameOrEmail the username or email of the user
     * @param password the password
     * @returns the found user
     */
    public static async tryLogin(
        usernameOrEmail: string,
        password: string
    ): Promise<IUser> {
        let users: DBUser[];
        if (usernameOrEmail.includes('@')) {
            users = await DBUser.findBy({
                mail: usernameOrEmail,
            });
        } else {
            users = await DBUser.findBy({
                name: usernameOrEmail,
            });
        }
        if (users.length > 1) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.AMBIGUOUS_USER_DETAILS,
                LoernwerkErrorCodes.AMBIGUOUS_INFORMATION
            );
        } else if (users.length === 0) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.USERNAME_PASSWORD_INCORRECT,
                LoernwerkErrorCodes.NOT_FOUND
            );
        } else {
            const founduser = users[0];
            if (await this.validatePassword(password, founduser.password)) {
                return founduser;
            }
            throw new LoernwerkError(
                LoernwerkErrorMessages.USERNAME_PASSWORD_INCORRECT,
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
    }

    /**
     * Searches for an Account with corresponding Id in the database and returns it. Throws an error if no account was found.
     * @param id the id of the account
     * @returns the found user
     */
    public static async getAccountById(id: number): Promise<IUser> {
        const user = await DBUser.findOneBy({ id: id });
        if (user === null) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.USER_NOT_FOUND,
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        return user;
    }

    /**
     * Searches for an Account with corresponding username in the database and returns it. Throws an error if no account was found.
     * @param username the username of the account
     * @returns the found user
     */
    public static async getAccountByUsername(username: string): Promise<IUser> {
        const user = await DBUser.findOneBy({ name: username });
        if (user === null) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.USER_NOT_FOUND,
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        return user;
    }

    /**
     * Searches for an Account with corresponding mail in the database and returns it. Throws an error if no account was found.
     * @param email the mail of the account
     * @returns the found user
     */
    public static async getAccountByEmail(email: string): Promise<IUser> {
        const user = await DBUser.findOneBy({ mail: email });
        if (user === null) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.USER_NOT_FOUND,
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        return user;
    }

    /**
     * Returns all users of the database in an array in reduced form.
     * @returns A reduced version of all accounts
     */
    public static async getAllAccounts(): Promise<Partial<IUser>[]> {
        return await DBUser.find({ select: { name: true, id: true } });
    }

    /**
     * Deletes an account from the database. Throws an error if no account was found to delete was found
     * @param id the id of the account
     */
    public static async deleteAccount(id: number): Promise<void> {
        const user = await DBUser.findOne({
            where: { id: id },
            select: [
                'id',
                'sharedSequencesReadAccess',
                'sharedSequencesWriteAccess',
            ],
        });
        if (user === null) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.USER_NOT_FOUND,
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        //Removing sequences through SequenceController
        const sequences = await DBSequence.find({ where: { authorId: id } });
        for (const s of sequences) {
            await SequenceController.deleteSequence(s.code, id);
        }
        // Removing user from the read/write access list in shared sequences
        for (const code of user.sharedSequencesReadAccess) {
            const sequence = await DBSequence.findOneBy({ code: code });
            if (sequence === null) {
                continue;
            }
            const index = sequence.readAccess.indexOf(id);
            sequence.readAccess.splice(index, 1);
            await sequence.save();
        }
        for (const code of user.sharedSequencesWriteAccess) {
            const sequence = await DBSequence.findOneBy({ code: code });
            if (sequence === null) {
                continue;
            }
            const index = sequence.writeAccess.indexOf(id);
            sequence.writeAccess.splice(index, 1);
            await sequence.save();
        }
        await user.remove();
    }

    /**
     * Ensures that an admin exists and creates one if none exists. This function is called called by loernwerkServer.main at server startup.
     * The Password is printed on the console
     */
    public static async ensureAdminAccount(): Promise<void> {
        const user = await DBUser.findOneBy({ type: UserClass.ADMIN });
        if (user !== null) {
            return;
        }
        const adminUser = new DBUser();
        adminUser.type = UserClass.ADMIN;
        adminUser.name = this.defaultAdminName;
        adminUser.mail = adminUser.name + this.defaultMailSuffix;
        while (
            (await DBUser.findOneBy({ name: adminUser.name })) !== null ||
            (await DBUser.findOneBy({ mail: adminUser.mail })) !== null
        ) {
            const rand = Math.floor(Math.random() * 10); // getting a random number between 0 and 9
            adminUser.name += rand;
            adminUser.mail = adminUser.name + this.defaultMailSuffix;
        }
        const pw = crypto.randomBytes(16).toString('hex');
        adminUser.password = await this.hashPW(pw);
        adminUser.sharedSequencesReadAccess = [];
        adminUser.sharedSequencesWriteAccess = [];
        await adminUser.save();
        console.log(
            `Admin account created, username: ${adminUser.name} ,mail: ${adminUser.mail}, password: ${pw}`
        );
    }

    /**
     * Saves the changes to an account in the database. Only changes name, mail or password. Other changes are discarded
     * @param data the new user
     */
    public static async saveAccount(data: IUser): Promise<void> {
        const dbuser = await DBUser.findOneBy({ id: data.id });
        if (dbuser === null) {
            throw new LoernwerkError(
                LoernwerkErrorMessages.USER_NOT_FOUND,
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        if (
            data.type == null &&
            data.name === null &&
            data.mail === null &&
            data.password === null
        ) {
            return;
        }
        if (data.type != null) {
            dbuser.type = data.type;
        }
        if (data.name != null && data.name !== dbuser.name) {
            if (
                !this.isValidUsername(
                    data.name,
                    data.type === UserClass.ADMIN ||
                        dbuser.type === UserClass.ADMIN
                )
            ) {
                throw new LoernwerkError(
                    LoernwerkErrorMessages.USERNAME_DOES_NOT_SATISFY_REQUIREMENTS,
                    LoernwerkErrorCodes.BAD_REQUEST
                );
            }
            if (await this.nameExists(data.name)) {
                throw new LoernwerkError(
                    LoernwerkErrorMessages.USERNAME_ALREADY_EXISTS,
                    LoernwerkErrorCodes.INVALID_PARAMETER
                );
            }
            dbuser.name = data.name;
        }
        if (data.mail != null && data.mail !== dbuser.mail) {
            if (
                !this.isValidMail(
                    data.mail,
                    data.type === UserClass.ADMIN ||
                        dbuser.type === UserClass.ADMIN
                )
            ) {
                throw new LoernwerkError(
                    LoernwerkErrorMessages.MAIL_DOES_NOT_SATISFY_REQUIREMENTS,
                    LoernwerkErrorCodes.BAD_REQUEST
                );
            }
            if (await this.mailExists(data.mail)) {
                throw new LoernwerkError(
                    LoernwerkErrorMessages.MAIL_ALREADY_EXISTS,
                    LoernwerkErrorCodes.INVALID_PARAMETER
                );
            }
            dbuser.mail = data.mail;
        }
        if (data.password != null) {
            if (!this.isValidPassword(data.password)) {
                throw new LoernwerkError(
                    LoernwerkErrorMessages.PASSWORD_DOES_NOT_SATISFY_REQUIREMENTS,
                    LoernwerkErrorCodes.BAD_REQUEST
                );
            }
            dbuser.password = await this.hashPW(data.password);
        }
        await dbuser.save();
    }

    /**
     * Hashes a password.
     * @param pw the password
     * @returns the hashed password
     */
    private static async hashPW(pw: string): Promise<string> {
        return bcrypt.hash(pw, 13);
    }

    /**
     * tests if a name exists
     * @param name the name to test
     * @returns true if the name exists
     */
    private static async nameExists(name: string): Promise<boolean> {
        return (
            (
                await DBUser.find({
                    where: { name: name },
                    select: ['mail'],
                })
            ).length > 0
        );
    }

    /**
     * tests if a mail exists
     * @param mail the mail to test
     * @returns true if the mail exists
     */
    private static async mailExists(mail: string): Promise<boolean> {
        return (
            (
                await DBUser.find({
                    where: { mail: mail },
                    select: ['mail'],
                })
            ).length > 0
        );
    }

    /**
     * Verifies a password for a given hash.
     * @param pw the password
     * @param hash the hash
     * @returns true if the password matches the hash
     */
    private static async validatePassword(
        pw: string,
        hash: string
    ): Promise<boolean> {
        return bcrypt.compare(pw, hash);
    }

    /**
     * Tests if a username fullfills the requirments
     * @param name the username
     * @param skipFurtherChecks this is enabled further checks wont be executed, only testing for empty field
     * @returns true if the username is valid
     */
    private static isValidUsername(
        name: string,
        skipFurtherChecks: boolean
    ): boolean {
        if (name == '') {
            return false;
        }
        if (skipFurtherChecks) {
            return true;
        }
        if (name.toLowerCase().includes(this.defaultAdminName)) {
            return false;
        }
        return true;
    }

    /**
     * Tests if a mail fullfills the requirments
     * @param mail the mail
     * @param skipFurtherChecks if this is enabled further checks wont be executed, only testing for empty field
     * @returns true if the mail is valid
     */
    private static isValidMail(
        mail: string,
        skipFurtherChecks: boolean
    ): boolean {
        if (mail == '') {
            return false;
        }
        if (skipFurtherChecks) {
            return true;
        }
        if (mail.toLowerCase().includes(this.defaultAdminName)) {
            return false;
        }
        return true;
    }

    /**
     * Tests if a password fullfills the requirments
     * @param pw the password
     * @returns true if the password is valid
     */
    private static isValidPassword(pw: string): boolean {
        if (pw.length < 6) {
            return false;
        }
        return true;
    }
}
