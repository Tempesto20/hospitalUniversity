import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWardDto {
  @IsInt()
  @IsNotEmpty()
  ward_number: number; // Изменено с string на number

  @IsInt()
  department_id: number;

  @IsInt()
  @IsOptional()
  doctor_id?: number;
}