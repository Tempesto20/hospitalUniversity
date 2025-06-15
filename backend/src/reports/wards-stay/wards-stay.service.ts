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


