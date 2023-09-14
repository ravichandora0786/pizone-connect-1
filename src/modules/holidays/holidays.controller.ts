/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
// import { AuthGuard } from '@nestjs/passport';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Holiday } from './entities/holiday.entity';
import { AccessTokenGuard } from 'src/common/guard/acessToken.guard';


@UseGuards(AccessTokenGuard)
@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) { }

  /**
   * create a holiday
   * @param createHolidayDto
   * @returns 
   */
  @Post()
  async create(@Body() createHolidayDto: CreateHolidayDto): Promise<Holiday> {
    return this.holidaysService.create(createHolidayDto);
  }

  /**
   * find all holidays of user
   * @param query 
   * @returns 
   */
  @Get()
  async findAll(@Query() query: ExpressQuery): Promise<Holiday[]> {
    return this.holidaysService.findAll(query);
  }

  /**
   * find a holiday of user by holiday-id
   * @param id 
   * @returns 
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Holiday> {
    return this.holidaysService.findById(id);
  }

  /**
   * update a holiday of user by holiday-id
   * @param id 
   * @param updateHolidayDto 
   * @returns 
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateHolidayDto: UpdateHolidayDto): Promise<Holiday> {
    return this.holidaysService.updateById(id, updateHolidayDto);
  }

  /**
   * delete a holiday of user by holiday-id
   * @param id 
   * @returns 
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Holiday> {
    return this.holidaysService.deleteById(id);
  }
}
