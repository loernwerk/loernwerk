import { H5PConfig, H5PEditor, H5PPlayer } from '@lumieducation/h5p-server';
import { H5PContentStorage } from './H5PContentStorage';
import { H5PLibraryStorage } from './H5PLibraryStorage';
import {
    LoernwerkError,
    LoernwerkErrorCodes,
} from '../../model/loernwerkError';
import DirectoryTemporaryFileStorage from '@lumieducation/h5p-server/build/src/implementation/fs/DirectoryTemporaryFileStorage';
import CachedKeyValueStorage from '@lumieducation/h5p-server/build/src/implementation/cache/CachedKeyValueStorage';
import axios from 'axios';
import { access } from 'fs/promises';
import decompress from 'decompress';
import { H5PPermissionSystem } from './H5PPermissionSystem';

const DIRECTORY_EDITOR = 'h5p/editor';
const DIRECTORY_CORE = 'h5p/core';
const DOWNLOAD_LINK_EDITOR =
    'https://github.com/h5p/h5p-editor-php-library/archive/1.24.1.zip';
const DOWNLOAD_LINK_CORE =
    'https://github.com/h5p/h5p-php-library/archive/1.24.0.zip';

/**
 * Class for managing the H5P integration.
 */
export class H5PServer {
    private static instance: H5PServer | null = null;

    private editor: H5PEditor | null;
    private player: H5PPlayer | null;
    private readonly contentStore: H5PContentStorage;
    private readonly libraryStore: H5PLibraryStorage;
    private readonly permissionSystem: H5PPermissionSystem;

    /**
     * Creates a new instance of the H5PServer
     * @private
     */
    private constructor() {
        this.contentStore = new H5PContentStorage();
        this.libraryStore = new H5PLibraryStorage();
        this.permissionSystem = new H5PPermissionSystem();
        this.editor = null;
        this.player = null;
    }

    /**
     * Returns the current instance of the H5PServer, or creates one, if none exists.
     * @returns current instance of the H5PServer
     */
    public static getInstance(): H5PServer {
        if (this.instance === null) {
            this.instance = new H5PServer();
        }
        return this.instance as H5PServer;
    }

    /**
     * Initializes the H5PServer.
     */
    public async initialize(): Promise<void> {
        const config = await new H5PConfig().load();
        config.baseUrl = this.getPublicURL();

        this.editor = new H5PEditor(
            new CachedKeyValueStorage('kvcache'),
            config,
            this.libraryStore,
            this.contentStore,
            new DirectoryTemporaryFileStorage('h5p/tmp'),
            undefined,
            undefined,
            {
                permissionSystem: this.permissionSystem,
            }
        );

        this.player = new H5PPlayer(
            this.libraryStore,
            this.contentStore,
            config,
            undefined,
            undefined,
            undefined,
            {
                permissionSystem: this.permissionSystem,
            }
        );

        // Clean up temporary files every 5 minutes, as suggested by h5p library
        setInterval(() => {
            this.editor?.temporaryFileManager.cleanUp();
        }, 1000 * 60 * 5);

        // Update content types every 12 hours, as suggested by h5p library
        setInterval(() => {
            this.editor?.contentTypeCache.updateIfNecessary();
        }, 1000 * 60 * 60 * 12);

        this.editor.setRenderer((model) => model);
        this.player.setRenderer((model) => model);
    }

    /**
     * Automatically downloads the required H5P libraries to local disk.
     */
    public async downloadServerFiles(): Promise<void> {
        // Check if the folders exist already
        if (
            (await this.directoryExists(DIRECTORY_EDITOR)) &&
            (await this.directoryExists(DIRECTORY_CORE))
        ) {
            return;
        }
        console.log(
            'Downloading required H5P libraries, this might take a few seconds'
        );

        console.log('Downloading core files');
        const coreFiles = await axios.get(DOWNLOAD_LINK_CORE, {
            responseType: 'arraybuffer',
        });
        console.log('Downloading editor files');
        const editorFiles = await axios.get(DOWNLOAD_LINK_EDITOR, {
            responseType: 'arraybuffer',
        });
        console.log('Unpacking core files');
        await this.unzipFile(coreFiles.data, DIRECTORY_CORE);
        console.log('Unpacking editor files');
        await this.unzipFile(editorFiles.data, DIRECTORY_EDITOR);
        console.log('Done!');
    }

    /**
     * Returns the current H5PEditor. Throws an error, if the server hasn't been initialized yet.
     * @returns the current H5PEditor.
     */
    public getH5PEditor(): H5PEditor {
        if (this.editor === null) {
            throw new LoernwerkError(
                'H5PServer not initialized',
                LoernwerkErrorCodes.UNINITIALIZED
            );
        }
        return this.editor as H5PEditor;
    }

    /**
     * Returns the current H5PPlayer. Throws an error, if the server hasn't been initialized yet.
     * @returns the current H5PPlayer.
     */
    public getH5PPlayer(): H5PPlayer {
        if (this.player === null) {
            throw new LoernwerkError(
                'H5PServer not initialized',
                LoernwerkErrorCodes.UNINITIALIZED
            );
        }
        return this.player as H5PPlayer;
    }

    /**
     * Unzip a zipfile to a destination folder.
     * @param zipFile Zipfile buffer to unzip
     * @param destinationFolder Destination folder
     * @private
     */
    private async unzipFile(
        zipFile: Buffer,
        destinationFolder: string
    ): Promise<void> {
        await decompress(zipFile, destinationFolder, {
            map: (file) => {
                if (file.path.startsWith('h5p-php-library-1.24.0')) {
                    file.path = file.path.substring(23);
                }
                if (file.path.startsWith('h5p-editor-php-library-1.24.1')) {
                    file.path = file.path.substring(30);
                }
                return file;
            },
        });
    }

    /**
     * Tries to access a directory in order to figure out if it exists.
     * @param directory The directory to check
     * @private
     * @returns true, if the directory exists, false otherwise
     */
    private async directoryExists(directory: string): Promise<boolean> {
        // Every `exists` method is deprecated, so we have to do this
        try {
            await access(directory);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Returns the public url of the platform
     * @private
     * @returns public url of the platform
     */
    private getPublicURL(): string {
        // By default, use http
        let protocol = 'http';
        let port = process.env.PORT || '5000';

        // If SSL is enabled, try to use that
        if (
            process.env.DISABLE_HTTP !== undefined ||
            (process.env.SSL_KEYFILE !== undefined &&
                process.env.SSL_CERTFILE !== undefined)
        ) {
            protocol = 'https';
            port = process.env.SSL_PORT || '5443';
        }

        let url = new URL(
            protocol +
                '://' +
                (process.env.HOSTNAME || 'localhost') +
                ':' +
                port
        );

        // If the override url is set, use that
        if (process.env.PUBLIC_URL !== undefined) {
            url = new URL(process.env.PUBLIC_URL);
        }

        return url.origin + '/h5p';
    }
}
