import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../patients/entities/patient.entity';
import { Appointment } from './entities/appointment.entity';
import { AppointmentController } from './appointments.controller';
import { AppointmentService } from './appointment.service';

@Module({
    imports: [TypeOrmModule.forFeature([Patient, Appointment])],
    controllers: [AppointmentController],
    providers: [AppointmentService],
})

export class AppointmentsModule {}
