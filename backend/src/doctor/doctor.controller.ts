import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctors')
@UsePipes(new ValidationPipe())
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  async findAll(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }
// ------------------------------------------------------------------------
  @Get('/with-specialties')
  async findAllWithSpecialties() {
    return this.doctorService.findAllWithSpecialties();
  }
// ------------------------------------------------------------------------
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Doctor> {
    return this.doctorService.findOne(id);
  }

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(createDoctorDto);
  }

  // @Put(':id')
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateDoctorDto: UpdateDoctorDto,
  // ): Promise<Doctor> {
  //   return this.doctorService.update(id, updateDoctorDto);
  // }

// В вашем NestJS контроллере
@Put(':id')
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateDoctorDto: UpdateDoctorDto,
): Promise<Doctor> {
  await this.doctorService.update(id, updateDoctorDto);
  return this.doctorService.findOne(id); // Возвращаем обновленного врача
}


  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.doctorService.delete(id);
  }
}