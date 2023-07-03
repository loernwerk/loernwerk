import { BaseEntity, Column, PrimaryColumn } from 'typeorm';
import { IInstalledLibrary, ILibraryName } from '@lumieducation/h5p-server';

/**
 * Database object containing information about a single installed H5P library.
 */
export class DBH5PLibrary extends BaseEntity implements IInstalledLibrary {
    @Column({ type: 'simple-json', nullable: true })
    addTo?: {
        content?: { types?: { text?: { regex?: string } }[] };
        editor?: { machineNames: string[] };
        player?: { machineNames: string[] };
    };

    @Column({ nullable: true })
    author?: string;

    @Column({ type: 'simple-json', nullable: true })
    coreApi?: { majorVersion: number; minorVersion: number };

    @Column({ nullable: true })
    description?: string;

    @Column({ type: 'simple-json', nullable: true })
    dropLibraryCss?: { machineName: string }[];

    @Column({ type: 'simple-json', nullable: true })
    dynamicDependencies?: ILibraryName[];

    @Column({ type: 'simple-json', nullable: true })
    editorDependencies?: ILibraryName[];

    @Column({ type: 'simple-json', nullable: true })
    embedTypes?: ('iframe' | 'div')[];

    @Column({ nullable: true })
    fullscreen?: 0 | 1;

    @Column({ nullable: true })
    h?: number;

    @Column({ nullable: true })
    license?: string;

    @PrimaryColumn()
    machineName: string;

    @PrimaryColumn()
    majorVersion: number;

    @Column({ type: 'simple-json', nullable: true })
    metadataSettings?: { disable: 0 | 1; disableExtraTitleField: 0 | 1 };

    @PrimaryColumn()
    minorVersion: number;

    @Column()
    patchVersion: number;

    @Column({ type: 'simple-json', nullable: true })
    preloadedCss?: { path: string }[];

    @Column({ type: 'simple-json', nullable: true })
    preloadedDependencies?: ILibraryName[];

    @Column({ type: 'simple-json', nullable: true })
    preloadedJs?: { path: string }[];

    @Column({ type: 'simple-json', nullable: true })
    requiredExtensions?: { sharedState: number };

    @Column()
    restricted: boolean;

    @Column({ type: 'simple-json' })
    runnable: boolean | 0 | 1;

    @Column({ type: 'simple-json', nullable: true })
    state?: {
        snapshotSchema: boolean;
        opSchema: boolean;
        snapshotLogicChecks: boolean;
        opLogicChecks: boolean;
    };

    @Column()
    title: string;

    @Column({ nullable: true })
    w?: number;

    /**
     * Compares this library to another library based on title, major version and minor version
     * @param otherLibrary Library to compare to
     * @returns Comparison result
     */
    compare(otherLibrary: IInstalledLibrary): number {
        if (this.title.localeCompare(otherLibrary.title) !== 0) {
            return this.title.localeCompare(otherLibrary.title);
        }
        if (this.majorVersion - otherLibrary.majorVersion !== 0) {
            return this.majorVersion - otherLibrary.majorVersion;
        }
        return this.minorVersion - otherLibrary.majorVersion;
    }

    /**
     * Compares this library to another library based on major, minor and patch version
     * @param otherLibrary Library to compare to
     * @returns Comparison result
     */
    compareVersions(
        otherLibrary: ILibraryName & { patchVersion?: number }
    ): number {
        if (this.majorVersion - otherLibrary.majorVersion !== 0) {
            return this.majorVersion - otherLibrary.majorVersion;
        }
        if (this.minorVersion - otherLibrary.minorVersion !== 0) {
            return this.minorVersion - otherLibrary.minorVersion;
        }
        if (
            this.patchVersion &&
            otherLibrary.patchVersion &&
            this.patchVersion - otherLibrary.patchVersion !== 0
        ) {
            return this.patchVersion - otherLibrary.patchVersion;
        }
        return 0;
    }

    /**
     * Formats the identifier of a library as a single string containing machineName, major and minor version
     * @param library Library name to format
     * @returns Identifier of this library
     */
    static formatNameAsString(library: ILibraryName): string {
        return `${library.machineName};${library.majorVersion};${library.minorVersion}`;
    }
}
