import {
    IAdditionalLibraryMetadata,
    IFileStats,
    IInstalledLibrary,
    ILibraryMetadata,
    ILibraryName,
    ILibraryStorage,
    LibraryName,
} from '@lumieducation/h5p-server';
import { Readable } from 'stream';
import { DBH5PFile } from '../../model/h5p/DBH5PFile';
import { DBH5PLibrary } from '../../model/h5p/DBH5PLibrary';
import { extname, basename } from 'node:path';
import { Not } from 'typeorm';

/**
 * Custom H5P Library storage implementation to use the SQL database.
 */
export class H5PLibraryStorage implements ILibraryStorage {
    /**
     * Adds a library file to a library. The library metadata must have been
     * installed with addLibrary(...) first. Throws an error if something
     * unexpected happens. In this case the method calling addFile(...) will
     * clean up the partly installed library.
     * @param library The library that is being installed
     * @param filename Filename of the file to add, relative to the library root
     * @param readStream The stream containing the file content
     * @returns true if successful
     */
    async addFile(
        library: ILibraryName,
        filename: string,
        readStream: Readable
    ): Promise<boolean> {
        // Converting the readable to a string
        const chunks = [];
        for await (const chunk of readStream) {
            chunks.push(chunk);
        }
        const fileBuffer = Buffer.concat(chunks);
        const dbFile = new DBH5PFile();
        dbFile.ownerType = 'library';
        dbFile.owner = DBH5PLibrary.formatNameAsString(library);
        dbFile.filename = filename;
        dbFile.content = fileBuffer.toString('utf-8');
        dbFile.size = fileBuffer.length;
        await dbFile.save();
        return true;
    }

    /**
     * Adds the metadata of the library to the repository and assigns a new id
     * to the installed library. This dea is used later when the library must be
     * referenced somewhere. Throws errors if something goes wrong.
     * @param libraryData The library metadata object (= content of
     * library.json)
     * @param restricted True if the library can only be used be users allowed
     * to install restricted libraries.
     * @returns The newly created library object to use when adding library
     * files with addFile(...)
     */
    async addLibrary(
        libraryData: ILibraryMetadata,
        restricted: boolean
    ): Promise<IInstalledLibrary> {
        const dbLib = new DBH5PLibrary();
        Object.assign(dbLib, libraryData);
        dbLib.restricted = restricted;
        await dbLib.save();
        return dbLib;
    }

    /**
     * Removes all files of a library. Doesn't delete the library metadata.
     * (Used when updating libraries.)
     * @param library the library whose files should be deleted
     */
    async clearFiles(library: ILibraryName): Promise<void> {
        await DBH5PFile.delete({
            ownerType: 'library',
            owner: DBH5PLibrary.formatNameAsString(library),
        });
    }

    /**
     * Removes the library and all its files from the repository.
     * Throws errors if something went wrong.
     * @param library The library to remove.
     */
    async deleteLibrary(library: ILibraryName): Promise<void> {
        await DBH5PLibrary.delete({
            machineName: library.machineName,
            majorVersion: library.majorVersion,
            minorVersion: library.minorVersion,
        });
        await DBH5PFile.delete({
            ownerType: 'library',
            owner: DBH5PLibrary.formatNameAsString(library),
        });
    }

    /**
     * Check if the library contains a file.
     * @param library The library to check
     * @param filename Filename to check
     * @returns true if file exists in library, false otherwise
     */
    async fileExists(
        library: ILibraryName,
        filename: string
    ): Promise<boolean> {
        const file = await DBH5PFile.findOne({
            where: {
                ownerType: 'library',
                owner: DBH5PLibrary.formatNameAsString(library),
                filename: filename,
            },
            select: {
                filename: true,
                owner: true,
                ownerType: true,
            },
        });
        return file !== null;
    }

