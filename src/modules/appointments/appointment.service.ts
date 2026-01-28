import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Like, Repository } from 'typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { CreateAppointmentDto } from './dto/create-appointment-dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    private readonly dataSource: DataSource
  ) { }

  async createAppointment(dto: CreateAppointmentDto) {
    try {

      const result = await this.dataSource.query(
        `CALL public.sp_create_appointment($1, $2, $3, $4, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`,
        [dto.title,
        dto.description,
        dto.appointmentDate,
        dto.patientId,]
      );

      return result[0]

    } catch (error) {
      if (error.code === 'P0001') {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

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
    const patient = await this.dataSource.query(`SELECT * FROM patient_appointments_view`);
    console.log('view result', patient)

    if (!patient) {
      throw new NotFoundException('No record found');
    }
    return patient
  }

}
