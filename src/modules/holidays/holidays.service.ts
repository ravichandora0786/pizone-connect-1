/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { CreateHolidayDto } from './dto/create-holiday.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Holiday } from './entities/holiday.entity';
import { Query } from 'express-serve-static-core';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { ERROR_CODES } from 'src/constant/index';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectModel(Holiday.name) private HolidayModel: mongoose.Model<Holiday>) {}


    /**
     * create a holiday
     * @param holiday 
     * @returns 
     */
  async create(holiday: CreateHolidayDto): Promise<Holiday> {

    const data = Object.assign(holiday);
    const res = await this.HolidayModel.create(data);
    return res;

  }

/**
 * find all holidays
 * @param query
 * @returns 
 */
  async findAll(query: Query): Promise<Holiday[]> {
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

    const Holidays = await this.HolidayModel.find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return Holidays;
  }


  /**
   * find a holiday by holiday-id
   * @param id
   * @returns 
   */
  async findById(id: string): Promise<Holiday> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      const error = ERROR_CODES.WROND_ID;
      throw new BadRequestException(error.message);    }

    const holiday = await this.HolidayModel.findById(id);

    if (!holiday) {
      const error = ERROR_CODES.HOLIDAY_NOT_FOUND;
      throw new NotFoundException(error.message);
    }

    return holiday;
  }


  /**
   * update a holiday by holiday-id
   * @param id 
   * @param holiday 
   * @returns 
   */
  async updateById(id: string, holiday: UpdateHolidayDto): Promise<Holiday> {
    return await this.HolidayModel.findByIdAndUpdate(id, holiday, {
      new: true,
      runValidators: true,
    });
  }


  /**
   * delete a holiday by id
   * @param id 
   * @returns 
   */
  async deleteById(id: string): Promise<Holiday> {
    return await this.HolidayModel.findByIdAndDelete(id);
  }
}
