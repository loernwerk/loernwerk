import {
    ContentPermission,
    IPermissionSystem,
    IUser,
} from '@lumieducation/h5p-server';
import { DBH5PContent, DBH5PContentUsedBy } from '../../model/h5p/DBH5PContent';
import { In } from 'typeorm';
import { DBSequence } from '../../model/sequence/DBSequence';

export interface H5PUser extends IUser {
    isAdmin: boolean;
    isLoggedIn: boolean;
    userId: number;
}

/**
 * Class managing permissions for H5P library
 */
export class H5PPermissionSystem implements IPermissionSystem<H5PUser> {
    /**
     * Checks content permissions for an user.
     * @param actingUser User to check
     * @param permission Permission to check
     * @param contentId Content id to check
     * @returns true, if the user is allowed to take the requested action on the supplied content, false otherwise
     */
    async checkForContent(
        actingUser: H5PUser,
        permission: ContentPermission,
        contentId: string | undefined
    ): Promise<boolean> {
        if (permission === ContentPermission.View) {
            return true;
        }
        if (actingUser.isAdmin) {
            return true;
        }
        if (
            actingUser.isLoggedIn &&
            (permission === ContentPermission.Create ||
                permission === ContentPermission.List)
        ) {
            return true;
        }

        if (!contentId) {
            return false;
        }
        const content = await DBH5PContent.findOne({
            where: { h5pContentId: contentId },
            select: ['owner'],
        });
        if (!content) {
            return true;
        }
        if (content.owner === actingUser.userId) {
            return true;
        }
        if (permission === ContentPermission.Delete) {
            return false; // Only the owner is allowed to delete
        }
        const containingSequenceCodes = await DBH5PContentUsedBy.find({
            where: { h5pContentId: contentId },
            select: ['sequenceCode'],
        });
        const containingSequences = await DBSequence.find({
            where: {
                code: In(
                    containingSequenceCodes.map((entry) => entry.sequenceCode)
                ),
            },
            select: ['authorId', 'writeAccess'],
        });
        return containingSequences.some(
            (sequence) =>
                sequence.writeAccess.includes(actingUser.userId) ||
                sequence.authorId === actingUser.userId
        );
    }

    /**
     * Checks permissions regarding user data. Will always return false, since we don't use userdata in this project.
     * @returns false
     */
    async checkForUserData(): Promise<boolean> {
        return false;
    }

    /**
     * Checks whether an user is allowed to interact with temporaray files.
     * @param actingUser User to check
     * @returns true, if the user is logged in, false otherwise
     */
    async checkForTemporaryFile(actingUser: H5PUser): Promise<boolean> {
        return actingUser.isLoggedIn;
    }

    /**
     * Checks general permissions for an supplied user
     * @returns true, if the supplied user is allowed to take the requested action, false otherwise
     */
    async checkForGeneralAction(): Promise<boolean> {
        return true;
        /*
         * if (permission === GeneralPermission.CreateRestricted) {
         *     return actingUser.isAdmin;
         * }
         * return actingUser.isLoggedIn;
         */
    }
}
