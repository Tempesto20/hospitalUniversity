// import { Controller, Get, Query } from '@nestjs/common';
// import { TopPatientsService } from './top-patients.service';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { TopPatientsReportDto } from './dto/top-patients-report.dto';


// @Controller('top-patients')
// export class TopPatientsController {
//   constructor(private readonly topPatientsService: TopPatientsService) {}

//   @Get()
//   @ApiOperation({ summary: 'Get top patients by specialty' })
//   @ApiResponse({ status: 200, type: [TopPatientsReportDto] })
//   async getTopPatientsBySpecialty(@Query('specialty') specialty?: string) {
//     return this.topPatientsService.getTopPatientsBySpecialty(specialty);
//   }

//   @Get('specialties')
//   @ApiOperation({ summary: 'Get all specialties for filter' })
//   @ApiResponse({ status: 200, type: [String] })
//   async getSpecialties() {
//     return this.topPatientsService.getSpecialties();
//   }
// }





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