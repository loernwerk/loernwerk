import {
    ContentId,
    ContentParameters,
    IContentMetadata,
    IContentStorage,
    IFileStats,
    ILibraryName,
    LibraryName,
} from '@lumieducation/h5p-server';
import { Readable } from 'stream';
import { DBH5PFile } from '../../model/h5p/DBH5PFile';
import { DBH5PContent } from '../../model/h5p/DBH5PContent';
import { H5PUser } from './H5PPermissionSystem';

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
        user: H5PUser,
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
        dbContent.owner = user.userId;
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
     */
    public async addFile(
        contentId: ContentId,
        filename: string,
        readStream: Readable
    ): Promise<void> {
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
     */
    public async deleteContent(contentId: ContentId): Promise<void> {
        await DBH5PContent.delete({ h5pContentId: contentId });
        await DBH5PFile.delete({ ownerType: 'content', owner: contentId });
    }

    /**
     * Deletes a file from a content object.
     * @param contentId the content object the file is attached to
     * @param filename the file to delete; can be a path including
     * subdirectories (e.g. 'images/xyz.png')
     */
    public async deleteFile(
        contentId: ContentId,
        filename: string
    ): Promise<void> {
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
     * @returns FileStats of the requested file
     */
    public async getFileStats(
        contentId: ContentId,
        filename: string
    ): Promise<IFileStats> {
        return await DBH5PFile.findOneOrFail({
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
        user: H5PUser,
        rangeStart?: number,
        rangeEnd?: number
    ): Promise<Readable> {
        const file = await DBH5PFile.findOneByOrFail({
            ownerType: 'content',
            owner: contentId,
            filename: filename,
        });
        const buffer = Buffer.from(file.content);
        const bufferStart = rangeStart || 0;
        const bufferEnd = rangeEnd || buffer.length;
        return Readable.from(buffer.subarray(bufferStart, bufferEnd));
    }

    /**
     * Returns the content metadata (=h5p.json) for a content id
     * @param contentId the content id for which to retrieve the metadata
     * @returns the metadata
     */
    public async getMetadata(contentId: ContentId): Promise<IContentMetadata> {
        const content = await DBH5PContent.findOneOrFail({
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
     * @returns the content object
     */
    public async getParameters(
        contentId: ContentId
    ): Promise<ContentParameters> {
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
     * Lists the content objects in the system (if no user is specified) or
     * owned by the user.
     * @param user (optional) the user who owns the content
     * @returns a list of contentIds
     */
    public async listContent(user?: H5PUser): Promise<ContentId[]> {
        if (user) {
            const ids = await DBH5PContent.find({
                where: { owner: user.userId },
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
     * @returns a list of files that are used in the piece of content, e.g.
     * ['images/image1.png', 'videos/video2.mp4', 'file.xyz']
     */
    public async listFiles(contentId: ContentId): Promise<string[]> {
        const files = await DBH5PFile.find({
            select: { filename: true },
            where: { ownerType: 'content', owner: contentId },
        });
        return files.map((file) => file.filename);
    }
}
