import { Controller, Get, Query } from '@nestjs/common';
import { WardsStayService } from './wards-stay.service';
import { WardsStayDto } from './dto/wards-stay-report.dto';

@Controller('wards-stay')
export class WardsStayController {
  constructor(private readonly wardsStayService: WardsStayService) {}

  @Get()
  async getPatientsWithWardsInfo(
    @Query('maxDays') maxDays?: number,
  ): Promise<WardsStayDto[]> {
    return this.wardsStayService.getPatientsWithWardsInfo(
      maxDays ? Number(maxDays) : undefined,
    );
  }
}
