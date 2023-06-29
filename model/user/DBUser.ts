import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from './IUser';
import { UserClass } from './UserClass';

/**
 * Database object of an user.
 */
@Entity()
export class DBUser extends BaseEntity implements IUser {
    @Column()
    type: UserClass;

    @Column()
    name: string;

    @Column()
    mail: string;

    @Column()
    password: string;

    @Column('simple-json')
    sharedSequencesReadAccess: string[];

    @Column('simple-json')
    sharedSequencesWriteAccess: string[];

    @PrimaryGeneratedColumn('increment')
    id: number;
}
