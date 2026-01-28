import { MigrationInterface, QueryRunner } from "typeorm";

export class SpCreateAppointment1769604252294 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE PROCEDURE public.sp_create_appointment(
          -- Input Parameters
          p_title_in VARCHAR,
          p_description_in TEXT,
          p_appointment_date_in TIMESTAMPTZ,
          p_patient_id_in INTEGER,
          -- Output Parameters (must have unique names)
          OUT appointmentId integer,
          OUT appointmentTitle character varying,
          OUT appointmentDescription text,
          OUT appointmentDate timestamp with time zone,
          OUT patientId integer,
          OUT createdAt timestamp with time zone,
          OUT updatedAt timestamp with time zone)
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
          -- 1. Validation
          IF NOT EXISTS (
              SELECT 1 FROM public.patients WHERE id = p_patient_id_in
          ) THEN
              RAISE EXCEPTION 'Patient does not exist'
                  USING ERRCODE = 'P0001';
          END IF;

          -- 2. Insert and assign to OUT parameters
          INSERT INTO public.appointment (
              title,
              description,
              appointment_date,
              "patientId",
              created_at,
              updated_at
          )
          VALUES (
              p_title_in,
              p_description_in,
              p_appointment_date_in,
              p_patient_id_in,
              CURRENT_TIMESTAMP,
              CURRENT_TIMESTAMP
          )
          RETURNING 
              id, 
              title, 
              description, 
              appointment_date, 
              "patientId", 
              created_at, 
              updated_at
          INTO 
              appointmentId, 
              appointmentTitle, 
              appointmentDescription, 
              appointmentDate, 
              patientId, 
              createdAt, 
              updatedAt;

      END;
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP PROCEDURE IF EXISTS public.sp_create_appointment;
    `);
  }
}