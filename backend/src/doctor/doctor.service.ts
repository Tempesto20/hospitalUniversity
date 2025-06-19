import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Ward } from 'src/ward/ward.entity';
import { Specialty } from 'src/specialty/specialty.entity';

@Injectable()
export class DoctorService {
  wardRepository: any;
  appointmentRepository: any;
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}



  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find({
      relations: ['specialty', 'wards', 'appointments'],
    });
  }




  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { doctor_id: id },
      relations: ['specialty', 'wards', 'appointments'],
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }




  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorRepository.create(createDoctorDto);
    const savedDoctor = await this.doctorRepository.save(doctor);
    return this.findOne(savedDoctor.doctor_id);
  }



async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
  const doctor = await this.findOne(id);
  
  if (updateDoctorDto.full_name !== undefined) {
    doctor.full_name = updateDoctorDto.full_name;
  }

  // Handle specialty update
  if (updateDoctorDto.specialty_id !== undefined) {
    if (updateDoctorDto.specialty_id === null) {
      doctor.specialty = null;
    } else {
      doctor.specialty = { specialty_id: updateDoctorDto.specialty_id } as Specialty;
    }
  }

  await this.doctorRepository.save(doctor);
  return this.findOne(id);
}



  async delete(id: number): Promise<{ message: string }> {
    const doctor = await this.findOne(id);

    // Обнуляем ссылки на врача в палатах
    if (doctor.wards && doctor.wards.length > 0) {
      await this.wardRepository
        .createQueryBuilder()
        .update(Ward)
        .set({ doctor: null })
        .where('doctor_id = :id', { id })
        .execute();
    }





    // Удаляем связанные приемы (если нужно сохранить, можно закомментировать)
    if (doctor.appointments && doctor.appointments.length > 0) {
      await this.appointmentRepository
        .createQueryBuilder()
        .delete()
        .where('doctor_id = :id', { id })
        .execute();
    }




    await this.doctorRepository.delete(id);
    return { message: `Doctor with ID ${id} successfully deleted` };
  }


// ------------------------------------------------------------------------
  async findAllWithSpecialties() {
  return this.doctorRepository.query(`
    SELECT *
    FROM doctor doc
    LEFT JOIN specialty spec ON doc.specialty_id = spec.specialty_id
    ORDER BY doctor_id ASC
      `);
  }
// ------------------------------------------------------------------------

}