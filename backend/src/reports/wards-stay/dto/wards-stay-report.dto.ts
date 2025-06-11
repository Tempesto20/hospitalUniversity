// import { ApiProperty } from '@nestjs/swagger';

// export class WardsStayReportDto {
//   @ApiProperty()
//   ward_number: string;

//   @ApiProperty()
//   patient_name: string;

//   @ApiProperty()
//   admission_date: Date;

//   @ApiProperty()
//   discharge_date: Date;

//   @ApiProperty()
//   stay_days: number;
// }


export class WardsStayReportDto {
  ward_number: number;
  department_name: string;
  doctor_name: string;
  specialty_name: string;
  patient_count: number;
  max_stay_days: number;
  patients: PatientStayDto[]; // Добавляем массив пациентов
}

export class PatientStayDto {
  full_name: string;
  admission_date: string;
  discharge_date: string | null;
  stay_days: number;
}





export class WardsStayDto {
  ward_number: number;
  department_name: string;
  patient_name: string;
  admission_date: Date;
  discharge_date: Date | null;
  days_in_ward: number;
  doctor_name: string | null;
  specialty_name: string | null;
  patient_id: number;
}




// import { IsNumber, IsString, IsOptional, IsDate, IsArray } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

// export class PatientStayDto {
//   @ApiProperty({ description: 'Полное имя пациента' })
//   @IsString()
//   full_name: string;

//   @ApiProperty({ description: 'Дата поступления', type: 'string', format: 'date' })
//   @IsDate()
//   @IsString()
//   admission_date: string;

//   @ApiProperty({ 
//     description: 'Дата выписки (может быть null)', 
//     type: 'string', 
//     format: 'date', 
//     nullable: true 
//   })
//   @IsOptional()
//   @IsDate()
//   @IsString()
//   discharge_date: string | null;

//   @ApiProperty({ description: 'Количество дней пребывания' })
//   @IsNumber()
//   stay_days: number;
// }

// export class WardsStayReportDto {
//   @ApiProperty({ description: 'Номер палаты' })
//   @IsNumber()
//   ward_number: number;

//   @ApiProperty({ description: 'Название отделения' })
//   @IsString()
//   department_name: string;

//   @ApiProperty({ description: 'Имя врача' })
//   @IsString()
//   doctor_name: string;

//   @ApiProperty({ description: 'Специализация врача' })
//   @IsString()
//   specialty_name: string;

//   @ApiProperty({ description: 'Количество пациентов' })
//   @IsNumber()
//   patient_count: number;

//   @ApiProperty({ description: 'Максимальное количество дней пребывания' })
//   @IsNumber()
//   max_stay_days: number;

//   @ApiProperty({ 
//     description: 'Список пациентов с информацией о пребывании', 
//     type: PatientStayDto, 
//     isArray: true 
//   })
//   @IsArray()
//   @IsOptional()
//   patients: PatientStayDto[];
// }
