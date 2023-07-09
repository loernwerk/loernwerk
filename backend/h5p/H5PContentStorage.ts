import {
    ContentId,
    ContentParameters,
    IContentMetadata,
    IContentStorage,
    IFileStats,
    ILibraryName,
    IUser,
    LibraryName,
    Permission,
} from '@lumieducation/h5p-server';
import { Readable } from 'stream';
import { DBH5PFile } from '../../model/h5p/DBH5PFile';
import { DBH5PContent } from '../../model/h5p/DBH5PContent';
import { DBUser } from '../../model/user/DBUser';
import { DBSequence } from '../../model/sequence/DBSequence';
import { UserClass } from '../../model/user/IUser';
import { LoernwerkError, LoernwerkErrorCodes } from '../loernwerkError';
import { In } from 'typeorm';

/**
 * Custom H5P Content storage implementation to use the SQL database.
 */
export class H5PContentStorage implements IContentStorage {
    /**
     * Creates a content object in the repository. Content files (like images)
     * are added to it later with addFile(...). Throws an error if something
     * went wrong. In this case the calling method will remove all traces of the
     * content and all changes are reverted.
     * @param metadata The content metadata of the content (= h5p.json)
     * @param content the content object (= content/content.json)
     * @param user The user who owns this object.
     * @param contentId (optional) The content id to use
     * @returns The newly assigned content id
     */
    public async addContent(
        metadata: IContentMetadata,
        content: unknown,
        user: IUser,
        contentId?: ContentId
    ): Promise<ContentId> {
        const dbContent = new DBH5PContent();
        Object.assign(dbContent, metadata);
        dbContent.content = content;
        if (contentId !== undefined) {
            const existingContent = await DBH5PContent.findOneBy({
                h5pContentId: contentId,
            });
            if (existingContent === null) {
                dbContent.h5pContentId = contentId;
            }
        }
        await dbContent.save();
        return dbContent.h5pContentId;
    }

    /**
     * Adds a content file to an existing content object. The content object has
     * to be created with addContent(...) first.
     * @param contentId The id of the content to add the file to
     * @param filename The filename; can be a path including subdirectories
     * (e.g. 'images/xyz.png')
     * @param readStream A readable stream that contains the data
     * @param user (optional) The user who owns this object
     */
    public async addFile(
        contentId: ContentId,
        filename: string,
        readStream: Readable,
        user?: IUser
    ): Promise<void> {
        if (user && !(await this.canUserAccessContent(user.id, contentId))) {
            throw new LoernwerkError(
                'User is not allowed to edit this content',
                LoernwerkErrorCodes.FORBIDDEN
            );
        }

        // Converting the readable to a string
        const chunks = [];
        for await (const chunk of readStream) {
            chunks.push(chunk);
        }
        const fileBuffer = Buffer.concat(chunks);

        const dbFile = new DBH5PFile();
        dbFile.filename = filename;
        dbFile.ownerType = 'content';
        dbFile.owner = contentId;
        dbFile.content = fileBuffer;
        dbFile.size = fileBuffer.length;
        await dbFile.save();
    }

    /**
     * Checks if a piece of content exists in storage.
     * @param contentId the content id to check
     * @returns true if the piece of content exists
     */
    public async contentExists(contentId: ContentId): Promise<boolean> {
        const content = await DBH5PContent.findOneBy({
            h5pContentId: contentId,
        });
        return content !== null;
    }

    /**
     * Checks if a file exists.
     * @param contentId The id of the content to add the file to
     * @param filename the filename of the file to get; can be a path including
     * subdirectories (e.g. 'images/xyz.png')
     * @returns true if the file exists
     */
    public async fileExists(
        contentId: ContentId,
        filename: string
    ): Promise<boolean> {
        const file = await DBH5PFile.findOneBy({
            ownerType: 'content',
            owner: contentId,
            filename: filename,
        });
        return file !== null;
    }

    /**
     * Deletes a content object and all its dependent files from the repository.
     * Throws errors if something goes wrong.
     * @param contentId The content id to delete.
     * @param user The user who wants to delete the content
     */
    public async deleteContent(
        contentId: ContentId,
        user?: IUser
    ): Promise<void> {
        if (
            user &&
            !(await this.canUserAccessContent(user.id, contentId, true))
        ) {
            throw new LoernwerkError(
                'User is not allowed to edit this content',
                LoernwerkErrorCodes.FORBIDDEN
            );
        }

        await DBH5PContent.delete({ h5pContentId: contentId });
        await DBH5PFile.delete({ ownerType: 'content', owner: contentId });
    }

