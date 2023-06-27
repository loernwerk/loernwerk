import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ISlide } from './ISlide';
import { Content } from './content/Content';
import { LayoutSlot, LayoutType } from './layout/Layout';

/**
 * Database object of a slide.
 */
@Entity()
export class DBSlide extends BaseEntity implements ISlide {
    /** Layout of this slide */
    @Column()
    layout: LayoutType;

    /** Content of each slot from the layout of the slide */
    @Column('simple-json')
    content: Record<LayoutSlot, Content>;

    /** Background color of this slide */
    @Column()
    backgroundColor: string;

    /** Code of the sequence to which this slides belongs */
    @Column()
    sequenceCode: string;

    /** Represents the position of this slide in the sequence */
    @Column()
    order: number;

    /** Unique identifier of this slide */
    @PrimaryGeneratedColumn('increment')
    id: number;
}
