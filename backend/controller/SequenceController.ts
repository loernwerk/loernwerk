import { ISequence } from '../../model/sequence/ISequence';
import { ISlide } from '../../model/slide/ISlide';
import { ISequenceWithSlides } from '../../model/sequence/ISequenceWithSlides';
import { DBSequence } from '../../model/sequence/DBSequence';
import { DBSlide } from '../../model/slide/DBSlide';
import { LoernwerkError, LoernwerkErrorCodes } from '../loernwerkUtilities';
import { DBUser } from '../../model/user/DBUser';
/**
 * Manages the sequence data in the database and handles inquiries requests regarding these
 */
export class SequenceController {
    /**
     * Creates a new sequence in the database with the given title and given user as owner.
     * @param name the title of the sequence
     * @param userId the userid of the owner
     * @returns the created sequence
     */
    public static async createNewSequence(
        name: string,
        userId: number
    ): Promise<ISequence> {
        if (!this.isValidUser(userId)) {
            throw new LoernwerkError(
                'user not found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
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
            throw new LoernwerkError(
                'no matching sequence',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        if (seq.length > 1) {
            throw new LoernwerkError(
                'ambigious Code',
                LoernwerkErrorCodes.AMBIGUOUS_INFORMATION
            );
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
        const sequenceWithoutSlide = await this.getSequenceByCode(code);
        if (sequenceWithoutSlide === null) {
            throw new LoernwerkError(
                'No sequence found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        const seq = sequenceWithoutSlide as ISequenceWithSlides;
        seq.slides = await DBSlide.find({ where: { sequenceCode: code } });
        seq.slideCount = seq.slides.length;
        return seq;
    }

    /**
     * Save the sequence in the database
     * @param sequence the sequence
     */
    public static async saveSequence(
        sequence: Partial<ISequenceWithSlides>
    ): Promise<void> {
        if (sequence.code == undefined) {
            throw new LoernwerkError(
                'No Code provided',
                LoernwerkErrorCodes.INSUFFICENT_INFORMATION
            );
        }
        const seq = await DBSequence.findOneBy({ code: sequence.code });
        if (seq === null) {
            throw new LoernwerkError(
                'No Sequence Found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }

        if (sequence.name !== undefined) {
            seq.name = sequence.name;
        }

        if (sequence.readAccess !== undefined) {
            this.updateSharedList(
                seq.readAccess,
                sequence.readAccess,
                seq.code
            );
            seq.readAccess = sequence.readAccess;
        }

        if (sequence.writeAccess !== undefined) {
            this.updateSharedList(
                seq.writeAccess,
                sequence.writeAccess,
                seq.code
            );
            seq.writeAccess = sequence.writeAccess;
        }

        if (sequence.slides !== undefined) {
            seq.slideCount = sequence.slides.length;
            this.saveSlides(sequence.slides);
        }
        seq.modificationDate = new Date();
        seq.save();
    }

    /**
     * Deletes the sequence with the given code
     * @param code the code of the sequence
     */
    public static async deleteSequence(code: string): Promise<void> {
        const seq = await DBSequence.findOneBy({ code: code });
        if (seq === null) {
            throw new LoernwerkError(
                'Sequence not Found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        const slides = await DBSlide.findBy({ sequenceCode: code });
        for (const s of slides) {
            s.remove();
        }
        // TODO: Remove H5P Content
        for (const uId of seq.readAccess) {
            const user = await DBUser.findOneBy({ id: uId });
            if (user == null) {
                continue;
            }
            user.sharedSequencesReadAccess = this.removeFromUserList(
                user.sharedSequencesReadAccess,
                code
            );
            user.save();
        }
        for (const uId of seq.writeAccess) {
            const user = await DBUser.findOneBy({ id: uId });
            if (user == null) {
                continue;
            }
            user.sharedSequencesWriteAccess = this.removeFromUserList(
                user.sharedSequencesWriteAccess,
                code
            );
            user.save();
        }
        seq.remove();
    }

    /**
     * Searches all sequenes of the user
     * @param userId the id of the user
     * @returns the sequences of the user
     */
    public static async getSequencesOfUser(
        userId: number
    ): Promise<ISequence[]> {
        if (!(await this.isValidUser(userId))) {
            throw new LoernwerkError(
                'User doesnt exists',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        return await DBSequence.find({ where: { authorId: userId } });
    }

    /**
     * Searches all sequences shared with the user.
     * @param userId the id of the user
     * @returns the sequences shared with the user
     */
    public static async getSharedSequencesOfUser(
        userId: number
    ): Promise<ISequence[]> {
        const user = await DBUser.findOneBy({ id: userId });
        if (user === null) {
            throw new LoernwerkError(
                'User doesnt exists',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        const seqlist: ISequence[] = [];
        for (const x of user.sharedSequencesReadAccess.concat(
            user.sharedSequencesWriteAccess
        )) {
            const seq = await DBSequence.findOneBy({ code: x });
            if (seq === null) {
                // May just bring it back to consistency?
                throw new LoernwerkError(
                    'User has access to a non existing Sequence',
                    LoernwerkErrorCodes.NOT_FOUND
                );
            }
            seqlist.push(seq);
        }
        return seqlist;
    }

    /**
     * Searches a sequence with corresponding code and reduces it to the attributes 'name, authorId, slideCount, code'. Throws an error if no sequence could be found.
     * @param code the code of the sequence
     * @returns the sequence (reduced)
     */
    public static async getSequenceForExecution(
        code: string
    ): Promise<Partial<ISequence>> {
        const seq = await DBSequence.findOne({
            where: { code: code },
            select: {
                name: true,
                authorId: true,
                slideCount: true,
                code: true,
            },
        });
        if (seq === null) {
            throw new LoernwerkError(
                'no sequence found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        return seq;
    }

    /**
     * Searches a slide of the sequence with given code. Throws an error if no sequence or slide could be found.
     * @param code the code of the sequence
     * @param slideIndex the index of the searched slide
     * @returns the matching slide
     */
    public static async getSequenceSlideByCode(
        code: string,
        slideIndex: number
    ): Promise<ISlide> {
        const slide = await DBSlide.findOne({
            where: { sequenceCode: code, order: slideIndex },
        });
        if (slide === null) {
            throw new LoernwerkError(
                'No matching Slide found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        return slide;
    }

    /**
     * stores the slides in the database
     * @param slides the slides to store
     */
    private static async saveSlides(slides: ISlide[]): Promise<void> {
        for (const x of slides) {
            let slide = await DBSlide.findOneBy({ id: x.id });
            if (slide === null) {
                slide = new DBSlide();
            }
            slide.backgroundColor = x.backgroundColor;
            slide.content = x.content;
            slide.layout = x.layout;
            slide.order = x.order;
            slide.save();
        }
    }

    /**
     * Generates a random code for a sequence.
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

    /**
     * Checks if the given user id matches an user in the db
     * @param userId the id of the user
     * @returns true if the user exists
     */
    private static async isValidUser(userId: number): Promise<boolean> {
        return (await DBUser.findOneBy({ id: userId })) !== null;
    }
    /**
     * removing the given code from the given list. used on read/write access lists
     * @param list the list
     * @param code the code
     * @returns the list wihtout the code
     */
    private static removeFromUserList(list: string[], code: string): string[] {
        return list.splice(list.indexOf(code), 1);
    }

    /**
     * updates users to fullfill the new list
     * @param oldList the old list
     * @param newList the new list to fullfill
     * @param code the code of the sequence
     */
    private static async updateSharedList(
        oldList,
        newList,
        code
    ): Promise<void> {
        for (const x of newList) {
            const user = await DBUser.findOneBy({ id: x });
            if (user === null) {
                throw new LoernwerkError(
                    'A read access user, does not exist',
                    LoernwerkErrorCodes.NOT_FOUND
                );
            }
            if (!user.sharedSequencesReadAccess.includes(code)) {
                user.sharedSequencesReadAccess.push(code);
                user.save();
            }
        }
        for (const x of this.getRemovedUser(oldList, newList)) {
            const user = await DBUser.findOneBy({ id: x });
            if (user === null) {
                continue; //this should be fine, right?
            }
            user.sharedSequencesReadAccess = this.removeFromUserList(
                user.sharedSequencesReadAccess,
                code
            );
        }
    }

    /**
     * gets the removed user from two access lists
     * @param oldList the old access list
     * @param newList the new access list
     * @returns the removed user (may empty)
     */
    private static getRemovedUser(
        oldList: number[],
        newList: number[]
    ): number[] {
        const retAr: number[] = [];
        for (const x of oldList) {
            if (!newList.includes(x)) {
                retAr.push(x);
            }
        }
        return retAr;
    }
}
