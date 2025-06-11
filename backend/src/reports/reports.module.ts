import { Module } from '@nestjs/common';
import { ComplaintsModule } from './complaints/complaints.module';
import { TopPatientsModule } from './top-patients/top-patients.module';
import { WardsStayModule } from './wards-stay/wards-stay.module';

@Module({
  imports: [ComplaintsModule, TopPatientsModule, WardsStayModule],
  exports: [ComplaintsModule, TopPatientsModule, WardsStayModule],
})
export class ReportsModule {}