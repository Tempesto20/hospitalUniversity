import { ApiProperty } from '@nestjs/swagger';

export class ComplaintsReportDto {
  @ApiProperty()
  doctor_name: string;

  @ApiProperty()
  specialty_name: string;

  @ApiProperty()
  month_year: string;

  @ApiProperty()
  patient_name: string;

  @ApiProperty()
  complaint: string;

  @ApiProperty()
  appointment_date: Date;
}