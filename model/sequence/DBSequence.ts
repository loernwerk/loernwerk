import { ISequence } from './ISequence';
import {
    BaseEntity,
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
} from 'typeorm';

/**
 * Database object of a sequence.
 */
@Entity()
export class DBSequence extends BaseEntity implements ISequence {
    /** Name of sequence */
    @Column()
    name: string;

    /** Date on which sequence was created */
    @CreateDateColumn()
    creationDate: Date;

    /** Date on which sequence was last modified */
    @UpdateDateColumn()
    modificationDate: Date;

    /** Code to access sequence, unique identifier */
    @PrimaryColumn()
    code: string;

    /** Id of user who created sequence */
    @Column()
    authorId: number;

    /** Ids of users who have write access to this sequence */
    @Column('simple-json')
    writeAccess: number[];

    /** Ids of users who have read access to this sequence */
    @Column('simple-json')
    readAccess: number[];

    /** Amount of slides in this sequence */
    @Column()
    slideCount: number;
}
