import { ISequence } from '../../model/sequence/ISequence';
import { ISlide } from '../../model/slide/ISlide';
import { ISequenceWithSlides } from '../../model/sequence/ISequenceWithSlides';
import { DBSequence } from '../../model/sequence/DBSequence';
import { DBSlide } from '../../model/slide/DBSlide';
/**
 * Manages the sequence data in the database and handles inquiries requests regarding these
 */
export class SequenceController {
    /**
     * Creates a new sequence in the database with the given title and given user as owner.
     * @param name the title of the sequence
     * @param userId the userid of the owner
     * @returns the created Sequence
     */
    public static async createNewSequence(
        name: string,
        userId: number
    ): Promise<ISequence> {
        const seq = new DBSequence();
        seq.creationDate = new Date();
        let gencode = this.genCode();
        while ((await DBSequence.findBy({ code: gencode })).length > 0) {
            gencode = this.genCode();
        }
        seq.code = gencode;
        seq.authorId = userId;
        seq.name = name;
        seq.modificationDate = new Date();
        seq.slideCount = 0;
        seq.writeAccess = [];
        seq.readAccess = [];
        seq.save();
        return seq;
    }

    /**
     * Searches the database for a sequence with corresponding access code. Throws an error if no sequence could be found.
     * @param code the code of the sequence
     * @returns the sequence
     */
    public static async getSequenceByCode(code: string): Promise<ISequence> {
        const seq = await DBSequence.findBy({ code: code });
        if (seq.length === 0) {
            throw new Error('no matching sequence');
        }
        if (seq.length > 1) {
            throw new Error('ambigious Code');
        }
        return seq[0];
    }

    /**
     * Searches the database for a sequence with corresponding access code, as well as its slides. Throws an error if no sequence could be found.
     * @param code the code of the sequence
     * @returns the sequence with slides
     */
    public static async getSequenceWithSlide(
        code: string
    ): Promise<ISequenceWithSlides> {
        const seq = (await this.getSequenceByCode(code)) as ISequenceWithSlides;
        seq.slides = await DBSlide.find({ where: { sequenceCode: code } });
        seq.slideCount = seq.slides.length;
        return seq;
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

    /**
     * Generates a random Code for a Sequence.
     * @returns  the generated sequence
     */
    private static genCode(): string {
        const codechar = 'abcdefghijklmnopqrstuvwxyz1234567890';
        const charactersLength = codechar.length;
        let result = '';
        for (let i = 0; i < length; i++) {
            result += codechar.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    }
}
