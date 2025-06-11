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

  async getAveragePatientsByComplaint(keyword?: string, month?: string) {
    if (keyword || month) {
      return this.appointmentRepository.query(
        'SELECT * FROM get_average_patients_by_complaint($1, $2)',
        [keyword || null, month ? new Date(month) : null],
      );
    }

    return this.appointmentRepository.query(`
      SELECT 
        d.full_name AS doctor_name,
        s.specialty_name,
        TO_CHAR(a.appointment_date, 'Month YYYY') AS month_year,
        p.full_name AS patient_name,
        a.complaint,
        a.appointment_date
      FROM 
        Appointment a
      JOIN 
        Doctor d ON a.doctor_id = d.doctor_id
      JOIN 
        Specialty s ON d.specialty_id = s.specialty_id
      JOIN
        Patient p ON a.patient_id = p.patient_id
      WHERE 
        a.complaint IS NOT NULL
      ORDER BY 
        a.appointment_date, d.full_name
    `);
  }
}