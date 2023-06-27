import { IUser } from '../../model/user/IUser';

export class AccountController {
    public static async createNewAccount(data: Partial<IUser>): Promise<IUser> {
        throw new Error('Not implemented');
    }

    public static async tryLogin(
        usernameOrEmail: string,
        password: string
    ): Promise<IUser> {
        throw new Error('Not implemented');
    }

    public static async getAccountById(id: number): Promise<IUser> {
        throw new Error('Not implemented');
    }

    public static async getAllAccounts(): Promise<Partial<IUser>[]> {
        throw new Error('Not implemented');
    }

    public static async deleteAccount(id: number): Promise<void> {
        throw new Error('Not implemented');
    }

    public static async ensureAdminAccount(): Promise<void> {
        throw new Error('Not implemented');
    }

    public static async saveAccount(data: IUser): Promise<void> {
        throw new Error('Not implemented');
    }
}
