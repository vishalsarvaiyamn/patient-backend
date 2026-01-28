
import { Patient } from "../../patients/entities/patient.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, NumericType, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number

    @Index()
    @ManyToOne(() => Patient, (patient) => patient.id)
    patient: Patient

    @Column({ type: 'varchar', nullable: false })
    title: string

    @Column({ type: 'text' })
    description: string

    @Column({ name: 'appointment_date', type: 'timestamp with time zone' })
    appointmentDate: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date
}