    /**
     * Counts how often libraries are listed in the dependencies of other
     * libraries and returns a list of the number.
     *
     * Note: Implementations should not count circular dependencies that are
     * caused by editorDependencies. Example: H5P.InteractiveVideo has
     * H5PEditor.InteractiveVideo in its editor dependencies.
     * H5PEditor.Interactive video has H5P.InteractiveVideo in its preloaded
     * dependencies. In this case H5P.InteractiveVideo should get a dependency
     * count of 0 and H5PEditor.InteractiveVideo should have 1. That way it is
     * still possible to delete the library from storage.
     *
     * @returns an object with ubernames as key.
     * Example:
     * {
     *   'H5P.Example': 10
     * }
     * This means that H5P.Example is used by 10 other libraries.
     */
    async getAllDependentsCount(): Promise<{ [p: string]: number }> {
        const librariesNames = await this.getInstalledLibraryNames();
        const librariesMetadata = await Promise.all(
            librariesNames.map((lib) => this.getLibrary(lib))
        );

        // the metadata map allows faster access to libraries by ubername
        const librariesMetadataMap: {
            [ubername: string]: IInstalledLibrary;
        } = librariesMetadata.reduce((prev, curr) => {
            prev[LibraryName.toUberName(curr)] = curr;
            return prev;
        }, {});

        // Remove circular dependencies caused by editor dependencies in content types.
        for (const libraryMetadata of librariesMetadata) {
            for (const dependency of libraryMetadata.editorDependencies ?? []) {
                const ubername = LibraryName.toUberName(dependency);
                const index = librariesMetadataMap[
                    ubername
                ]?.preloadedDependencies?.findIndex((ln) =>
                    LibraryName.equal(ln, libraryMetadata)
                );
                if (index >= 0) {
                    librariesMetadataMap[ubername].preloadedDependencies.splice(
                        index,
                        1
                    );
                }
            }
        }

        // Count dependencies
        const dependencies = {};
        for (const libraryMetadata of librariesMetadata) {
            for (const dependency of (
                libraryMetadata.preloadedDependencies ?? []
            )
                .concat(libraryMetadata.editorDependencies ?? [])
                .concat(libraryMetadata.dynamicDependencies ?? [])) {
                const ubername = LibraryName.toUberName(dependency);
                dependencies[ubername] = (dependencies[ubername] ?? 0) + 1;
            }
        }

        return dependencies;
    }

    /**
     * Returns the number of libraries that depend on this (single) library.
     * @param library the library to check
     * @returns the number of libraries that depend on this library.
     */
    async getDependentsCount(library: ILibraryName): Promise<number> {
        const allDependencies = await this.getAllDependentsCount();
        return allDependencies[LibraryName.toUberName(library)] ?? 0;
    }

    /**
     * Returns a JSON object of a library file's contents.
     * Throws an exception if the file does not exist.
     * @param library library
     * @param filename the relative path inside the library
     * @returns a JSON object of the file's contents
     */
    async getFileAsJson(
        library: ILibraryName,
        filename: string
    ): Promise<unknown> {
        const file = await DBH5PFile.findOneBy({
            ownerType: 'library',
            owner: DBH5PLibrary.formatNameAsString(library),
            filename: filename,
        });
        return JSON.parse(file.content);
    }

    /**
     * Returns a string of a library file's contents.
     * Throws an exception if the file does not exist.
     * @param library library
     * @param filename the relative path inside the library
     * @returns a string of the file's contents
     */
    async getFileAsString(
        library: ILibraryName,
        filename: string
    ): Promise<string> {
        const file = await DBH5PFile.findOneByOrFail({
            ownerType: 'library',
            owner: DBH5PLibrary.formatNameAsString(library),
            filename: filename,
        });
        return file.content;
    }

    /**
     * Returns a information about a library file.
     * Throws an exception if the file does not exist.
     * @param library library
     * @param filename the relative path inside the library
     * @returns the file stats
     */
    async getFileStats(
        library: ILibraryName,
        filename: string
    ): Promise<IFileStats> {
        const file = await DBH5PFile.findOneByOrFail({
            ownerType: 'library',
            owner: DBH5PLibrary.formatNameAsString(library),
            filename: filename,
        });
        return {
            birthtime: file.birthtime,
            size: file.size,
        };
    }

    /**
     * Returns a readable stream of a library file's contents.
     * Throws an exception if the file does not exist.
     * @param library library
     * @param filename the relative path inside the library
     * @returns a readable stream of the file's contents
     */
    async getFileStream(
        library: ILibraryName,
        filename: string
    ): Promise<Readable> {
        const file = await DBH5PFile.findOneByOrFail({
            ownerType: 'library',
            owner: DBH5PLibrary.formatNameAsString(library),
            filename: filename,
        });
        return Readable.from(file.content);
    }

    /**
     * Returns all installed libraries or the installed libraries that have the
     * machine name.
     * @param machineName (optional) only return libraries that have this
     * machine name
     * @returns the libraries installed
     */
    async getInstalledLibraryNames(
        machineName?: string
    ): Promise<ILibraryName[]> {
        if (machineName !== undefined) {
            return await DBH5PLibrary.find({
                where: { machineName: machineName },
            });
        } else {
            return await DBH5PLibrary.find({});
        }
    }

