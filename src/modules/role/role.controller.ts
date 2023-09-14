/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AccessTokenGuard } from 'src/common/guard/acessToken.guard';
import { Role } from './schema/role.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';

@UseGuards(AccessTokenGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * create a role
   * @param createRoleDto
   * @returns
   */
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  /**
   * find all role
   * @param query
   * @returns
   */
  @Get()
  async findAll(@Query() query: ExpressQuery): Promise<Role[]> {
    return this.roleService.findAll(query);
  }

  /**
   * find role by role-id
   * @param id
   * @returns
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.roleService.findOne(id);
  }

  /**
   * Delete role
   * @param id
   * @returns
   */
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Role> {
    return this.roleService.remove(id);
  }
}
