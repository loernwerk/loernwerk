import { IContentMetadata, ILibraryName } from '@lumieducation/h5p-server';
import {
    IContentAuthor,
    IContentChange,
} from '@lumieducation/h5p-server/build/src/types';
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

/**
 * Database object containing custom created H5P content.
 */
@Entity()
export class DBH5PContent extends BaseEntity implements IContentMetadata {
    @Column({ type: 'simple-json', nullable: true })
    dynamicDependencies?: ILibraryName[] | undefined;

    @Column({ type: 'simple-json', nullable: true })
    editorDependencies?: ILibraryName[] | undefined;

    @Column({ type: 'simple-json' })
    embedTypes: ('iframe' | 'div')[];

    @Column({ nullable: true })
    h?: string | undefined;

    @Column()
    language: string;

    @Column()
    mainLibrary: string;

    @Column({ nullable: true })
    metaDescription?: string | undefined;

    @Column({ nullable: true })
    metaKeywords?: string | undefined;

    @Column({ type: 'simple-json' })
    preloadedDependencies: ILibraryName[];

    @Column({ nullable: true })
    w?: string | undefined;

    @Column({nullable: true})
    defaultLanguage: string;

    @Column({ nullable: true })
    a11yTitle?: string | undefined;

    @Column()
    license: string;

    @Column({ nullable: true })
    licenseVersion?: string | undefined;

    @Column({ nullable: true })
    yearFrom?: string | undefined;

    @Column({ nullable: true })
    yearTo?: string | undefined;

    @Column({ nullable: true })
    source?: string | undefined;

    @Column()
    title: string;

    @Column({ type: 'simple-json', nullable: true })
    authors?: IContentAuthor[] | undefined;

    @Column({ nullable: true })
    licenseExtras?: string | undefined;

    @Column({ type: 'simple-json', nullable: true })
    changes?: IContentChange[] | undefined;

    @Column({ nullable: true })
    authorComments?: string | undefined;

    @Column({ nullable: true })
    contentType?: string | undefined;

    @PrimaryGeneratedColumn('increment')
    h5pContentId: string;

    @Column({ type: 'simple-json' })
    content: unknown;
}
