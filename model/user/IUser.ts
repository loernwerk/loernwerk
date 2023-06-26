/**
 * Saves metadata for an user object.
 */
export interface IUser {
    //TODO: unknown ersetzen durch UserClass
    /** Type of this user */
    type: unknown;

    /** Username of this user */
    name: string;

    /** Mail of this user */
    mail: string;

    /** Password of this user for login, hashed according to security standards */
    password: string;

    /** Sequences to which this user has read access */
    sharedSequencesReadAccess: string[];

    /** Sequences to which this user has write access */
    sharedSequencesWriteAccess: string[];

    /** Unique identifier of this user */
    id: number;
}
