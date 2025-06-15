import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialtyModule } from './specialty/specialty.module';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { DepartmentModule } from './department/department.module';
import { WardModule } from './ward/ward.module';
import { AppointmentModule } from './appointment/appointment.module';
import { WardsStayModule } from './reports/wards-stay/wards-stay.module';
import { TopPatientsModule } from './reports/top-patients/top-patients.module';
import { ComplaintsModule } from './reports/complaints/complaints.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1',
      database: 'hospital',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),

    // добавляем модули на бэке, чтобы была возможность подключиться по api
    SpecialtyModule,
    DoctorModule,
    PatientModule,
    DepartmentModule,
    WardModule,
    AppointmentModule,
    WardsStayModule,
    TopPatientsModule,
    ComplaintsModule
  ],
})
export class AppModule {}