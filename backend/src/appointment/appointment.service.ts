import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['patient', 'doctor', 'ward'],
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { appointment_id: id },
      relations: ['patient', 'doctor', 'ward'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentRepository.create(createAppointmentDto);
    const savedAppointment = await this.appointmentRepository.save(appointment);
    return this.findOne(savedAppointment.appointment_id);
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    await this.appointmentRepository.update(id, updateAppointmentDto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<{ message: string }> {
    const appointment = await this.findOne(id);
    
    try {
      await this.appointmentRepository.remove(appointment);
      return { message: `Appointment with ID ${id} successfully deleted` };
    } catch (error) {
      throw new NotFoundException(
        `Failed to delete appointment with ID ${id}: ${error.message}`,
      );
    }
  }



  
// ------------------------------------------------------------------------
  async findAllWithAppointments() {
  return this.appointmentRepository.query(`
   SELECT
      appo.appointment_id,
      pat.full_name as patient_full_name,
	  doc.full_name as doctor_full_name,
	  wa.ward_number,
	  appo.appointment_date,
      dep.department_name,
	  appo.symptom,
      appo.diagnos,
      appo.allergy,
      appo.preparation
    FROM appointment appo
    LEFT JOIN patient pat ON pat.patient_id = appo.patient_id
    LEFT JOIN ward wa ON appo.ward_id = wa.ward_id
    LEFT JOIN department dep ON wa.department_id = dep.department_id
    LEFT JOIN doctor doc ON wa.doctor_id = doc.doctor_id
    ORDER BY appo.appointment_id ASC
      `);
  }
// ------------------------------------------------------------------------




}