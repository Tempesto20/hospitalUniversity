import { Controller, Get, Query } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ComplaintsReportDto } from './dto/complaints-report.dto';

@ApiTags('Reports')
@Controller('api/reports/complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Get()
  @ApiOperation({ summary: 'Get average patients by complaint' })
  @ApiResponse({ status: 200, type: [ComplaintsReportDto] })
  async getAveragePatientsByComplaint(
    @Query('keyword') keyword?: string,
    @Query('month') month?: string,
  ) {
    return this.complaintsService.getAveragePatientsByComplaint(keyword, month);
  }
}