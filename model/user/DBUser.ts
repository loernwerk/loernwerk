import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from './IUser';
import { UserClass } from './UserClass';

/**
 * Database object of an user.
 */
@Entity()
export class DBUser extends BaseEntity implements IUser {
    /** Type of this user */
    @Column()
    type: UserClass;

    /** Username of this user */
    @Column()
    name: string;

    /** Mail of this user */
    @Column()
    mail: string;

    /** Password of this user for login, hashed according to security standards */
    @Column()
    password: string;

    /** Sequences to which this user has read access */
    @Column('simple-json')
    sharedSequencesReadAccess: string[];

    /** Sequences to which this user has write access */
    @Column('simple-json')
    sharedSequencesWriteAccess: string[];

    /** Unique identifier of this user */
    @PrimaryGeneratedColumn('auto-increment')
    id: number;
}
