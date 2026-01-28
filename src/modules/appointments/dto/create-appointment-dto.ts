import { IsInt, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  appointmentDate: string;

  @IsInt()
  @IsNotEmpty()
  patientId: number;
}
