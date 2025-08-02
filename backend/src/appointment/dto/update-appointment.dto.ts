// // update-appointment.dto.ts
// import { IsInt, IsDateString, IsOptional, IsString } from 'class-validator';

// export class UpdateAppointmentDto {
//   @IsInt()
//   @IsOptional()
//   patient_id?: number;

//   @IsInt()
//   @IsOptional()
//   doctor_id?: number;

//   @IsInt()
//   @IsOptional()
//   ward_id?: number | null; // Добавляем поддержку null

//   @IsDateString()
//   @IsOptional()
//   appointment_date?: string; // Меняем Date на string для согласованности

//   @IsString()
//   @IsOptional()
//   symptom?: string;

//   @IsString()
//   @IsOptional()
//   diagnos?: string;

//   @IsString()
//   @IsOptional()
//   allergy?: string;

//   @IsString()
//   @IsOptional()
//   preparation?: string;
// }




import { IsInt, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsInt()
  @IsOptional()
  patient_id?: number;

  @IsInt()
  @IsOptional()
  doctor_id?: number;

  @IsInt()
  @IsOptional()
  ward_id?: number | null;

  @IsDateString()
  @IsOptional()
  appointment_date?: string;

  @IsString()
  @IsOptional()
  symptom?: string;

  @IsString()
  @IsOptional()
  diagnos?: string;

  @IsString()
  @IsOptional()
  allergy?: string;

  @IsString()
  @IsOptional()
  preparation?: string;
}