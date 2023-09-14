/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './schema/role.schema';
import { Query } from 'express-serve-static-core';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private RoleModel: mongoose.Model<Role>,
  ) {}

  /**
   * create role
   * @param roledata
   * @returns
   */
  async create(roledata: CreateRoleDto): Promise<Role> {
    const data = Object.assign(roledata);
    const res = await this.RoleModel.create(data);
    return res;
  }

  /**
   * find all role
   * @param query
   * @returns
   */
  async findAll(query: Query): Promise<Role[]> {
    const resPerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const role = await this.RoleModel.find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return role;
  }

  /**
   * find role by role-id
   * @param id
   * @returns
   */
  async findOne(id: string): Promise<Role> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }

    const role = await this.RoleModel.findById(id);

    if (!role) {
      throw new NotFoundException('Role not found.');
    }

    return role;
  }

  /**
   * delete role by role-id
   * @param id
   * @returns
   */
  async remove(id: string): Promise<Role> {
    return await this.RoleModel.findByIdAndDelete(id);
  }
}
