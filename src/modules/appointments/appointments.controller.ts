import {
  Controller,
  Get,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentsService: AppointmentService) { }

  // @Post()
  // create(@Body() dto: CreatePatientDto) {
  //   return this.patientsService.create(dto);
  // }

  @Get()
  getAppointments() {
    console.log('all data')
    return this.appointmentsService.getAppointments();
  }

  @Get(':patientId')
  findAppointmentByPatientID(@Param('patientId', ParseIntPipe) patientId: number) {
    console.log('with id')
    return this.appointmentsService.findAppointmentByPatientID(patientId);
  }

}
