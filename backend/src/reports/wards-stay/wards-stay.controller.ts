// import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
// import { WardsStayService } from './wards-stay.service';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { WardsStayReportDto } from './dto/wards-stay-report.dto';


// @Controller('reports')
// @UsePipes(new ValidationPipe())
// export class WardsStayController {
//   constructor(private readonly wardsStayService: WardsStayService) {}

//   @Get('/wards-stay')
//   @ApiOperation({ summary: 'Get wards by stay duration' })
//   @ApiResponse({ status: 200, type: [WardsStayReportDto] })
//   async getWardsWithPatients(@Query('max_days') maxDays = '30') {
//     return this.wardsStayService.getWardsWithPatients(parseInt(maxDays));
//   }
// }







// import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
// import { WardsStayService } from './wards-stay.service';
// import { WardsStayReportDto } from './dto/wards-stay-report.dto';

// @Controller('reports')
// export class WardsStayController {
//   constructor(private readonly wardsStayService: WardsStayService) {}

//   @Get('wards-stay')
//   async getWardsWithPatients(
//     @Query('max_days', new ParseIntPipe()) maxDays: number
//   ): Promise<WardsStayReportDto[]> {
//     return this.wardsStayService.getWardsWithPatients(maxDays);
//   }
// }


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











// ______________________________________________________________________________________

// import { Controller, Get, Query, Post, Body, Param, Put, Delete, ParseIntPipe, UsePipes, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
// import { WardsStayService } from './wards-stay.service';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { WardsStayReportDto } from './dto/wards-stay-report.dto';

// @Controller('reports')
// @UsePipes(new ValidationPipe())
// export class WardsStayController {
//   constructor(private readonly wardsStayService: WardsStayService) {}

//   // @Get()
//   // async findAll(): Promise<Patient[]> {
//   //   return this.patientService.findAll();
//   // }
  
// // ------------------------------------------------------------------------
//   @Get('/wards-stay')
//   // @ApiResponse({ status: 200, type: [WardsStayReportDto] })
//   async getWardsWithPatients(@Query('max_days') maxDays = '30') {
//     return this.wardsStayService.getWardsWithPatients(parseInt(maxDays));
//   }
//   }
// // ------------------------------------------------------------------------


// import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
// import { WardsStayService } from './wards-stay.service';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { WardsStayReportDto } from './dto/wards-stay-report.dto';

// @Controller('reports')
// @UsePipes(new ValidationPipe())
// export class WardsStayController {
//   constructor(private readonly wardsStayService: WardsStayService) {}

//   @Get('/wards-stay')
//   @ApiOperation({ summary: 'Get wards by stay duration' })
//   @ApiResponse({ status: 200, type: [WardsStayReportDto] })
//   async getWardsWithPatients(@Query('max_days') maxDays = '30'): Promise<WardsStayReportDto[]> {
//     return this.wardsStayService.getWardsWithPatients(parseInt(maxDays));
//   }
// }





// import { 
//   Controller, 
//   Get, 
//   Query, 
//   UsePipes, 
//   ValidationPipe,
//   ParseIntPipe,
//   DefaultValuePipe,
//   HttpCode,
//   HttpStatus 
// } from '@nestjs/common';
// import { WardsStayService } from './wards-stay.service';
// import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
// import { WardsStayReportDto } from './dto/wards-stay-report.dto';

// @ApiTags('Reports')
// @Controller('reports')
// export class WardsStayController {
//   constructor(private readonly wardsStayService: WardsStayService) {}

//   @Get('wards-stay')
//   @ApiOperation({ summary: 'Get wards by stay duration' })
//   @ApiQuery({ 
//     name: 'max_days', 
//     required: false,
//     type: Number,
//     example: 30,
//     description: 'Maximum stay duration in days' 
//   })
//   @ApiResponse({ 
//     status: 200, 
//     description: 'Successful operation',
//     type: [WardsStayReportDto]
//   })
//   @HttpCode(HttpStatus.OK)
//   @UsePipes(new ValidationPipe({ transform: true }))
//   async getWardsWithPatients(
//     @Query('max_days', new DefaultValuePipe(30), ParseIntPipe) maxDays: number
//   ) {
//     return this.wardsStayService.getWardsWithPatients(maxDays);
//   }
// }









// import { Controller, Get } from '@nestjs/common';

// @Controller('reports')
// export class WardsStayController {
//   @Get('wards-stay')
//   getTestData() {
//     return [
//       {
//         ward_number: "101",
//         patient_name: "Тестовый пациент",
//         admission_date: "2023-01-01",
//         discharge_date: "2023-01-10",
//         stay_days: 9
//       }
//     ];
//   }
// }




// Для тестов
// import { Controller, Get } from '@nestjs/common';

// @Controller() // Без префикса!
// export class WardsStayController {
//   @Get('wards-stay') // Прямой путь
//   getTestData() {
//     return [{
//       ward_number: "TEST-101",
//       patient_name: "Тестовый пациент",
//       admission_date: "2023-01-01",
//       discharge_date: "2023-01-05",
//       stay_days: 4
//     }];
//   }
// }