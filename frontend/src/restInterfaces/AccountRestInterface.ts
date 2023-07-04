import { BaseRestInterface } from './BaseRestInterface';
import { IUser } from '../../../model/user/IUser';

/**
 * Implements communication with the Server concerning all Account-requests
 */
export class AccountRestInterface extends BaseRestInterface {
  private static account_path = '/account/';

  /**
   * Sends Login-Data to backend and validates them
   * @param usernameOrEmail the username or email used to attempt to log in
   * @param password the password used to attempt to log in
   * @param stayLoggedIn the option to stay logged in
   * @returns true if login was successful
   */
  public static async verifyLogin(
    usernameOrEmail: string,
    password: string,
    stayLoggedIn: boolean
  ): Promise<boolean> {
    try {
      await BaseRestInterface.post<boolean>(`${this.account_path}login`, {
        usernameOrEmail,
        password,
        stayLoggedIn,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Sends data for a new Account to backend
   * @param account the account
   * @returns the id of the newly created user
   */
  public static async addAccount(
    account: Partial<IUser>
  ): Promise<number | undefined> {
    const value = await BaseRestInterface.put<{ id: number }>(
      this.account_path,
      account
    );
    if (value !== undefined) {
      return value.id;
    }
  }

  /**
   * Sends a request to change specified Account-Data
   * @param account the account
   * @returns confirmation
   */
  public static async updateAccount(account: Partial<IUser>): Promise<void> {
    return await BaseRestInterface.patch(this.account_path, account);
  }

  /**
   * Sends request to delete the given Account
   * @param accountId the id of the account
   * @returns confirmation
   */
  public static async deleteAccount(accountId: number): Promise<void> {
    return await BaseRestInterface.delete(this.account_path, { id: accountId });
  }

  /**
   * Sends request to backend to get Account of currently logged-in User
   * @returns the Account of currently logged-in user
   */
  public static async getOwnAccount(): Promise<Partial<IUser> | undefined> {
    return await BaseRestInterface.get<Partial<IUser>>(this.account_path);
  }

  /**
   * Sends request to backend to get Usernames to given Account-IDs
   * @param accountIds the id of the accounts
   * @returns the names of the requested Accounts
   */
  public static async getAccounts(
    accountIds: number[]
  ): Promise<Record<number, string> | undefined> {
    const accountList = accountIds.join(',');
    return await BaseRestInterface.get<Record<number, string>>(
      `${this.account_path}${accountList}`
    );
  }

  /**
   * Sends request to backend to get all IDs and Names of all Accounts
   * @returns confirmation
   */
  public static async getAccountMetaDataList(): Promise<Partial<IUser>[] | undefined> {
    return await BaseRestInterface.get<Partial<IUser>[]>(
      `${this.account_path}list`
    );
  }
}
