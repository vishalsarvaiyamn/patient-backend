import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, DeleteResult, Like, Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Appointment } from '../appointments/entities/appointment.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    private readonly dataSource: DataSource,
  ) { }

  async create(
    dto: CreatePatientDto,
  ): Promise<{ patient: Patient; appointment: Appointment }> {
    const {
      firstName,
      lastName,
      email,
      phone,
      doctorPreference,
      appointmentDate,
      appointmentDescription,
      appointmentTitle,
    } = dto;

    try {
      return await this.dataSource.transaction(async (manager) => {
        const existingPatient = await manager.findOne(Patient, {
          where: [{ email }, { phone }],
        });

        if (existingPatient) {
          const conflicts: string[] = [];
          if (existingPatient.email === email) conflicts.push('email');
          if (existingPatient.phone === phone) conflicts.push('phone');

          throw new ConflictException(
            `Patient with the same ${conflicts.join(' and ')} already exists`,
          );
        }

        const patient = manager.create(Patient, {
          firstName,
          lastName,
          email,
          phone,
          doctorPreference,
        });

        const savedPatient = await manager.save(patient);

        const appointment = manager.create(Appointment, {
          patient: savedPatient,
          appointmentDate,
          description: appointmentDescription,
          title: appointmentTitle,
        });

        const savedAppointment = await manager.save(appointment);

        return {
          patient: savedPatient,
          appointment: savedAppointment,
        };
      });
    } catch (err: any) {
      
      if (err.code === '23505') {
        throw new ConflictException(
          'Patient with this email or phone already exists',
        );
      }

      throw err;
    }
  }



  async findAll(email?: string): Promise<Patient[]> {
    let patients: Patient[];

    if (email && email.length > 2) {
      patients = await this.patientRepo.find({
        where: {
          email: Like(`%${email}%`),
        },
      });

      if (!patients.length) {
        throw new NotFoundException('No patients found');
      }
    } else {
      patients = await this.patientRepo.find();
    }

    return patients.map((p) => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      name: `${p.firstName} ${p.lastName}`,
      email: p.email,
      phone: p.phone,
      doctorPreference: p.doctorPreference,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }


  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async update(id: number, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.patientRepo.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    Object.assign(patient, dto);
    return this.patientRepo.save(patient);
  }

  async remove(id: number): Promise<null> {
    const result = await this.patientRepo.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Patient not found');
    }
    return null
  }

}
