import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1761605855860 implements MigrationInterface {
    name = 'InitialSchema1761605855860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "displayName" character varying NOT NULL, "spotifyId" character varying NOT NULL, "accessToken" character varying, "refreshToken" character varying, "tokenExpiresAt" TIMESTAMP, "profileImage" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_69f5d772fb38e0d5617130d1049" UNIQUE ("spotifyId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "liked_songs" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "trackId" character varying NOT NULL, "trackName" character varying NOT NULL, "artistName" character varying, "albumName" character varying, "imageUrl" character varying, "likedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6bec332c2d3284aef39a5cf97ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "liked_songs" ADD CONSTRAINT "FK_9196b50b7e8ce2eb3382cb10bac" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "liked_songs" DROP CONSTRAINT "FK_9196b50b7e8ce2eb3382cb10bac"`);
        await queryRunner.query(`DROP TABLE "liked_songs"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
