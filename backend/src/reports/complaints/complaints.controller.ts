import { Controller, Get, Query } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { ComplaintsReportDto } from './dto/complaints-report.dto';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Get()
  async getComplaintsStatistics(
    @Query('keyword') keyword?: string,
  ): Promise<ComplaintsReportDto[]> {
    return this.complaintsService.getComplaintsStatistics(keyword);
  }
}