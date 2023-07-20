import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';
import { IConfigEntry } from './IConfigEntry';
import { ConfigKey } from './ConfigKey';

/**
 * Database object of a configuration setting.
 */
@Entity()
export class DBConfigEntry extends BaseEntity implements IConfigEntry {
    @PrimaryColumn()
    key: ConfigKey;

    @Column('simple-json')
    value: unknown;
}
