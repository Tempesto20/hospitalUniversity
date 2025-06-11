import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospitalization } from '../../hospitalization/hospitalization.entity';
import { Ward } from '../../ward/ward.entity';
import { WardsStayController } from './wards-stay.controller';
import { WardsStayService } from './wards-stay.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospitalization, Ward])],
  controllers: [WardsStayController],
  providers: [WardsStayService],
})
export class WardsStayModule {}