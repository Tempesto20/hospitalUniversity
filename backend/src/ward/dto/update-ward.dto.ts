import { IsInt, IsOptional } from 'class-validator';

export class UpdateWardDto {
  @IsInt()
  @IsOptional()
  ward_number?: number;

  @IsInt()
  @IsOptional()
  department_id?: number;

  @IsInt()
  @IsOptional()
  doctor_id?: number | null;
}