import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment-dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentsService: AppointmentService) { }

  @Post()
  create(@Body() body: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(body);
  }

  @Get()
  getAppointments() {
    return this.appointmentsService.getAppointments();
  }

  @Get(':patientId')
  findAppointmentByPatientID(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.appointmentsService.findAppointmentByPatientID(patientId);
  }

}
