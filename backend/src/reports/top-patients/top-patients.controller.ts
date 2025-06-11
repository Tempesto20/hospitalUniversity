import { Controller, Get, Query } from '@nestjs/common';
import { TopPatientsService } from './top-patients.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TopPatientsReportDto } from './dto/top-patients-report.dto';

@ApiTags('Reports')
@Controller('api/reports/top-patients')
export class TopPatientsController {
  constructor(private readonly topPatientsService: TopPatientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get top patients by specialty' })
  @ApiResponse({ status: 200, type: [TopPatientsReportDto] })
  async getTopPatientsBySpecialty(@Query('specialty') specialty?: string) {
    return this.topPatientsService.getTopPatientsBySpecialty(specialty);
  }

  @Get('specialties')
  @ApiOperation({ summary: 'Get all specialties for filter' })
  @ApiResponse({ status: 200, type: [String] })
  async getSpecialties() {
    return this.topPatientsService.getSpecialties();
  }
}