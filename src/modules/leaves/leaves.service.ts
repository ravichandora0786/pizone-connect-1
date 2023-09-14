/* eslint-disable prettier/prettier */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeavesDto } from './dto/create-leaves.dto';
import { UpdateLeavesDto } from './dto/update-leaves.dto';
import { Query } from 'express-serve-static-core';
import { Leaves } from './schema/leaves.schema';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ERROR_CODES } from 'src/constant/index';
import { HolidaysService } from '../holidays/holidays.service';

@Injectable()
export class LeavesService {
  constructor(
    @InjectModel(Leaves.name)
    private LeavesModel: mongoose.Model<Leaves>,
    private holidayService: HolidaysService,
  ) {}

  /**
   * find all leaves
   * @param query
   * @returns
   */
  async findAll(query: Query, user: any): Promise<Leaves[]> {
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

    const leaves = await this.LeavesModel.find(filter)
      .limit(resPerPage)
      .skip(skip);
    return leaves;
  }

  /**
   * create a leave by user
   * @param leavesData
   * @param user
   * @returns
   */
  async create(leavesData: CreateLeavesDto, user: any): Promise<Leaves> {
    const { from_date, to_date, type } = leavesData;
  
    // Check if from_date is before to_date
    if (from_date > to_date) {
      const error = ERROR_CODES.INVALID_DATE_RANGE;
      throw new BadRequestException(error.message);
    }
  
    // Find any existing leave requests that overlap with the new request
    const existingLeave = await this.LeavesModel.findOne({
      user_id: user.sub,
      $or: [
        {
          from_date: { $lte: to_date },
          to_date: { $gte: from_date },
        },
      ],
    }).exec();
  
    if (existingLeave) {
      const error = ERROR_CODES.EXISTING_LEAVE;
      throw new BadRequestException(error.message);
    }


    // Calculate the leave days using the helper function
    const leaveDays = await this.calculateLeaveDays(from_date, to_date, type);
  
    const data = Object.assign(leavesData, {
      user_id: user.sub,
      total_days: leaveDays,
    });
  
    const res = await this.LeavesModel.create(data);
    return res;
  }
  
  /**
   * calculate all leave days
   * @param fromDate 
   * @param toDate 
   * @param type 
   * @param holidayDates 
   * @returns 
   */
async calculateLeaveDays(fromDateString: Date, toDateString: Date, type: number): Promise<number> {
  const fromDate = new Date(fromDateString);
  const toDate = new Date(toDateString);

  const holidayDates = await this.holidayService.findAll({});
    let leaveDays = 0;
    while (fromDate <= toDate) {
      // Check if the current date (fromDate) is not a Saturday (6) or Sunday (0) and not a holiday
      if (
        fromDate.getDay() !== 6 &&
        fromDate.getDay() !== 0 &&
        !holidayDates.some(
          (holidayDate) =>
            holidayDate.date.toDateString() === fromDate.toDateString(),
        )
      ) {
        leaveDays += 1;
      }
      fromDate.setDate(fromDate.getDate() + 1);
    }
  
    if (type === 1){} 
    else if (type === 2) {leaveDays = leaveDays * 0.5; }
  
    return leaveDays;
  }
  



  /**
   * leaves find by id
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Leaves> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      const error = ERROR_CODES.WROND_ID;
      throw new BadRequestException(error.message);
    }

    const leaves = await this.LeavesModel.findById(id);

    if (!leaves) {  
      const error = ERROR_CODES.LEAVES_NOT_FOUND;
      throw new NotFoundException(error.message);
    }

    return leaves;
  }

  /**
   * update a leave
   * @param id
   * @param leaves
   * @returns
   */
  async updateById(id: string, leaves: UpdateLeavesDto): Promise<Leaves> {
    return await this.LeavesModel.findByIdAndUpdate(id, leaves, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * delete a leave
   * @param id
   * @returns
   */
  async deleteById(id: string): Promise<Leaves> {
    return await this.LeavesModel.findByIdAndDelete(id);
  }

  /**
   * find all leaves of user
   * @param user 
   * @returns 
   */
  async findAllLeavesByUser(
    user: any,
  ): Promise<{ leaves: Leaves[]; allDates: Date[]; totalDays: number }> {
    const startDate = '2023-09-29';
    const endDate = '2023-10-10';
  
    const leavesData = await this.LeavesModel.find({
      user_id: user.sub,
      from_date: { $gte: startDate },
      to_date: { $lte: endDate },
    })
      .sort({ from_date: 'asc' })
      .select({
        from_date: 1,
        to_date: 1,
        total_days: 1,
        _id: 0,
      })
      .exec();
  
    // Calculate the total_days for all leaves
    const totalDays = leavesData.reduce(
      (total, leave) => total + leave.total_days,
      0,
    );
  
    // Extract all individual dates from leaves within the specified date range
    const allDates = this.getAllDatesFromLeaves(leavesData);
  
    return { leaves: leavesData, totalDays, allDates };
  }
  
  private getAllDatesFromLeaves(leavesData: Leaves[]): Date[] {
    const allDates= [];
  
    leavesData.forEach((leave) => {
      const fromDate = new Date(leave.from_date);
      const toDate = new Date(leave.to_date);
      const currentDate = new Date(fromDate);
      while (currentDate <= toDate) {
        allDates.push(new Date(currentDate).toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
  
    return allDates;
  }
  
}
