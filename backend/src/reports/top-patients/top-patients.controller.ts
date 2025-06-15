import { Controller, Get, Query } from '@nestjs/common';
import { TopPatientsService } from './top-patients.service';
import { TopPatientsReportDto } from './dto/top-patients-report.dto';

@Controller('top-patients')
export class TopPatientsController {
  constructor(private readonly topPatientsService: TopPatientsService) {}

  @Get()
  getTopPatientsBySpecialty(
    @Query('specialty') specialty?: string,
  ): Promise<TopPatientsReportDto[]> {
    return this.topPatientsService.getTopPatientsBySpecialty(specialty);
  }

  @Get('specialties')
  getSpecialties(): Promise<string[]> {
    return this.topPatientsService.getSpecialties();
  }
}