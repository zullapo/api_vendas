import { MigrationInterface, QueryRunner } from 'typeorm'

export class AlterProducts1656531428348 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE products ALTER COLUMN created_at TYPE timestamp with time zone'
		)
		await queryRunner.query(
			'ALTER TABLE products ALTER COLUMN updated_at TYPE timestamp with time zone'
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			'ALTER TABLE products ALTER COLUMN created_at TYPE timestamp'
		)
		await queryRunner.query(
			'ALTER TABLE products ALTER COLUMN updated_at TYPE timestamp'
		)
	}
}
