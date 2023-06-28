import { Content } from './Content';
import { TextSnippet } from './TextSnippet';

/**
 * Text content as an object.
 */
export class TextContent extends Content {
    /** Array of text parts in specified format and style */
    textSnippets: TextSnippet[];
}
