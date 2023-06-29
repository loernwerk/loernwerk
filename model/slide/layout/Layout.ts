/**
 * Describes layout of a slide with its slots.
 */
export class Layout {
    /**
     * Get slots of a given layout.
     * @param layout layout to get slots of
     * @returns slots of given layout
     */
    public static getLayoutSlots(layout: LayoutType): LayoutSlot[] {
        switch (layout) {
            case LayoutType.TITLEPAGE:
                return [LayoutSlot.HEADER];

            case LayoutType.SINGLE_COLUMN_WITH_HEADER:
                return [LayoutSlot.HEADER, LayoutSlot.MAIN];

            case LayoutType.SINGLE_COLUMN:
                return [LayoutSlot.MAIN];

            case LayoutType.TWO_COLUMN_WITH_HEADER:
                return [
                    LayoutSlot.HEADER,
                    LayoutSlot.MAIN,
                    LayoutSlot.SECONDARY,
                ];

            case LayoutType.TWO_COLUMN:
                return [LayoutSlot.MAIN, LayoutSlot.SECONDARY];

            case LayoutType.GRID_WITH_HEADER:
                return [
                    LayoutSlot.HEADER,
                    LayoutSlot.MAIN,
                    LayoutSlot.SECONDARY,
                    LayoutSlot.TERTIARY,
                    LayoutSlot.FOURARY,
                ];

            case LayoutType.GRID:
                return [
                    LayoutSlot.MAIN,
                    LayoutSlot.SECONDARY,
                    LayoutSlot.TERTIARY,
                    LayoutSlot.FOURARY,
                ];

            case LayoutType.SIDEBAR:
                return [
                    LayoutSlot.HEADER,
                    LayoutSlot.MAIN,
                    LayoutSlot.SECONDARY,
                ];

            default:
                throw new Error('Unknown LayoutType');
        }
    }
}

/**
 * Different layouts of slides.
 */
export enum LayoutType {
    /** Contains one title-slot, vertically and horizontally centered */
    TITLEPAGE,
    /** Contains title-slot at the top and one big content-slot beneath */
    SINGLE_COLUMN_WITH_HEADER,
    /** Contains one big content-slot */
    SINGLE_COLUMN,
    /** Contains title-slot at the top and two content-slots beneath */
    TWO_COLUMN_WITH_HEADER,
    /** Contains two content-slots */
    TWO_COLUMN,
    /** Contains title-slot at the top and four content-slots in a two by two grid beneath */
    GRID_WITH_HEADER,
    /** Contains four content-slots in a two by two grid */
    GRID,
    /** On the left side: contains a title-slot and a content-slot beneath, On the right side: contains one big content-slot */
    SIDEBAR,
}

/**
 * Different slots of layouts.
 */
export enum LayoutSlot {
    /** Slot for title */
    HEADER,
    /** Main slot for content */
    MAIN,
    /** Second slot for content */
    SECONDARY,
    /** Third slot for content */
    TERTIARY,
    /** Forth slot of content */
    FOURARY,
}
