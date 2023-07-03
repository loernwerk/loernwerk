import {
    ContentId,
    ContentParameters,
    IContentMetadata,
    IContentStorage,
    IFileStats,
    ILibraryName,
    IUser,
    Permission,
} from '@lumieducation/h5p-server';
import { Readable, Stream } from 'stream';
import { DBH5PFile } from '../../model/h5p/DBH5PFile';
import { DBH5PContent } from '../../model/h5p/DBH5PContent';

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
    async addContent(
        metadata: IContentMetadata,
        content: unknown,
        user: IUser,
        contentId?: ContentId
    ): Promise<ContentId> {
        // TODO: Access control?
        void user;
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
    async addFile(
        contentId: ContentId,
        filename: string,
        readStream: Stream,
        user?: IUser
    ): Promise<void> {
        // TODO: Access control?
        void user;
        const dbFile = new DBH5PFile();
        dbFile.filename = filename;
        dbFile.ownerType = 'content';
        dbFile.owner = contentId;
        dbFile.content = await this.streamToString(readStream);
        dbFile.size = dbFile.content.length;
        await dbFile.save();
    }

    /**
     * Checks if a piece of content exists in storage.
     * @param contentId the content id to check
     * @returns true if the piece of content exists
     */
    async contentExists(contentId: ContentId): Promise<boolean> {
        const content = await DBH5PContent.findOneBy({
            h5pContentId: contentId,
        });
        return content !== null;
    }

    /**
     * Deletes a content object and all its dependent files from the repository.
     * Throws errors if something goes wrong.
     * @param contentId The content id to delete.
     * @param user The user who wants to delete the content
     */
    async deleteContent(contentId: ContentId, user?: IUser): Promise<void> {
        // TODO: Access control?
        void user;
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
    async deleteFile(
        contentId: ContentId,
        filename: string,
        user?: IUser
    ): Promise<void> {
        // TODO: Access control?
        void user;
        await DBH5PFile.delete({
            ownerType: 'content',
            owner: contentId,
            filename: filename,
        });
    }

    /**
     * Checks if a file exists.
     * @param contentId The id of the content to add the file to
     * @param filename the filename of the file to get; can be a path including
     * subdirectories (e.g. 'images/xyz.png')
     * @returns true if the file exists
     */
    async fileExists(contentId: ContentId, filename: string): Promise<boolean> {
        const file = await DBH5PFile.findOneBy({
            ownerType: 'content',
            owner: contentId,
            filename: filename,
        });
        return file !== null;
    }

    /**
     * Returns information about a content file (e.g. image or video) inside a
     * piece of content.
     * @param contentId the id of the content object that the file is attached to
     * @param filename the filename of the file to get information about
     * @param user the user who wants to retrieve the content file
     * @returns FileStats of the requested file
     */
    async getFileStats(
        contentId: ContentId,
        filename: string,
        user: IUser
    ): Promise<IFileStats> {
        // TODO: Access control?
        void user;
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
    async getFileStream(
        contentId: ContentId,
        filename: string,
        user: IUser,
        rangeStart?: number,
        rangeEnd?: number
    ): Promise<Readable> {
        // TODO: Access control?
        void user;
        const file = await DBH5PFile.findOneBy({
            ownerType: 'content',
            owner: contentId,
            filename: filename,
        });
        let read: Readable;
        if (rangeStart !== undefined && rangeEnd !== undefined) {
            read = Readable.from(file.content.substring(rangeStart, rangeEnd));
        } else if (rangeStart !== undefined) {
            read = Readable.from(file.content.substring(rangeStart));
        } else if (rangeEnd !== undefined) {
            read = Readable.from(file.content.substring(0, rangeEnd));
        } else {
            read = Readable.from(file.content);
        }
        return read;
    }

    /**
     * Returns the content metadata (=h5p.json) for a content id
     * @param contentId the content id for which to retrieve the metadata
     * @param user (optional) the user who wants to access the metadata. If
     * undefined, access must be granted.
     * @returns the metadata
     */
    async getMetadata(
        contentId: ContentId,
        user?: IUser
    ): Promise<IContentMetadata> {
        // TODO: Access control?
        void user;
        const content = await DBH5PContent.findOneBy({
            h5pContentId: contentId,
        });
        return content;
    }

    /**
     * Returns the content object (=content.json) for a content id
     * @param contentId the content id for which to retrieve the metadata
     * @param user (optional) the user who wants to access the metadata. If
     * undefined, access must be granted.
     * @returns the content object
     */
    async getParameters(
        contentId: ContentId,
        user?: IUser
    ): Promise<ContentParameters> {
        // TODO: Access control?
        void user;
        const content = await DBH5PContent.findOneBy({
            h5pContentId: contentId,
        });
        return content.content;
    }

    /**
     * Calculates how often a library is in use.
     * @param library the library for which to calculate usage.
     * @returns asDependency: how often the library is used as subcontent in
     * content; asMainLibrary: how often the library is used as a main library
     */
    async getUsage(
        library: ILibraryName
    ): Promise<{ asDependency: number; asMainLibrary: number }> {
        // What am I supposed to do here
        void library;
        return Promise.resolve({ asDependency: 0, asMainLibrary: 0 });
    }

    /**
     * Returns an array of permissions that the user has on the piece of content
     * @param contentId the content id to check
     * @param user the user who wants to access the piece of content
     * @returns the permissions the user has for this content (e.g. download it,
     * delete it etc.)
     */
    async getUserPermissions(
        contentId: ContentId,
        user: IUser
    ): Promise<Permission[]> {
        // TODO
        void user;
        return [
            Permission.Edit,
            Permission.Delete,
            Permission.List,
            Permission.Embed,
            Permission.View,
            Permission.Download,
        ];
    }

    /**
     * Lists the content objects in the system (if no user is specified) or
     * owned by the user.
     * @param user (optional) the user who owns the content
     * @returns a list of contentIds
     */
    async listContent(user?: IUser): Promise<ContentId[]> {
        // TODO: Access control
        void user;
        const ids = await DBH5PContent.find({ select: { h5pContentId: true } });
        return ids.map((content) => content.h5pContentId);
    }

    /**
     * Gets the filenames of files added to the content with addFile(...) (e.g.
     * images, videos or other files)
     * @param contentId the piece of content
     * @param user the user who wants to access the piece of content
     * @returns a list of files that are used in the piece of content, e.g.
     * ['images/image1.png', 'videos/video2.mp4', 'file.xyz']
     */
    async listFiles(contentId: ContentId, user: IUser): Promise<string[]> {
        // TODO: Access control
        void user;
        const files = await DBH5PFile.find({
            select: { filename: true },
            where: { ownerType: 'content', owner: contentId },
        });
        return files.map((file) => file.filename);
    }

    /**
     * Turns a readable stream into a string.
     * @param read Stream to read from
     * @returns String built from the stream
     * @private
     */
    private async streamToString(read: Stream): Promise<string> {
        const chunks: Buffer[] = [];
        return new Promise((resolve, reject) => {
            read.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            read.on('error', (err) => reject(err));
            read.on('end', () =>
                resolve(Buffer.concat(chunks).toString('utf8'))
            );
        });
    }
}
