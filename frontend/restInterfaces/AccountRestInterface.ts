import { BaseRestInterface } from './BaseRestInterface';
import { IUser } from '../../model/user/IUser';

/**
 * Implements communication with the Server concerning all Account-requests
 */
class AccountRestInterface extends BaseRestInterface {

  /**
   * Sends Login-Data to backend and validates them
   * @param usernameOrEmail the username or email used to attempt to log in
   * @param password the password used to attempt to log in
   * @returns true if login was successfull
   */
  public static async verifyLogin(
    usernameOrEmail: string,
    password: string
  ): Promise<boolean> {
    return await BaseRestInterface.post<boolean>('/account/login', {
      usernameOrEmail,
      password,
    });
  }

  /**
   * Sends data for a new Account to backend
   * @param account the account
   * @returns the id of the newly created user
   */
  public static async addAccount(account: Partial<IUser>): Promise<number> {
    return await BaseRestInterface.put<number>('/account/', account);
  }

  /**
   * Sends a request to change specified Account-Data
   * @param account the account
   */
  public static async updateAccount(account: Partial<IUser>): Promise<void> {
    return await BaseRestInterface.patch('/account/', account);
  }

  /**
   * Sends request to delete the given Account
   * @param accountId
   */
  public static async deleteAccount(accountId: number): Promise<void> {
    return await BaseRestInterface.delete('/account/', accountId);
  }

  /**
   * Sends request to backend to get Account of currently logged-in User
   * @returns the Account of currently logged-in user
   */
  public static async getOwnAccount(): Promise<Partial<IUser>> {
    return await BaseRestInterface.get<Partial<IUser>>('/account/');
  }

  /**
   * Sends request to backend to get Usernames to given Account-IDs
   * @param accountId
   * @returns the names of the requested Accounts
   */
  public static async getAccounts(
    accountId: number[]
  ): Promise<Record<number, string>> {
    return await BaseRestInterface.get<Record<number, string>>(
      `/account/${accountId}`
    );
  }

  /**
   * Sends request to backend to get all IDs and Names of all Accounts
   */
  public static async getAccountMetaDataList(): Promise<Partial<IUser>[]> {
    return await BaseRestInterface.get<Partial<IUser[]>>('/account/list');
  }
}
