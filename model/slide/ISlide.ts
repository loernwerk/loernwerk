/**
 * Saves metadata for a slide object.
 */
export interface ISlide {
    //TODO: unknown ersetzen durch LayoutType
    /** Layout of this slide */
    layout: unknown;

    //TODO: Record ersetzen durch LayoutSlot, Content
    /** Content of each slot from the layout of the slide */
    content: Record<string, unknown>;

    /** Background color of this slide */
    backgroundColor: string;

    /** Code of the sequence to which this slides belongs */
    sequenceCode: string;

    /** Represents the position of this slide in the sequence */
    order: number;

    /** Unique identifier of this slide */
    id: number;
}
