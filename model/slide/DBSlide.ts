import { BaseEntity, Entity, Column, PrimaryColumn, Index } from 'typeorm';
import { ISlide } from './ISlide';
import { Content } from './content/Content';
import { LayoutSlot, LayoutType } from './layout/Layout';

/**
 * Database object of a slide.
 */
@Entity()
export class DBSlide extends BaseEntity implements ISlide {
    @Column()
    layout: LayoutType;

    @Column('simple-json')
    content: Partial<Record<LayoutSlot, Content>>;

    @Column()
    backgroundColor: string;

    @Index()
    @PrimaryColumn()
    sequenceCode: string;

    @Column()
    order: number;

    @PrimaryColumn()
    id: number;
}
