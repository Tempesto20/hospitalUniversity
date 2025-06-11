import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../appointment/appointment.entity';
import { Specialty } from '../../specialty/specialty.entity';

@Injectable()
export class TopPatientsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,
  ) {}

  async getTopPatientsBySpecialty(specialty?: string) {
    if (specialty) {
      return this.appointmentRepository.query(
        'SELECT * FROM get_top_patients_by_specialty($1)',
        [specialty],
      );
    }
    return [];
  }

  async getSpecialties() {
    const specialties = await this.specialtyRepository.find({
      select: ['specialty_name'],
      order: { specialty_name: 'ASC' },
    });
    return specialties.map(s => s.specialty_name);
  }
}