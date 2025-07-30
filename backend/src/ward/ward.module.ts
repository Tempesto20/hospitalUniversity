import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ward } from './ward.entity';
import { WardService } from './ward.service';
import { WardController } from './ward.controller';
import { Department } from '../department/department.entity';
import { Doctor } from '../doctor/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ward, Department, Doctor]), // Добавляем все необходимые сущности
  ],
  providers: [WardService],
  controllers: [WardController],
  exports: [WardService],
})
export class WardModule {}