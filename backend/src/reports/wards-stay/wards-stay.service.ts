// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Hospitalization } from '../../hospitalization/hospitalization.entity';

// @Injectable()
// export class WardsStayService {
//   constructor(
//     @InjectRepository(Hospitalization)
//     private readonly hospitalizationRepository: Repository<Hospitalization>,
//   ) {}

//   async getWardsWithPatients(maxDays: number) {
//     return this.hospitalizationRepository.query(
//       'SELECT * FROM get_patients_with_wards_info($1)',
//       [maxDays],
//     );
//   }
// }


import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WardsStayDto } from './dto/wards-stay-report.dto';
import { Patient } from 'src/patient/patient.entity';

@Injectable()
export class WardsStayService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async getPatientsWithWardsInfo(maxDays?: number): Promise<WardsStayDto[]> {
    // Вызываем готовую функцию из БД
    const result = await this.patientRepository.query(
      `SELECT * FROM get_patients_with_wards_info($1)`,
      [maxDays ?? null],  // передаем параметр или NULL, если не указан
    );
    
    return result as WardsStayDto[];
  }
}





// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Patient } from 'src/patient/patient.entity';
// import { Ward } from 'src/ward/ward.entity';
// import { Repository } from 'typeorm';
// import { WardsStayReportDto } from './dto/wards-stay-report.dto';

// @Injectable()
// export class WardsStayService {
//   constructor(
//     @InjectRepository(Patient) private patientRepo: Repository<Patient>,
//     @InjectRepository(Ward) private wardRepo: Repository<Ward>
//   ) {}

//   async getWardsWithPatients(maxDays: number): Promise<WardsStayReportDto[]> {
//     // Получаем данные по палатам
//     const wardsQuery = `
//       SELECT * FROM get_wards_with_patients($1)
//     `;
//     const wards = await this.wardRepo.query(wardsQuery, [maxDays]);

//     // Для каждой палаты получаем пациентов
//     for (const ward of wards) {
//       const patientsQuery = `
//         SELECT 
//           p.full_name,
//           p.admission_date,
//           p.discharge_date,
//           (COALESCE(p.discharge_date, CURRENT_DATE) - p.admission_date) AS stay_days
//         FROM patient p
//         JOIN appointment a ON p.patient_id = a.patient_id
//         WHERE a.ward_id = (
//           SELECT ward_id FROM ward WHERE ward_number = $1
//         )
//         AND (COALESCE(p.discharge_date, CURRENT_DATE) - p.admission_date) <= $2
//       `;
      
//       ward.patients = await this.patientRepo.query(patientsQuery, [
//         ward.ward_number,
//         maxDays
//       ]);
//     }

//     return wards;
//   }
// }