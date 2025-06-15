import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../../patient/patient.entity';
import { WardsStayService } from './wards-stay.service';
import { WardsStayController } from './wards-stay.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [WardsStayController],
  providers: [WardsStayService],
})
export class WardsStayModule {}