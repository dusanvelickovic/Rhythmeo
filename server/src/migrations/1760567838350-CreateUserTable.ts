import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1760567838350 implements MigrationInterface {
    name = 'CreateUserTable1760567838350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "displayName" character varying NOT NULL, "spotifyId" character varying NOT NULL, "accessToken" character varying, "refreshToken" character varying, "tokenExpiresAt" TIMESTAMP, "profileImage" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_69f5d772fb38e0d5617130d1049" UNIQUE ("spotifyId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