    /**
     * Gets a list of installed language files for the library.
     * @param library The library to get the languages for
     * @returns The list of JSON files in the language folder (without the
     * extension .json)
     */
    async getLanguages(library: ILibraryName): Promise<string[]> {
        const allFiles = await DBH5PFile.find({
            select: { filename: true },
            where: {
                ownerType: 'library',
                owner: DBH5PLibrary.formatNameAsString(library),
            },
        });
        return allFiles
            .map((file) => file.filename)
            .filter((file) => file.startsWith('language'))
            .filter((file) => extname(file) === '.json')
            .map((file) => basename(file, '.json'));
    }

    /**
     * Gets the information about an installed library
     * @param library the library
     * @returns the metadata and information about the locally installed library
     */
    async getLibrary(library: ILibraryName): Promise<IInstalledLibrary> {
        return await DBH5PLibrary.findOneBy({
            machineName: library.machineName,
            majorVersion: library.majorVersion,
            minorVersion: library.minorVersion,
        });
    }

    /**
     * Checks if a library is installed.
     * @param library the library to check
     * @returns true if the library is installed
     */
    async isInstalled(library: ILibraryName): Promise<boolean> {
        const dbLib = await DBH5PLibrary.findOne({
            where: {
                machineName: library.machineName,
                majorVersion: library.majorVersion,
                minorVersion: library.minorVersion,
            },
            select: {
                machineName: true,
                majorVersion: true,
                minorVersion: true,
            },
        });
        return dbLib !== null;
    }

    /**
     * Returns a list of library addons that are installed in the system.
     * Addons are libraries that have the property 'addTo' in their metadata.
     * ILibraryStorage implementation CAN but NEED NOT implement the method.
     * If it is not implemented, addons won't be available in the system.
     * @returns a list of library addons
     */
    async listAddons(): Promise<ILibraryMetadata[]> {
        return await DBH5PLibrary.findBy({ addTo: Not(null) });
    }

    /**
     * Gets a list of all library files that exist for this library.
     * @param library Library to list files for
     * @returns all files that exist for the library
     */
    async listFiles(library: ILibraryName): Promise<string[]> {
        const files = await DBH5PFile.findBy({
            ownerType: 'library',
            owner: DBH5PLibrary.formatNameAsString(library),
        });
        return files.map((file) => file.filename);
    }

    /**
     * Updates the additional metadata properties that is added to the
     * stored libraries. This metadata can be used to customize behavior like
     * restricting libraries to specific users.
     *
     * Implementations should avoid updating the metadata if the additional
     * metadata if nothing has changed.
     * @param library the library for which the metadata should be updated
     * @param additionalMetadata the metadata to update
     * @returns true if the additionalMetadata object contained real changes
     * and if they were successfully saved; false if there were not changes.
     * Throws an error if saving was not possible.
     */
    async updateAdditionalMetadata(
        library: ILibraryName,
        additionalMetadata: Partial<IAdditionalLibraryMetadata>
    ): Promise<boolean> {
        const dbLib = await DBH5PLibrary.findOneByOrFail({
            machineName: library.machineName,
            majorVersion: library.majorVersion,
            minorVersion: library.minorVersion,
        });

        let changes = false;
        for (const property of Object.keys(additionalMetadata)) {
            if (additionalMetadata[property] !== dbLib[property]) {
                dbLib[property] = additionalMetadata[property];
                changes = true;
            }
        }

        if (changes) {
            await dbLib.save();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Updates the library metadata. This is necessary when updating to a new
     * patch version. After this clearFiles(...) is called by the LibraryManager
     * to remove all old files. The next step is to add the patched files with
     * addFile(...).
     * @param libraryMetadata the new library metadata
     * @returns The updated library object
     */
    async updateLibrary(
        libraryMetadata: ILibraryMetadata
    ): Promise<IInstalledLibrary> {
        const dbLib = await DBH5PLibrary.findOneByOrFail({
            machineName: libraryMetadata.machineName,
            majorVersion: libraryMetadata.majorVersion,
            minorVersion: libraryMetadata.minorVersion,
        });

        Object.assign(dbLib, libraryMetadata);

        await dbLib.save();
        return dbLib;
    }
}
