import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFulltextIndexToArticles1741282857058 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE articles ADD FULLTEXT INDEX idx_fulltext_title (title)`);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE articles DROP INDEX idx_fulltext_title`);
    }

}