    /**
     * Deletes a file from a content object.
     * @param contentId the content object the file is attached to
     * @param filename the file to delete; can be a path including
     * subdirectories (e.g. 'images/xyz.png')
     * @param user The user who wants to delete the file
     */
    public async deleteFile(
        contentId: ContentId,
        filename: string,
        user?: IUser
    ): Promise<void> {
        if (
            user &&
            !(await this.canUserAccessContent(user.id, contentId, true))
        ) {
            throw new LoernwerkError(
                'User is not allowed to edit this content',
                LoernwerkErrorCodes.FORBIDDEN
            );
        }

        await DBH5PFile.delete({
            ownerType: 'content',
            owner: contentId,
            filename: filename,
        });
    }

    /**
     * Returns information about a content file (e.g. image or video) inside a
     * piece of content.
     * @param contentId the id of the content object that the file is attached to
     * @param filename the filename of the file to get information about
     * @param user the user who wants to retrieve the content file
     * @returns FileStats of the requested file
     */
    public async getFileStats(
        contentId: ContentId,
        filename: string,
        user: IUser
    ): Promise<IFileStats> {
        if (!(await this.canUserAccessContent(user.id, contentId, true))) {
            throw new LoernwerkError(
                'User is not allowed to edit this content',
                LoernwerkErrorCodes.FORBIDDEN
            );
        }

        return await DBH5PFile.findOne({
            select: { birthtime: true, size: true },
            where: {
                ownerType: 'content',
                owner: contentId,
                filename: filename,
            },
        });
    }

    /**
     * Returns a readable stream of a content file (e.g. image or video) inside
     * a piece of content
     * @param contentId the id of the content object that the file is attached to
     * @param filename the filename of the file to get; can be a path including
     * subdirectories (e.g. 'images/xyz.png')
     * @param user the user who wants to retrieve the content file
     * @param rangeStart (optional) the position in bytes at which the stream
     * should start
     * @param rangeEnd (optional) the position in bytes at which the stream
     * should end
     * @returns the stream (that can be used to send the file to the user)
     */
    public async getFileStream(
        contentId: ContentId,
        filename: string,
        user: IUser,
        rangeStart?: number,
        rangeEnd?: number
    ): Promise<Readable> {
        const file = await DBH5PFile.findOneBy({
            ownerType: 'content',
            owner: contentId,
            filename: filename,
        });
        const buffer = Buffer.from(file.content);
        const bufferStart = rangeStart | 0;
        const bufferEnd = rangeEnd | buffer.length;
        return Readable.from(buffer.subarray(bufferStart, bufferEnd));
    }

    /**
     * Returns the content metadata (=h5p.json) for a content id
     * @param contentId the content id for which to retrieve the metadata
     * @param user (optional) the user who wants to access the metadata. If
     * undefined, access must be granted.
     * @returns the metadata
     */
    public async getMetadata(
        contentId: ContentId,
        user?: IUser
    ): Promise<IContentMetadata> {
        // Since anyone is allowed to view H5P Content, we dont need to check user permissions here
        void user;
        const content = await DBH5PContent.findOne({
            where: { h5pContentId: contentId },
        });

        // Delete null fields, otherwise saving will fail
        for (const prop of Object.keys(content)) {
            if (content[prop] === null) {
                delete content[prop];
            }
        }

        return content;
    }

    /**
     * Returns the content object (=content.json) for a content id
     * @param contentId the content id for which to retrieve the metadata
     * @param user (optional) the user who wants to access the metadata. If
     * undefined, access must be granted.
     * @returns the content object
     */
    public async getParameters(
        contentId: ContentId,
        user?: IUser
    ): Promise<ContentParameters> {
        // Since anyone is allowed to view H5P Content, we dont need to check user permissions here
        void user;
        const content = await DBH5PContent.findOneBy({
            h5pContentId: contentId,
        });
        return content?.content;
    }

    /**
     * Calculates how often a library is in use.
     * @param library the library for which to calculate usage.
     * @returns asDependency: how often the library is used as subcontent in
     * content; asMainLibrary: how often the library is used as a main library
     */
    public async getUsage(
        library: ILibraryName
    ): Promise<{ asDependency: number; asMainLibrary: number }> {
        let asDependency = 0;
        let asMainLibrary = 0;

        const contentIds = await this.listContent();

        for (const contentId of contentIds) {
            const contentMetadata = await this.getMetadata(contentId);
            const isMainLibrary =
                contentMetadata.mainLibrary === library.machineName;
            if (
                contentMetadata.preloadedDependencies?.some((dep) =>
                    LibraryName.equal(dep, library)
                ) ||
                contentMetadata.editorDependencies?.some((dep) =>
                    LibraryName.equal(dep, library)
                ) ||
                contentMetadata.dynamicDependencies?.some((dep) =>
                    LibraryName.equal(dep, library)
                )
            ) {
                if (isMainLibrary) {
                    asMainLibrary += 1;
                } else {
                    asDependency += 1;
                }
            }
        }

        return { asDependency, asMainLibrary };
    }

