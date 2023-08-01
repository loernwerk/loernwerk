import {
    ContentPermission,
    GeneralPermission,
    IPermissionSystem,
    IUser,
} from '@lumieducation/h5p-server';
import { DBH5PContent } from '../../model/h5p/DBH5PContent';
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
            select: ['ownerSequence'],
        });
        if (!content || content.ownerSequence === null) {
            return true;
        }
        const sequence = await DBSequence.findOneOrFail({
            where: { code: content.ownerSequence },
            select: ['authorId', 'readAccess', 'writeAccess'],
        });
        return (
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
     * @param actingUser User to check
     * @param permission Permission to check
     * @returns true, if the supplied user is allowed to take the requested action, false otherwise
     */
    async checkForGeneralAction(
        actingUser: H5PUser,
        permission: GeneralPermission
    ): Promise<boolean> {
        if (permission === GeneralPermission.CreateRestricted) {
            return actingUser.isAdmin;
        }
        return actingUser.isLoggedIn;
    }
}
