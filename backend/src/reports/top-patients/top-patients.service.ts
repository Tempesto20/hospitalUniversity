import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialty } from '../../specialty/specialty.entity';
import { TopPatientsReportDto } from './dto/top-patients-report.dto';

@Injectable()
export class TopPatientsService {
  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  async getTopPatientsBySpecialty(specialty?: string): Promise<TopPatientsReportDto[]> {
    if (!specialty) {
      return [];
    }
    
    const result = await this.specialtyRepository.query(
      `SELECT * FROM get_top_patients_by_specialty($1)`,
      [specialty],
    );
    
    return result as TopPatientsReportDto[];
  }

  async getSpecialties(): Promise<string[]> {
    const specialties = await this.specialtyRepository.find({
      select: ['specialty_name'],
      order: { specialty_name: 'ASC' },
    });
    return specialties.map(s => s.specialty_name);
  }
}