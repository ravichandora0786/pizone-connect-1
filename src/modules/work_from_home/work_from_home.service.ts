/* eslint-disable prettier/prettier */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Query } from 'express-serve-static-core';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ERROR_CODES } from 'src/constant/index';
import { CreateWorkFromHomeDto } from './dto/create-work_from_home.dto';
import { UpdateWorkFromHomeDto } from './dto/update-work_from_home.dto';
import { WorkFromHome } from './schema/work_from_home.schema';
import { HolidaysService } from '../holidays/holidays.service';

@Injectable()
export class WorkFromHomeService {
  constructor(
    @InjectModel(WorkFromHome.name,)
    private WorkFromHomeModel: mongoose.Model<WorkFromHome>,
    private holidayService: HolidaysService,
  ) {}


  /**
   * find all WorkFromHome
   * @param query 
   * @returns 
   */
  async findAll(query: Query, user: any): Promise<WorkFromHome[]> {

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

   // Filter by user_id
  const filter = {
    ...keyword,
    user_id: user.sub,
  };

    const WorkFromHome = await this.WorkFromHomeModel.find(filter)
      .limit(resPerPage)
      .skip(skip);
    return WorkFromHome;
  }

  /**
   * create a WorkFromHome by user
   * @param WorkFromHomeData 
   * @param user 
   * @returns 
   */
  async create(workFromHomeData: CreateWorkFromHomeDto, user: any): Promise<WorkFromHome> {
    const { from_date, to_date, type } = workFromHomeData;
  
    // Check if from_date is before to_date
    if (from_date > to_date) {
      const error = ERROR_CODES.INVALID_DATE_RANGE;
      throw new BadRequestException(error.message);
    }
  
    // Find any existing leave requests that overlap with the new request
    const existingLeave = await this.WorkFromHomeModel.findOne({
      user_id: user.sub,
      $or: [
        {
          from_date: { $lte: to_date },
          to_date: { $gte: from_date },
        },
      ],
    }).exec();
  
    if (existingLeave) {
      const error = ERROR_CODES.EXISTING_WORK;
      throw new BadRequestException(error.message);
    }
  
// Define your list of holiday dates 
    const holidayDates = await this.holidayService.findAll({});

    
    
// Calculate the number of leave days excluding weekends and holidays
    const fromDate = new Date(workFromHomeData.from_date);
    const toDate = new Date(workFromHomeData.to_date);
  
    let leaveDays = 0;
    while (fromDate <= toDate) {

      if (
        fromDate.getDay() !== 6 &&
        fromDate.getDay() !== 0 &&
        !holidayDates.some((holidayDate) => holidayDate.date.toDateString() === fromDate.toDateString())
      ) {
        leaveDays += 1;
      }
      fromDate.setDate(fromDate.getDate() + 1); // Move to the next day
    }
  
    // Apply type-specific leave calculations if needed
    if (type === 1) {
      // Full days
    } else if (type === 2) {
      // Half days
      leaveDays = leaveDays * 0.5;
    }
  
    const data = Object.assign(workFromHomeData, {
      user_id: user.sub,
      total_days: leaveDays,
    });
  
    const res = await this.WorkFromHomeModel.create(data);
    return res;
  }

  /**
   * WorkFromHome find by id
   * @param id
   * @returns
   */
  async findById(id: string): Promise<WorkFromHome> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      const error = ERROR_CODES.WROND_ID;
      throw new BadRequestException(error.message);
    }

    const WorkFromHome = await this.WorkFromHomeModel.findById(id);

    if (!WorkFromHome) {
      const error = ERROR_CODES.WORK_FORM_HOME_NOT_FOUND;
      throw new NotFoundException(error.message);
    }

    return WorkFromHome;
  }

  /**
   * update a WorkFromHome
   * @param id 
   * @param WorkFromHome 
   * @returns 
   */
  async updateById(id: string, WorkFromHome: UpdateWorkFromHomeDto): Promise<WorkFromHome> {
    return await this.WorkFromHomeModel.findByIdAndUpdate(id, WorkFromHome, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * delete a WorkFromHome
   * @param id 
   * @returns 
   */
  async deleteById(id: string): Promise<WorkFromHome> {
    return await this.WorkFromHomeModel.findByIdAndDelete(id);
  }
}
