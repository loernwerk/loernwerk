import { ISequence } from '../../model/sequence/ISequence';
import { ISlide } from '../../model/slide/ISlide';
import { ISequenceWithSlides } from '../../model/sequence/ISequenceWithSlides';
import { DBSequence } from '../../model/sequence/DBSequence';
import { DBSlide } from '../../model/slide/DBSlide';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../model/loernwerkError';
import { DBUser } from '../../model/user/DBUser';
import { DBH5PContent } from '../../model/h5p/DBH5PContent';
import { H5PServer } from '../h5p/H5PServer';
import { readFile } from 'fs/promises';
import { Document, ExternalDocument } from 'pdfjs';
import { ConfigController } from './ConfigController';
import { ConfigKey } from '../../model/configuration/ConfigKey';

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
        if (!(await this.isValidUser(userId))) {
            throw new LoernwerkError(
                'user not found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        const userSequenceLimit = (await ConfigController.getConfigEntry(
            ConfigKey.MAX_SEQUENCES_PER_USER
        )) as number;
        const sequencesOfUser = await DBSequence.find({
            where: { authorId: userId },
            select: { code: true },
        });
        if (sequencesOfUser.length >= userSequenceLimit) {
            throw new LoernwerkError(
                'no more sequences creatable',
                LoernwerkErrorCodes.FORBIDDEN
            );
        }
        const dbSequence = new DBSequence();
        let newCode = '';
        do {
            newCode = this.generateCode();
        } while (
            (await DBSequence.findOne({
                where: { code: newCode },
                select: ['code'],
            })) !== null
        );
        dbSequence.code = newCode;
        dbSequence.authorId = userId;
        dbSequence.name = name;
        dbSequence.slideCount = 0;
        dbSequence.writeAccess = [];
        dbSequence.readAccess = [];
        dbSequence.tags = [];
        await dbSequence.save();
        return dbSequence;
    }

    /**
     * Searches the database for a sequence with corresponding access code. Throws an error if no sequence could be found.
     * @param code the code of the sequence
     * @returns the sequence
     */
    public static async getSequenceByCode(code: string): Promise<ISequence> {
        const dbSequence = await DBSequence.findOneBy({
            code: code.toUpperCase(),
        });
        if (dbSequence === null) {
            throw new LoernwerkError(
                'No matching sequence',
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
    public static async getSequenceWithSlides(
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
            where: { sequenceCode: code.toUpperCase() },
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
        if (sequence.code === undefined) {
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
            await this.updateSharedAccessList(
                dbSequence.readAccess,
                sequence.readAccess,
                dbSequence.code,
                'sharedSequencesReadAccess'
            );
            dbSequence.readAccess = sequence.readAccess;
        }

        if (sequence.writeAccess !== undefined) {
            await this.updateSharedAccessList(
                dbSequence.writeAccess,
                sequence.writeAccess,
                dbSequence.code,
                'sharedSequencesWriteAccess'
            );
            dbSequence.writeAccess = sequence.writeAccess;
        }

        if (sequence.slides !== undefined) {
            dbSequence.slideCount = sequence.slides.length;
            await this.saveSlides(sequence.slides);
        }

        if (sequence.tags !== undefined) {
            dbSequence.tags = sequence.tags;
        }

        await dbSequence.save();
    }

    /**
     * Deletes the sequence with the given code
     * @param code the code of the sequence
     */
    public static async deleteSequence(code: string): Promise<void> {
        const dbSequence = await DBSequence.findOne({
            where: { code: code },
            select: ['code', 'readAccess', 'writeAccess'],
        });
        if (dbSequence === null) {
            throw new LoernwerkError(
                'Sequence not Found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        const slides = await DBSlide.findBy({ sequenceCode: code });
        for (const s of slides) {
            await s.remove();
        }
        const h5pContent = await DBH5PContent.find({
            select: ['h5pContentId'],
            where: { ownerSequence: code },
        });
        for (const h5p of h5pContent) {
            await H5PServer.getInstance()
                .getH5PEditor()
                .deleteContent(h5p.h5pContentId, undefined);
        }
        for (const uId of dbSequence.readAccess) {
            const user = await DBUser.findOneBy({ id: uId });
            if (user == null) {
                continue;
            }
            this.removeFromUserList(user.sharedSequencesReadAccess, code);
            await user.save();
        }
        for (const uId of dbSequence.writeAccess) {
            const user = await DBUser.findOneBy({ id: uId });
            if (user == null) {
                continue;
            }
            this.removeFromUserList(user.sharedSequencesWriteAccess, code);
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
        const user = await DBUser.findOne({
            where: { id: userId },
            select: ['sharedSequencesWriteAccess', 'sharedSequencesReadAccess'],
        });
        if (user === null) {
            throw new LoernwerkError(
                'User doesnt exists',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }
        const seqlist: ISequence[] = [];
        for (const code of user.sharedSequencesReadAccess.concat(
            user.sharedSequencesWriteAccess
        )) {
            const dbSequence = await DBSequence.findOneBy({ code: code });
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
            where: { code: code.toUpperCase() },
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
            where: { sequenceCode: code.toUpperCase(), order: slideIndex },
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
     * Generates a pdf certificate for the specified sequence.
     * @param code Code of the sequence
     * @returns Certifcate PDF as Buffer
     */
    public static async getCertificatePDF(code: string): Promise<Buffer> {
        const sequence = await DBSequence.findOne({
            select: ['code', 'name'],
            where: { code: code },
        });
        if (sequence === null) {
            throw new LoernwerkError(
                'Sequence not found',
                LoernwerkErrorCodes.NOT_FOUND
            );
        }

        const srcPDF = await readFile('assets/certificate_de.pdf');
        const templatePDF = new ExternalDocument(srcPDF);

        const generatedPDF = new Document();
        generatedPDF.setTemplate(templatePDF);
        generatedPDF
            .cell({ x: 0, y: 385 })
            .text(sequence.name, { alignment: 'center', fontSize: 30 });
        generatedPDF
            .cell({ x: 0, y: 305 })
            .text(sequence.code, { alignment: 'center', fontSize: 30 });
        generatedPDF.cell({ x: 0, y: 225 }).text(new Date().toLocaleString(), {
            alignment: 'center',
            fontSize: 30,
        });

        return await generatedPDF.asBuffer();
    }

    /**
     * stores the slides in the database
     * @param slides the slides to store
     */
    private static async saveSlides(slides: ISlide[]): Promise<void> {
        for (const s of slides) {
            let slide = await DBSlide.findOneBy({ id: s.id });
            if (slide === null) {
                slide = new DBSlide();
                slide.id = s.id;
                slide.sequenceCode = s.sequenceCode;
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
     * @returns the generated sequence
     */
    private static generateCode(): string {
        const codechar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        const CODE_LENGTH = 6;
        let result = '';
        for (let i = 0; i < CODE_LENGTH; i++) {
            result += codechar.charAt(Math.floor(Math.random() * CODE_LENGTH));
        }
        return result;
    }

    /**
     * Checks if the given user id matches an user in the database
     * @param userId the id of the user
     * @returns true if the user exists
     */
    private static async isValidUser(userId: number): Promise<boolean> {
        return (
            (await DBUser.findOne({
                where: { id: userId },
                select: ['id'],
            })) !== null
        );
    }
    /**
     * removing the given code from the given list in place. used on read/write access lists
     * @param list the list
     * @param code the code
     */
    private static removeFromUserList(list: string[], code: string): void {
        list.splice(list.indexOf(code), 1);
    }

    /**
     * updates users to fullfill a new access list
     * @param oldAccessList the old access list
     * @param newAccessList the new access list to fullfill
     * @param code the code of the sequence
     * @param accessList the access list attribute of the user to modify
     */
    private static async updateSharedAccessList(
        oldAccessList: number[],
        newAccessList: number[],
        code: string,
        accessList: 'sharedSequencesReadAccess' | 'sharedSequencesWriteAccess'
    ): Promise<void> {
        for (const uId of newAccessList) {
            const user = await DBUser.findOneBy({ id: uId });
            if (user === null) {
                throw new LoernwerkError(
                    'A read access user, does not exist',
                    LoernwerkErrorCodes.NOT_FOUND
                );
            }
            if (!user[accessList].includes(code)) {
                user[accessList].push(code);
                await user.save();
            }
        }
        for (const uId of this.getRemovedUserFromAccessLists(
            oldAccessList,
            newAccessList
        )) {
            const user = await DBUser.findOneBy({ id: uId });
            if (user === null) {
                continue; //this should be fine, right?
            }
            this.removeFromUserList(user[accessList], code);
            await user.save();
        }
    }

    /**
     * gets the removed user from two access lists
     * @param oldAccessList the old access list
     * @param newAccessList the new access list
     * @returns the removed user (may empty)
     */
    private static getRemovedUserFromAccessLists(
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
