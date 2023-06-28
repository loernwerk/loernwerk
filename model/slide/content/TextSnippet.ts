/**
 * Style and format options of a text.
 */
export interface TextOptions {
    /** Display text italic */
    italic: boolean;
    /** Display text bold */
    bold: boolean;
    /** Display text underlined */
    underlined: boolean;

    /** Font name of text */
    font: string;
    /** Size of text */
    size: number;

    /** Color of text */
    color: string;

    /** Horizontal text alignement */
    alignementHorizontal: 'left' | 'center' | 'right';
    /** Vertical text alignment */
    alignmentVertical: 'top' | 'center' | 'bottom';
}

/**
 * Text part as object with specified format and style.
 */
export class TextSnippet {
    /** Unformatted textual content */
    text: string;
    /** Style and format in which text should be displayed */
    options: TextOptions;
}
