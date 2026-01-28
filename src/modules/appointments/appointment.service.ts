import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Like, Repository } from 'typeorm';
import { Patient } from '../patients/entities/patient.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    private readonly dataSource: DataSource
  ) { }

  // async create(dto: CreatePatientDto): Promise<Patient> {
  //   const existingPatient = await this.patientRepo.findOne({
  //     where: [{ email: dto.email }, { phone: dto.phone }],
  //   });

  //   if (existingPatient) {
  //     const conflicts: string[] = [];
  //     if (existingPatient?.email === dto.email) conflicts.push('email');
  //     if (existingPatient.phone === dto.phone) conflicts.push('phone');

  //     throw new ConflictException(
  //       `Patient with the same ${conflicts.join(' and ')} already exists`,
  //     );
  //   }

  //   const patient = this.patientRepo.create(dto);
  //   return this.patientRepo.save(patient);
  // }

  async findAppointmentByPatientID(id?: number): Promise<Patient> {
    const patient = await this.patientRepo.findOne({
      where: { id },
      select: {
        appointments: {
          id: true,
          title: true,
          description: true,
          appointmentDate: true,
        }
      },
      relations: ['appointments']
    });

    if (!patient) {
      throw new NotFoundException('No record found');
    }
    return patient
  }

  async getAppointments(): Promise<Patient> {
    const patient = this.dataSource.query(`SELECT * FROM patient_appointments_view`);
    console.log('view result', patient)

    if (!patient) {
      throw new NotFoundException('No record found');
    }
    return patient
  }

}
