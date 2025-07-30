import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ward } from './ward.entity';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { Department } from '../department/department.entity';
import { Doctor } from '../doctor/doctor.entity';

@Injectable()
export class WardService {
  constructor(
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>
  ) {}

  async create(createWardDto: CreateWardDto): Promise<Ward> {
    // Проверка уникальности номера палаты
    const existingWard = await this.wardRepository.findOne({
      where: { ward_number: createWardDto.ward_number }
    });
    
    if (existingWard) {
      throw new ConflictException(`Палата с номером ${createWardDto.ward_number} уже существует`);
    }

    // Получаем связанные сущности
    const department = await this.departmentRepository.findOne({
      where: { department_id: createWardDto.department_id }
    });
    
    if (!department) {
      throw new NotFoundException(`Отделение с ID ${createWardDto.department_id} не найдено`);
    }

    let doctor: Doctor | null = null;
    if (createWardDto.doctor_id) {
      doctor = await this.doctorRepository.findOne({
        where: { doctor_id: createWardDto.doctor_id }
      });
      
      if (!doctor) {
        throw new NotFoundException(`Врач с ID ${createWardDto.doctor_id} не найден`);
      }
    }

    // Создаем новую палату
    const ward = this.wardRepository.create({
      ward_number: createWardDto.ward_number,
      department,
      doctor
    });

    return await this.wardRepository.save(ward);
  }



async update(id: number, updateWardDto: UpdateWardDto): Promise<Ward> {
  const ward = await this.findOne(id);
  
  if (updateWardDto.ward_number !== undefined) {
    ward.ward_number = Number(updateWardDto.ward_number);
  }
  
  if (updateWardDto.department_id !== undefined) {
    const department = await this.departmentRepository.findOne({
      where: { department_id: Number(updateWardDto.department_id) }
    });
    
    if (!department) {
      throw new NotFoundException(`Отделение с ID ${updateWardDto.department_id} не найдено`);
    }
    ward.department = department;
  }
  
  if (updateWardDto.doctor_id !== undefined) {
    ward.doctor = updateWardDto.doctor_id 
      ? await this.doctorRepository.findOne({
          where: { doctor_id: Number(updateWardDto.doctor_id) }
        }) 
      : null;
  }

  return this.wardRepository.save(ward);
}



  // Остальные методы остаются без изменений
  async findAll(): Promise<Ward[]> {
    return this.wardRepository.find({
      relations: ['department', 'doctor', 'appointments'],
    });
  }

  async findOne(id: number): Promise<Ward> {
    const ward = await this.wardRepository.findOne({
      where: { ward_id: id },
      relations: ['department', 'doctor', 'appointments'],
    });
    if (!ward) {
      throw new NotFoundException(`Палата с ID ${id} не найдена`);
    }
    return ward;
  }


  async delete(id: number): Promise<{ message: string }> {
    const ward = await this.findOne(id);

    if (ward.appointments && ward.appointments.length > 0) {
      throw new ConflictException(
        `Невозможно удалить палату с ID ${id}, так как к ней привязаны приемы. ` +
        `Сначала переназначьте или удалите эти приемы.`,
      );
    }

    await this.wardRepository.delete(id);
    return { message: `Палата с ID ${id} успешно удалена` };
  }

  async findAllWithCombines() {
    return this.wardRepository.query(`
      SELECT 
        wa.ward_id,
        wa.ward_number::text,
        dep.department_id::text,
        dep.department_name,
        doc.doctor_id::text,
        doc.full_name as doctor_full_name,
        COUNT(pat.patient_id)::text as patient_count
      FROM ward wa
      LEFT JOIN department dep ON wa.department_id = dep.department_id
      LEFT JOIN doctor doc ON wa.doctor_id = doc.doctor_id
      LEFT JOIN appointment app ON wa.ward_id = app.ward_id
      LEFT JOIN patient pat ON app.patient_id = pat.patient_id
      GROUP BY wa.ward_id, dep.department_id, doc.doctor_id
      ORDER BY wa.ward_number ASC
    `);
  }
}