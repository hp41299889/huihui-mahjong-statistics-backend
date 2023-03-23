import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1679479055457 implements MigrationInterface {
    name = 'migration1679479055457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "record" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "winner" smallint, "loser" character varying, "dealer" smallint NOT NULL, "dealerCount" smallint NOT NULL, "circle" smallint NOT NULL, "endType" "public"."record_endtype_enum" NOT NULL, "point" smallint, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "roundUid" uuid, CONSTRAINT "PK_8de44784d54d4397e7cce8fcd37" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE TABLE "round" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "deskType" "public"."round_desktype_enum" NOT NULL DEFAULT 'auto', "base" smallint NOT NULL, "point" smallint NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "eastId" integer, "southId" integer, "westId" integer, "northId" integer, CONSTRAINT "PK_3eb2356a4d7d48675d66bd91363" PRIMARY KEY ("uid"))`);
        await queryRunner.query(`CREATE TABLE "player" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7baa5220210c74f8db27c06f8b4" UNIQUE ("name"), CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "record" ADD CONSTRAINT "FK_9fef4d68af13d466d9b3537ef85" FOREIGN KEY ("roundUid") REFERENCES "round"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_bdac3053e6593e58cbffafd2951" FOREIGN KEY ("eastId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_b3798cabfe883e3b2dcc73d6e63" FOREIGN KEY ("southId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_b96a601b023efa278a75d867fdf" FOREIGN KEY ("westId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "round" ADD CONSTRAINT "FK_bf7283631b3f9cd1a8c4c32e866" FOREIGN KEY ("northId") REFERENCES "player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_bf7283631b3f9cd1a8c4c32e866"`);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_b96a601b023efa278a75d867fdf"`);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_b3798cabfe883e3b2dcc73d6e63"`);
        await queryRunner.query(`ALTER TABLE "round" DROP CONSTRAINT "FK_bdac3053e6593e58cbffafd2951"`);
        await queryRunner.query(`ALTER TABLE "record" DROP CONSTRAINT "FK_9fef4d68af13d466d9b3537ef85"`);
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TABLE "round"`);
        await queryRunner.query(`DROP TABLE "record"`);
    }

}
