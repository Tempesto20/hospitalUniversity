import { ApiProperty } from '@nestjs/swagger';

export class TopPatientsReportDto {
  @ApiProperty()
  patient_name: string;

  @ApiProperty()
  visit_count: number;

  @ApiProperty()
  specialty_name: string;
}