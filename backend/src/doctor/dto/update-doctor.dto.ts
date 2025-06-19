import { IsNumber, IsString, Length, IsOptional } from 'class-validator';

export class UpdateDoctorDto {
  @IsString()
  @Length(2, 255)
  @IsOptional()
  full_name?: string;

  @IsNumber()
  @IsOptional()
  specialty_id?: number | null; // Allow null
}