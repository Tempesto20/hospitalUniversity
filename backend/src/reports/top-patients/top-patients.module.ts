import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../../appointment/appointment.entity';
import { Specialty } from '../../specialty/specialty.entity';
import { TopPatientsController } from './top-patients.controller';
import { TopPatientsService } from './top-patients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Specialty])],
  controllers: [TopPatientsController],
  providers: [TopPatientsService],
})
export class TopPatientsModule {}