import { MigrationInterface, QueryRunner } from "typeorm";

export class PatientAppointmentView1769596140724 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE VIEW patient_appointments_view AS
            SELECT
                p.id,
                p.first_name AS "firstName",
                p.last_name AS "lastName",
                p.email AS email,
                p.phone AS phone,
                p.doctor_preference AS "doctorPreference",
                a.id AS "appointmentId",
                a.title,
                a.description,
                a.appointment_date AS appointmentDate
            FROM patients p
            JOIN appointment a ON a."patientId" = p.id;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP VIEW IF EXISTS patient_appointments_view;
        `);
    }

}
