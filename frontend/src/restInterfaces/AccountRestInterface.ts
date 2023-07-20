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
  public static async addAccount(account: Partial<IUser>, inviteCode?: string): Promise<number> {
    return (
      await BaseRestInterface.put<{ id: number }>((inviteCode === undefined)?this.account_path: this.account_path.concat('?code=').concat(inviteCode), account)
    ).id;
  }

  /**
   * Sends a request to change specified Account-Data
   * @param account the account
   */
  public static async updateAccount(account: Partial<IUser>): Promise<void> {
    await BaseRestInterface.patch(this.account_path, account);
  }

  /**
   * Sends request to delete the given Account
   * @param accountId the id of the account
   */
  public static async deleteAccount(accountId: number): Promise<void> {
    await BaseRestInterface.delete(this.account_path, { id: accountId });
  }

  /**
   * Sends request to backend to get Account of currently logged-in User
   * @returns the Account of currently logged-in user
   */
  public static async getOwnAccount(): Promise<Partial<IUser>> {
    return await BaseRestInterface.get<Partial<IUser>>(this.account_path);
  }

  /**
   * Sends request to backend to get account of the user with the given id
   * @param id the id of the requested user
   * @returns  the requested user
   */
  public static async getAccount(id: number): Promise<Partial<IUser>> {
    return await BaseRestInterface.get<Partial<IUser>>(
      this.account_path.concat('?id=').concat(id.toString())
    );
  }

  /**
   * Sends request to backend to get Usernames to given Account-IDs
   * @param accountIds the id of the accounts
   * @returns the names of the requested Accounts
   */
  public static async getAccounts(
    accountIds: number[]
  ): Promise<Record<number, string>> {
    const accountList = accountIds.join(',');
    return await BaseRestInterface.get<Record<number, string>>(
      `${this.account_path}${accountList}`
    );
  }

  /**
   * Sends request to backend to get all IDs and Names of all Accounts
   * @returns confirmation
   */
  public static async getAccountMetaDataList(): Promise<Partial<IUser>[]> {
    return await BaseRestInterface.get<Partial<IUser>[]>(
      `${this.account_path}list`
    );
  }

  /**
   * Sends request to backend to get account of the user with the given username
   * @param username the username of the requested user
   * @returns  the requested user
   */
  public static async getAccountByUserName(
    username: string
  ): Promise<Partial<IUser>> {
    return await BaseRestInterface.get<Partial<IUser>>(
      this.account_path.concat('?name=').concat(username)
    );
  }

  /**
   * Sends request to backend to get account of the user with the given email
   * @param email the email of the requested user
   * @returns  the requested user
   */
  public static async getAccountByEmail(
    email: string
  ): Promise<Partial<IUser>> {
    return await BaseRestInterface.get<Partial<IUser>>(
      this.account_path.concat('?mail=').concat(email)
    );
  }
}
