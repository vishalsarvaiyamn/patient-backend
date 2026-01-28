import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  doctorPreference: string;

  @IsString()
  @IsNotEmpty()
  appointmentTitle: string;

  @IsString()
  @IsNotEmpty()
  appointmentDescription: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  appointmentDate: Date;
}
 