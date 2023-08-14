import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

/**
 * Migration for adding required tables and columns for H5P content reusability.
 */
export class H5PReusability1691157808340 implements MigrationInterface {
    /**
     * Applies this migration.
     * @param queryRunner QueryRunner to run this migration with
     */
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'dbh5_p_content',
            new TableColumn({
                name: 'owner',
                type: 'int',
                isNullable: true,
            })
        );

        await queryRunner.createTable(
            new Table({
                name: 'dbh5_p_content_used_by',
                columns: [
                    {
                        name: 'h5pContentId',
                        type: 'string',
                        isPrimary: true,
                    },
                    {
                        name: 'sequenceCode',
                        type: 'string',
                        isPrimary: true,
                    },
                ],
            })
        );

        // Assign owners & add usage entries
        const contents = await queryRunner.query(
            'SELECT ownerSequence, h5pContentId FROM dbh5_p_content'
        );
        for (const content of contents) {
            const sequence = await queryRunner.query(
                `SELECT authorId FROM db_sequence WHERE code = '${content.ownerSequence}'`
            );
            await queryRunner.query(
                `INSERT INTO dbh5_p_content_used_by (h5pContentId, sequenceCode) VALUES ('${content.h5pContentId}', '${content.ownerSequence}')`
            );
            await queryRunner.query(
                `UPDATE dbh5_p_content SET owner = '${sequence[0].authorId}' WHERE h5pContentId = '${content.h5pContentId}'`
            );
        }

        // Remove "NOT NULL" constraint
        await queryRunner.changeColumn(
            'dbh5_p_content',
            'owner',
            new TableColumn({
                name: 'owner',
                type: 'int',
            })
        );
        await queryRunner.dropColumn('dbh5_p_content', 'ownerSequence');
    }

    /**
     * Reverts this migration.
     * @param queryRunner QueryRunner to run this migration with
     */
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'dbh5_p_content',
            new TableColumn({
                name: 'ownerSequence',
                type: 'string',
                isNullable: true,
            })
        );

        // Update DBH5PContent owners
        const contents = await queryRunner.query(
            'SELECT h5pContentId FROM dbh5_p_content'
        );
        for (const content of contents) {
            const sequence = await queryRunner.query(
                `SELECT sequenceCode FROM dbh5_p_content_used_by WHERE h5pContentId = '${content.h5pContentId}'`
            );
            if (sequence.length <= 0) {
                throw new Error('Unused H5P content cannot be migrated');
            }
            await queryRunner.query(
                `UPDATE dbh5_p_content SET ownerSequence = '${sequence[0].sequenceCode}' WHERE h5pContentId = '${content.h5pContentId}'`
            );
        }

        // Remove "NOT NULL" constraint
        await queryRunner.changeColumn(
            'dbh5_p_content',
            'ownerSequence',
            new TableColumn({
                name: 'ownerSequence',
                type: 'string',
            })
        );

        await queryRunner.dropTable('dbh5_p_content_used_by');
        await queryRunner.dropColumn('dbh5_p_content', 'owner');
    }
}
