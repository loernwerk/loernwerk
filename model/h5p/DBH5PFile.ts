import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
} from 'typeorm';
import { IFileStats } from '@lumieducation/h5p-server';

/**
 * Database object containing a single file of a H5P object.
 */
@Entity()
export class DBH5PFile extends BaseEntity implements IFileStats {
    @CreateDateColumn()
    birthtime: Date;

    @Column()
    size: number;

    @Column()
    content: string;

    @Column()
    ownerType: 'library' | 'content';

    @PrimaryColumn()
    filename: string;

    @PrimaryColumn()
    owner: string;
}
