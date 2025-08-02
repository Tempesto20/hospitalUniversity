import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Patient } from '../patient/patient.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Ward } from '../ward/ward.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
  ) {}

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['patient', 'doctor', 'ward', 'ward.department'],
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { appointment_id: id },
      relations: ['patient', 'doctor', 'ward', 'ward.department'],
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Загружаем связанные сущности с проверкой на null
    const patient = await this.patientRepository.findOneBy({ patient_id: createAppointmentDto.patient_id });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${createAppointmentDto.patient_id} not found`);
    }

    const doctor = await this.doctorRepository.findOneBy({ doctor_id: createAppointmentDto.doctor_id });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${createAppointmentDto.doctor_id} not found`);
    }

    let ward: Ward | null = null;
    if (createAppointmentDto.ward_id) {
      ward = await this.wardRepository.findOneBy({ ward_id: createAppointmentDto.ward_id });
      if (!ward) {
        throw new NotFoundException(`Ward with ID ${createAppointmentDto.ward_id} not found`);
      }
    }

    // Создаем новую запись о приеме
    const appointmentData = {
      patient,
      doctor,
      ward: ward || undefined, // Преобразуем null в undefined для TypeORM
      appointment_date: createAppointmentDto.appointment_date,
      symptom: createAppointmentDto.symptom,
      diagnos: createAppointmentDto.diagnos,
      allergy: createAppointmentDto.allergy,
      preparation: createAppointmentDto.preparation,
    };

    const appointment = this.appointmentRepository.create(appointmentData);
    const savedAppointment = await this.appointmentRepository.save(appointment);
    return this.findOne(savedAppointment.appointment_id);
  }

  

async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
  const appointment = await this.findOne(id);
  
  if (updateAppointmentDto.patient_id !== undefined) {
    const patient = await this.patientRepository.findOneBy({ 
      patient_id: updateAppointmentDto.patient_id 
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${updateAppointmentDto.patient_id} not found`);
    }
    appointment.patient = patient;
  }
  
  if (updateAppointmentDto.doctor_id !== undefined) {
    const doctor = await this.doctorRepository.findOneBy({ 
      doctor_id: updateAppointmentDto.doctor_id 
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${updateAppointmentDto.doctor_id} not found`);
    }
    appointment.doctor = doctor;
  }
  
  if (updateAppointmentDto.ward_id !== undefined) {
    if (updateAppointmentDto.ward_id !== null) {
      const ward = await this.wardRepository.findOneBy({ 
        ward_id: updateAppointmentDto.ward_id 
      });
      if (!ward) {
        throw new NotFoundException(`Ward with ID ${updateAppointmentDto.ward_id} not found`);
      }
      appointment.ward = ward;
    } else {
      appointment.ward = null;
    }
  }

  if (updateAppointmentDto.appointment_date !== undefined) {
    appointment.appointment_date = new Date(updateAppointmentDto.appointment_date);
  }
  
  if (updateAppointmentDto.symptom !== undefined) {
    appointment.symptom = updateAppointmentDto.symptom;
  }
  
  if (updateAppointmentDto.diagnos !== undefined) {
    appointment.diagnos = updateAppointmentDto.diagnos;
  }
  
  if (updateAppointmentDto.allergy !== undefined) {
    appointment.allergy = updateAppointmentDto.allergy;
  }
  
  if (updateAppointmentDto.preparation !== undefined) {
    appointment.preparation = updateAppointmentDto.preparation;
  }

  await this.appointmentRepository.save(appointment);
  return this.findOne(id);
}



  async delete(id: number): Promise<{ message: string }> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
    return { message: `Appointment with ID ${id} successfully deleted` };
  }

  async findAllWithAppointments(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['patient', 'doctor', 'ward', 'ward.department'],
      order: { appointment_id: 'ASC' },
    });
  }

  //   async findAllWithAppointments() {
//   return this.appointmentRepository.query(`
//    SELECT
//       appo.appointment_id,
//       pat.full_name as patient_full_name,
// 	  doc.full_name as doctor_full_name,
// 	  wa.ward_number,
// 	  appo.appointment_date,
//       dep.department_name,
// 	  appo.symptom,
//       appo.diagnos,
//       appo.allergy,
//       appo.preparation
//     FROM appointment appo
//     LEFT JOIN patient pat ON pat.patient_id = appo.patient_id
//     LEFT JOIN ward wa ON appo.ward_id = wa.ward_id
//     LEFT JOIN department dep ON wa.department_id = dep.department_id
//     LEFT JOIN doctor doc ON wa.doctor_id = doc.doctor_id
//     ORDER BY appo.appointment_id ASC
//       `);
//   }

}