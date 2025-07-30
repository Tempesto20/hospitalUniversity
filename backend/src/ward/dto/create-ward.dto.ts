import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWardDto {
  @IsInt()
  @IsNotEmpty()
  ward_number: number;

  @IsInt()
  @IsNotEmpty()
  department_id: number;

  @IsInt()
  @IsOptional()
  doctor_id?: number | null; // Разрешаем null для doctor_id
}