import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppointmentsTable1769585774358 implements MigrationInterface {
    name = 'CreateAppointmentsTable1769585774358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appointment" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "appointment_date" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "patientId" integer, CONSTRAINT "PK_e8be1a53027415e709ce8a2db74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5ce4c3130796367c93cd817948" ON "appointment" ("patientId") `);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_5ce4c3130796367c93cd817948e" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_5ce4c3130796367c93cd817948e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5ce4c3130796367c93cd817948"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
    }

}
