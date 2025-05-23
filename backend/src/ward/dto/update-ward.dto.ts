import { IsInt, IsString, IsOptional } from 'class-validator';

export class UpdateWardDto {
  @IsString()
  @IsOptional()
  ward_number?: number; // Изменено с string на number

  @IsInt()
  @IsOptional()
  department_id?: number;

  @IsInt()
  @IsOptional()
  doctor_id?: number;
}