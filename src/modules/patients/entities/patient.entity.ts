import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity({ name: 'patients' })
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', type: 'varchar', nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: false })
  lastName: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', nullable: false })
  phone: string;

  @Column({
    name: 'doctor_preference',
    type: 'varchar',
    nullable: false,
  })
  doctorPreference: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;
}
