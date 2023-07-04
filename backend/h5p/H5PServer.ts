import {
    fsImplementations,
    H5PConfig,
    H5PEditor,
    H5PPlayer,
} from '@lumieducation/h5p-server';
import { H5PContentStorage } from './H5PContentStorage';
import { H5PLibraryStorage } from './H5PLibraryStorage';
import { LoernwerkError, LoernwerkErrorCodes } from '../loernwerkUtilities';
import { resolve } from 'node:path';
import DirectoryTemporaryFileStorage from '@lumieducation/h5p-server/build/src/implementation/fs/DirectoryTemporaryFileStorage';
import CachedKeyValueStorage from '@lumieducation/h5p-server/build/src/implementation/cache/CachedKeyValueStorage';

/**
 * Class for managing the H5P integration.
 */
export class H5PServer {
    private static instance: H5PServer | null = null;

    private editor: H5PEditor | null;
    private player: H5PPlayer | null;
    private readonly contentStore: H5PContentStorage;
    private readonly libraryStore: H5PLibraryStorage;

    /**
     * Creates a new instance of the H5PServer
     * @private
     */
    private constructor() {
        this.contentStore = new H5PContentStorage();
        this.libraryStore = new H5PLibraryStorage();
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
        const config = await new H5PConfig(
            new fsImplementations.JsonStorage(resolve('h5p/config.json'))
        ).load();

        this.editor = new H5PEditor(
            new CachedKeyValueStorage('kvcache'),
            config,
            this.libraryStore,
            this.contentStore,
            new DirectoryTemporaryFileStorage('h5p/tmp')
        );

        this.player = new H5PPlayer(
            this.libraryStore,
            this.contentStore,
            config
        );

        this.editor.setRenderer((model) => model);
        this.player.setRenderer((model) => model);
    }

    /**
     * Automatically downloads the required H5P libraries to local disk.
     */
    public async downloadServerFiles(): Promise<void> {
        // TODO: Automatically download required server files
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
}
