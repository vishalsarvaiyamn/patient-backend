import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) { }

  async create(dto: CreatePatientDto): Promise<Patient> {
    const existingPatient = await this.patientRepo.findOne({
      where: [{ email: dto.email }, { phone: dto.phone }],
    });

    if (existingPatient) {
      const conflicts: string[] = [];
      if (existingPatient?.email === dto.email) conflicts.push('email');
      if (existingPatient.phone === dto.phone) conflicts.push('phone');

      throw new ConflictException(
        `Patient with the same ${conflicts.join(' and ')} already exists`,
      );
    }

    const patient = this.patientRepo.create(dto);
    return this.patientRepo.save(patient);
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
