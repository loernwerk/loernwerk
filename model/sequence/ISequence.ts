/**
 * Saves metadata for a sequence object.
 */
export interface ISequence {
    /** Name of sequence */
    name: string;

    /** Date on which sequence was created */
    creationDate: Date;

    /** Date on which sequence was last modified */
    modificationDate: Date;

    /** Code to access sequence, unique identifier */
    code: string;

    /** Id of user who created sequence */
    authorId: number;

    /** Ids of users who have write access to this sequence */
    writeAccess: number[];

    /** Ids of users who have read access to this sequence */
    readAccess: number[];

    /** Amount of slides in this sequence */
    slideCount: number;
}
