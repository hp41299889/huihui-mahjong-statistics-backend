import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1681452210340 implements MigrationInterface {
    name = 'Migration1681452210340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "record_loser" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "loserId" integer, "recordUid" uuid, CONSTRAINT "PK_3d68bf2c50cab8c58ff0844d717" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "winner"`);
        await queryRunner.query(`DROP TYPE "public"."record_winner_enum"`);
        await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "loser"`);
        await queryRunner.query(`ALTER TABLE "record" ADD "winnerId" integer`);
        await queryRunner.query(`ALTER TABLE "record" ADD CONSTRAINT "FK_85de52a4f5de7f454a9f1154464" FOREIGN KEY ("winnerId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "record_loser" ADD CONSTRAINT "FK_0eb27640f28b881aea20d9cb6ca" FOREIGN KEY ("loserId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "record_loser" ADD CONSTRAINT "FK_ba55c6d5cea6c4ad7e3de7d3865" FOREIGN KEY ("recordUid") REFERENCES "record"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record_loser" DROP CONSTRAINT "FK_ba55c6d5cea6c4ad7e3de7d3865"`);
        await queryRunner.query(`ALTER TABLE "record_loser" DROP CONSTRAINT "FK_0eb27640f28b881aea20d9cb6ca"`);
        await queryRunner.query(`ALTER TABLE "record" DROP CONSTRAINT "FK_85de52a4f5de7f454a9f1154464"`);
        await queryRunner.query(`ALTER TABLE "record" DROP COLUMN "winnerId"`);
        await queryRunner.query(`ALTER TABLE "record" ADD "loser" text NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."record_winner_enum" AS ENUM('east', 'south', 'west', 'north')`);
        await queryRunner.query(`ALTER TABLE "record" ADD "winner" "public"."record_winner_enum" NOT NULL`);
        await queryRunner.query(`DROP TABLE "record_loser"`);
    }

}
