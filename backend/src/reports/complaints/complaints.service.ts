import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../../appointment/appointment.entity';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async getComplaintsStatistics(keyword?: string) {
    return this.appointmentRepository.query(
      'SELECT * FROM get_average_patients_by_complaint($1)',
      [keyword || null],
    );
  }
}