import { Content } from './Content';

/**
 * H5P content as object.
 */
export class H5PContent extends Content {
    /** Id of H5P content */
    h5pContentId: string;

    /** Code of sequence this content belongs to */
    sequenceCode: string;
}
