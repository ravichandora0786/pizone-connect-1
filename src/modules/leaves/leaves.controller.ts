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
  Req,
  Query,
} from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeavesDto } from './dto/create-leaves.dto';
import { UpdateLeavesDto } from './dto/update-leaves.dto';
import { AccessTokenGuard } from 'src/common/guard/acessToken.guard';
import { Leaves } from './schema/leaves.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';

@UseGuards(AccessTokenGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  /**
   * create a leave of user
   * @param createLeavesDto
   * @param req
   * @returns
   */
  @Post()
  async create(
    @Body() createLeavesDto: CreateLeavesDto,
    @Req() req,
  ): Promise<Leaves> {
    return this.leavesService.create(createLeavesDto, req.user);
  }

  /**
   * find all user leaves
   * @param query
   * @returns
   */
  @Get()
  async findAll(@Query() query: ExpressQuery, @Req() req): Promise<Leaves[]> {
    return this.leavesService.findAll(query, req.user);
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
  ): Promise<Leaves> {
    return this.leavesService.findById(id);
  }

  /**
   * update leaves
   * @param id
   * @param updateLeavesDto
   * @returns
   */
  @Put(':id')
  async updateLeave(
    @Param('id')
    id: string,
    @Body()
    updateLeavesDto: UpdateLeavesDto,
  ): Promise<Leaves> {
    return this.leavesService.updateById(id, updateLeavesDto);
  }

  /**
   * delete a leave
   * @param id
   * @returns
   */
  @Delete(':id')
  async deleteBook(
    @Param('id')
    id: string,
  ): Promise<Leaves> {
    return this.leavesService.deleteById(id);
  }
}
