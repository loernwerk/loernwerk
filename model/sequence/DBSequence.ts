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
    @Column()
    name: string;

    @CreateDateColumn()
    creationDate: Date;

    @UpdateDateColumn()
    modificationDate: Date;

    @PrimaryColumn()
    code: string;

    @Column()
    authorId: number;

    @Column('simple-json')
    writeAccess: number[];

    @Column('simple-json')
    readAccess: number[];

    @Column()
    slideCount: number;

    @Column('simple-json')
    tags: string[];
}
