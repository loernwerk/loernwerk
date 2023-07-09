import { LayoutSlot, LayoutType } from './layout/Layout';
import { Content } from './content/Content';

/**
 * Saves metadata for a slide object.
 */
export interface ISlide {
    /** Layout of this slide */
    layout: LayoutType;

    /** Content of each slot from the layout of the slide */
    content: Partial<Record<LayoutSlot, Content>>;

    /** Background color of this slide */
    backgroundColor: string;

    /** Code of the sequence to which this slides belongs */
    sequenceCode: string;

    /** Represents the position of this slide in the sequence */
    order: number;

    /** Unique identifier of this slide */
    id: number;
}
