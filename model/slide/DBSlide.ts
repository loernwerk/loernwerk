import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Index,
} from 'typeorm';
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
    content: Record<LayoutSlot, Content>;

    @Column()
    backgroundColor: string;

    @Column()
    @Index()
    sequenceCode: string;

    @Column()
    order: number;

    @PrimaryGeneratedColumn('increment')
    id: number;
}