    /**
     * Returns an array of permissions that the user has on the piece of content
     * @param contentId the content id to check
     * @param user the user who wants to access the piece of content
     * @returns the permissions the user has for this content (e.g. download it,
     * delete it etc.)
     */
    public async getUserPermissions(
        contentId: ContentId,
        user: IUser
    ): Promise<Permission[]> {
        const allowedPermissions = [Permission.View];

        const content = await DBH5PContent.findOne({
            where: { h5pContentId: contentId },
            select: { ownerSequence: true },
        });
        if (!content || content.ownerSequence === null) {
            return allowedPermissions;
        }
        const dbUser = await DBUser.findOneByOrFail({ id: parseInt(user.id) });
        if (dbUser.type === UserClass.ADMIN) {
            allowedPermissions.push(
                Permission.Edit,
                Permission.Delete,
                Permission.List
            );
        }

        const sequence = await DBSequence.findOneByOrFail({
            code: content.ownerSequence,
        });
        if (
            sequence.authorId === dbUser.id ||
            sequence.readAccess.includes(dbUser.id) ||
            sequence.writeAccess.includes(dbUser.id)
        ) {
            allowedPermissions.push(
                Permission.Edit,
                Permission.Delete,
                Permission.List
            );
        }

        return allowedPermissions;
    }

    /**
     * Lists the content objects in the system (if no user is specified) or
     * owned by the user.
     * @param user (optional) the user who owns the content
     * @returns a list of contentIds
     */
    public async listContent(user?: IUser): Promise<ContentId[]> {
        // Since content isn't owned by individual users here, all we can check is content used by sequences owned by a single user
        if (user) {
            const sequences = await DBSequence.find({
                where: { authorId: parseInt(user.id) },
                select: { code: true },
            });
            const sequenceCodes = sequences.map((sequence) => sequence.code);
            const ids = await DBH5PContent.find({
                where: { ownerSequence: In(sequenceCodes) },
                select: { h5pContentId: true },
            });
            return ids.map((content) => content.h5pContentId);
        } else {
            const ids = await DBH5PContent.find({
                select: { h5pContentId: true },
            });
            return ids.map((content) => content.h5pContentId);
        }
    }

    /**
     * Gets the filenames of files added to the content with addFile(...) (e.g.
     * images, videos or other files)
     * @param contentId the piece of content
     * @param user the user who wants to access the piece of content
     * @returns a list of files that are used in the piece of content, e.g.
     * ['images/image1.png', 'videos/video2.mp4', 'file.xyz']
     */
    public async listFiles(
        contentId: ContentId,
        user: IUser
    ): Promise<string[]> {
        // Since all users are allowed to view H5P, I dont think access control is needed here
        void user;
        const files = await DBH5PFile.find({
            select: { filename: true },
            where: { ownerType: 'content', owner: contentId },
        });
        return files.map((file) => file.filename);
    }

    /**
     * Checks whether a user can access specific H5P content, by checking the owner/read-write-permissions/admin privileges.
     * @param userId User id to check
     * @param contentId Content id to check
     * @param adminAllowed Whether admin privilages are also allowed
     * @returns true, if the user specified by the user id is allowed to access this content
     * @private
     */
    private async canUserAccessContent(
        userId: string,
        contentId: string,
        adminAllowed?: boolean
    ): Promise<boolean> {
        const content = await DBH5PContent.findOne({
            where: { h5pContentId: contentId },
            select: { ownerSequence: true },
        });
        if (!content || content.ownerSequence === null) {
            return true;
        }
        const user = await DBUser.findOneByOrFail({ id: parseInt(userId) });
        if (adminAllowed && user.type === UserClass.ADMIN) {
            return true;
        }

        const sequence = await DBSequence.findOneByOrFail({
            code: content.ownerSequence,
        });
        return (
            sequence.readAccess.includes(user.id) ||
            sequence.writeAccess.includes(user.id) ||
            sequence.authorId === user.id
        );
    }
}
