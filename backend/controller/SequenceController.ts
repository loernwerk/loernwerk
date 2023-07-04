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
        const dbSequence = new DBSequence();
        let newCode = this.generateCode();
        while ((await DBSequence.findBy({ code: newCode })).length > 0) {
            newCode = this.generateCode();
        }
        dbSequence.code = newCode;
        dbSequence.authorId = userId;
        dbSequence.name = name;
        dbSequence.slideCount = 0;
        dbSequence.writeAccess = [];
        dbSequence.readAccess = [];
        await dbSequence.save();
        return dbSequence;
    }

    /**
     * Searches the database for a sequence with corresponding access code. Throws an error if no sequence could be found.
     * @param code the code of the sequence
     * @returns the sequence
     */
    public static async getSequenceByCode(code: string): Promise<ISequence> {
        const dbSequence = await DBSequence.findOneBy({ code: code });
        if (dbSequence === null) {
            throw new LoernwerkError(
                'no matching sequence',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        return dbSequence;
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
        const sequenceWithSlide = sequenceWithoutSlide as ISequenceWithSlides;
        sequenceWithSlide.slides = await DBSlide.find({
            where: { sequenceCode: code },
        });
        sequenceWithSlide.slideCount = sequenceWithSlide.slides.length;
        return sequenceWithSlide;
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
        const dbSequence = await DBSequence.findOneBy({ code: sequence.code });
        if (dbSequence === null) {
            throw new LoernwerkError(
                'No Sequence Found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }

        if (sequence.name !== undefined) {
            dbSequence.name = sequence.name;
        }

        if (sequence.readAccess !== undefined) {
            await this.updateSharedList(
                dbSequence.readAccess,
                sequence.readAccess,
                dbSequence.code
            );
            dbSequence.readAccess = sequence.readAccess;
        }

        if (sequence.writeAccess !== undefined) {
            await this.updateSharedList(
                dbSequence.writeAccess,
                sequence.writeAccess,
                dbSequence.code
            );
            dbSequence.writeAccess = sequence.writeAccess;
        }

        if (sequence.slides !== undefined) {
            dbSequence.slideCount = sequence.slides.length;
            await this.saveSlides(sequence.slides);
        }
        await dbSequence.save();
    }

    /**
     * Deletes the sequence with the given code
     * @param code the code of the sequence
     */
    public static async deleteSequence(code: string): Promise<void> {
        const dbSequence = await DBSequence.findOneBy({ code: code });
        if (dbSequence === null) {
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
        for (const uId of dbSequence.readAccess) {
            const user = await DBUser.findOneBy({ id: uId });
            if (user == null) {
                continue;
            }
            user.sharedSequencesReadAccess = this.removeFromUserList(
                user.sharedSequencesReadAccess,
                code
            );
            await user.save();
        }
        for (const uId of dbSequence.writeAccess) {
            const user = await DBUser.findOneBy({ id: uId });
            if (user == null) {
                continue;
            }
            user.sharedSequencesWriteAccess = this.removeFromUserList(
                user.sharedSequencesWriteAccess,
                code
            );
            await user.save();
        }
        await dbSequence.remove();
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
            const dbSequence = await DBSequence.findOneBy({ code: x });
            if (dbSequence === null) {
                // May just bring it back to consistency?
                throw new LoernwerkError(
                    'User has access to a non existing Sequence',
                    LoernwerkErrorCodes.NOT_FOUND
                );
            }
            seqlist.push(dbSequence);
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
        const dbSequence = await DBSequence.findOne({
            where: { code: code },
            select: {
                name: true,
                authorId: true,
                slideCount: true,
                code: true,
            },
        });
        if (dbSequence === null) {
            throw new LoernwerkError(
                'no sequence found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        return dbSequence;
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
        for (const s of slides) {
            let slide = await DBSlide.findOneBy({ id: x.id });
            if (slide === null) {
                slide = new DBSlide();
            }
            slide.backgroundColor = s.backgroundColor;
            slide.content = s.content;
            slide.layout = s.layout;
            slide.order = s.order;
            await slide.save();
        }
    }

    /**
     * Generates a random code for a sequence.
     * @returns  the generated sequence
     */
    private static generateCode(): string {
        const codechar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
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
     * Checks if the given user id matches an user in the database
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
     * updates users to fullfill a new access list
     * @param oldAccessList the old access list
     * @param newAccessList the new access list to fullfill
     * @param code the code of the sequence
     */
    private static async updateSharedList(
        oldAccessList: number[],
        newAccessList: number[],
        code: string
    ): Promise<void> {
        for (const uId of newAccessList) {
            const user = await DBUser.findOneBy({ id: uId });
            if (user === null) {
                throw new LoernwerkError(
                    'A read access user, does not exist',
                    LoernwerkErrorCodes.NOT_FOUND
                );
            }
            if (!user.sharedSequencesReadAccess.includes(code)) {
                user.sharedSequencesReadAccess.push(code);
                await user.save();
            }
        }
        for (const uId of this.getRemovedUser(oldAccessList, newAccessList)) {
            const user = await DBUser.findOneBy({ id: uId });
            if (user === null) {
                continue; //this should be fine, right?
            }
            user.sharedSequencesReadAccess = this.removeFromUserList(
                user.sharedSequencesReadAccess,
                code
            );
            await user.save();
        }
    }

    /**
     * gets the removed user from two access lists
     * @param oldAccessList the old access list
     * @param newAccessList the new access list
     * @returns the removed user (may empty)
     */
    private static getRemovedUser(
        oldAccessList: number[],
        newAccessList: number[]
    ): number[] {
        const returnArray: number[] = [];
        for (const x of oldAccessList) {
            if (!newAccessList.includes(x)) {
                returnArray.push(x);
            }
        }
        return returnArray;
    }
}
