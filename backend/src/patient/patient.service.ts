import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find({
      relations: ['appointments'],
    });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { patient_id: id },
      relations: ['appointments'],
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  // async create(createPatientDto: CreatePatientDto): Promise<Patient> {
  //   const patient = this.patientRepository.create(createPatientDto);
  //   const savedPatient = await this.patientRepository.save(patient);
  //   return this.findOne(savedPatient.patient_id);
  // }

async create(createPatientDto: CreatePatientDto): Promise<Patient> {
  // Create the patient entity first
  const patient = this.patientRepository.create({
    full_name: createPatientDto.full_name,
    insurance_policy: createPatientDto.insurance_policy,
    passport: createPatientDto.passport,
    birth_date: new Date(createPatientDto.birth_date),
    admission_date: new Date(createPatientDto.admission_date),
    discharge_date: createPatientDto.discharge_date 
      ? new Date(createPatientDto.discharge_date) 
      : undefined // Use undefined instead of null
  });
  
  return this.patientRepository.save(patient);
}

  // async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
  //   await this.patientRepository.update(id, updatePatientDto);
  //   return this.findOne(id);
  // }



async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
  const updateData: Partial<Patient> = {};
  
  if (updatePatientDto.full_name) {
    updateData.full_name = updatePatientDto.full_name;
  }
  if (updatePatientDto.birth_date) {
    updateData.birth_date = new Date(updatePatientDto.birth_date);
  }
  if (updatePatientDto.insurance_policy) {
    updateData.insurance_policy = updatePatientDto.insurance_policy;
  }
  if (updatePatientDto.passport) {
    updateData.passport = updatePatientDto.passport;
  }
  if (updatePatientDto.admission_date) {
    updateData.admission_date = new Date(updatePatientDto.admission_date);
  }
  if (updatePatientDto.discharge_date) {
    updateData.discharge_date = updatePatientDto.discharge_date 
      ? new Date(updatePatientDto.discharge_date) 
      : null;
  }

  await this.patientRepository.update(id, updateData);
  return this.findOne(id);
}






  async delete(id: number): Promise<{ message: string }> {
    const patient = await this.findOne(id);

    // Каскадное удаление приемов пациента
    if (patient.appointments && patient.appointments.length > 0) {
      await this.patientRepository
        .createQueryBuilder()
        .delete()
        .where('patient_id = :id', { id })
        .execute();
    }

    await this.patientRepository.delete(id);
    return { message: `Patient with ID ${id} successfully deleted` };
  }


// ------------------------------------------------------------------------
  async findAllWithCombines() {
  return this.patientRepository.query(`
    SELECT
      pat.patient_id,
      pat.full_name as patient_full_name,
      pat.birth_date,
      pat.insurance_policy,
      pat.passport,
      pat.admission_date,
      pat.discharge_date,
      wa.ward_number,
      dep.department_name,
      doc.full_name as doctor_full_name,
      appo.diagnos,
      appo.symptom,
      appo.allergy,
      appo.preparation
    FROM patient pat
    LEFT JOIN appointment appo ON pat.patient_id = appo.patient_id
    LEFT JOIN ward wa ON appo.ward_id = wa.ward_id
    LEFT JOIN department dep ON wa.department_id = dep.department_id
    LEFT JOIN doctor doc ON wa.doctor_id = doc.doctor_id
    ORDER BY pat.patient_id ASC
      `);
  }
// ------------------------------------------------------------------------











}