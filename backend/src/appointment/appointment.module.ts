import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { Patient } from '../patient/patient.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Ward } from '../ward/ward.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PatientModule } from '../patient/patient.module';
import { DoctorModule } from '../doctor/doctor.module';
import { WardModule } from '../ward/ward.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Patient, Doctor, Ward]),
    PatientModule,
    DoctorModule,
    WardModule,
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}