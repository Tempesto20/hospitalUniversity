// import { ApiProperty } from '@nestjs/swagger';

// export class TopPatientsReportDto {
//   @ApiProperty()
//   patient_name: string;

//   @ApiProperty()
//   visit_count: number;

//   @ApiProperty()
//   specialty_name: string;
// }



export class TopPatientsReportDto {
  patient_id: number;
  patient_name: string;
  birth_date: Date;
  insurance_policy: string;
  appointment_count: number;
}