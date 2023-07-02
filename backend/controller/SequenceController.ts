import { ISequence } from '../../model/sequence/ISequence';
import { ISlide } from '../../model/slide/ISlide';
import { ISequenceWithSlides } from '../../model/sequence/ISequenceWithSlides';
/**
 * Manages the sequence data in the database and handles inquiries requests regarding these
 */
export class SequenceController {
    /**
     * Creates a new sequence in the database with the given title and given user as owner.
     * @param title the title of the sequence
     * @param userId the userid of the owner
     */
    public static async createNewSequence(
        title: string,
        userId: number
    ): Promise<ISequence> {
        void title;
        void userId;
        throw new Error('Not implemented');
    }

    /**
     * Searches the database for a sequence with corresponding access code. Throws an error if no sequence could be found.
     * @param code the code of the sequence
     */
    public static async getSequenceByCode(code: string): Promise<ISequence> {
        void code;
        throw new Error('Not implemented');
    }

    /**
     * Searches the database for a sequence with corresponding access code, as well as its slides. Throws an error if no sequence could be found.
     * @param code the code of the sequence
     */
    public static async getSequenceWithSlide(
        code: string
    ): Promise<ISequenceWithSlides> {
        void code;
        throw new Error('Not implemented');
    }

    /**
     * Save the Sequence in the Database
     * @param sequence the sequence
     */
    public static async saveSequence(
        sequence: Partial<ISequenceWithSlides>
    ): Promise<void> {
        void sequence;
        throw new Error('Not implemented');
    }

    /**
     * Deletes the Sequence with the given Code
     * @param code the code of the sequence
     */
    public static async deleteSequence(code: string): Promise<void> {
        void code;
        throw new Error('Not implemented');
    }

    /**
     * Searches all Sequenes of the User
     * @param userId the id of the User
     */
    public static async getSequencesOfUser(
        userId: number
    ): Promise<ISequence[]> {
        void userId;
        throw new Error('Not implemented');
    }

    /**
     * Searches all sequences shared with the user.
     * @param userId the id of the User
     */
    public static async getSharedSequencesOfUser(
        userId: number
    ): Promise<ISequence[]> {
        void userId;
        throw new Error('Not implemented');
    }

    /**
     * Searches a sequence with corresponding code and reduces it to the attributes 'name, authorId, slideCount, code'. Throws an error if no sequence could be found.
     * @param code the code of the sequence
     */
    public static async getSequenceForExecution(
        code: string
    ): Promise<Partial<ISequence>> {
        void code;
        throw new Error('Not implemented');
    }

    /**
     * Searches a slide of the sequence with given code. Throws an error if no sequence or slide could be found.
     * @param code the code of the sequence
     * @param slideIndex the index of the searched slide
     */
    public static async getSequenceSlideByCode(
        code: string,
        slideIndex: number
    ): Promise<ISlide> {
        void code;
        void slideIndex;
        throw new Error('Not implemented');
    }
}
