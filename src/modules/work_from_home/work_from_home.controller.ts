/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Req,
  Query,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkFromHomeService } from './work_from_home.service';
import { CreateWorkFromHomeDto } from './dto/create-work_from_home.dto';
import { UpdateWorkFromHomeDto } from './dto/update-work_from_home.dto';
import { WorkFromHome } from './schema/work_from_home.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AccessTokenGuard } from 'src/common/guard/acessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('work-from-home')
export class WorkFromHomeController {
  constructor(private readonly workFromHomeService: WorkFromHomeService) {}

  /**
   * create a leave of user
   * @param createWorkFromHomeDto
   * @param req
   * @returns
   */
  @Post()
  async create(
    @Body() createWorkFromHomeDto: CreateWorkFromHomeDto,
    @Req() req,
  ): Promise<WorkFromHome> {
    return this.workFromHomeService.create(createWorkFromHomeDto, req.user);
  }

  /**
   * find all user WorkFromHome
   * @param query
   * @returns
   */
  @Get()
  async findAll(
    @Query() query: ExpressQuery,
    @Req() req,
  ): Promise<WorkFromHome[]> {
    return this.workFromHomeService.findAll(query, req.user);
  }

  /**
   * get user by id
   * @param id
   * @returns
   */
  @Get(':id')
  async getleave(
    @Param('id')
    id: string,
  ): Promise<WorkFromHome> {
    return this.workFromHomeService.findById(id);
  }

  /**
   * update WorkFromHome
   * @param id
   * @param updateWorkFromHomeDto
   * @returns
   */
  @Put(':id')
  async updateLeave(
    @Param('id')
    id: string,
    @Body()
    updateWorkFromHomeDto: UpdateWorkFromHomeDto,
  ): Promise<WorkFromHome> {
    return this.workFromHomeService.updateById(id, updateWorkFromHomeDto);
  }

  /**
   * delete a data
   * @param id
   * @returns
   */
  @Delete(':id')
  async deleteBook(
    @Param('id')
    id: string,
  ): Promise<WorkFromHome> {
    return this.workFromHomeService.deleteById(id);
  }
}
