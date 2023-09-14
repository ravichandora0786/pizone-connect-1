/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_CODES } from 'src/constant/index';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  /**
   *  Get user by email id
   * @param email
   * @returns
   */
  async findByUserEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  /**
   * update user by email id
   * @param id
   * @param updateUserDto
   * @returns
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  /**
   * find all users
   * @returns
   */
  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select('-password').exec();
  }

  /**
   * user find by object id
   * @param id
   * @returns
   */
  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).select('-password').exec();
  }

  /**
   * delete user from darabase by id
   * @param id
   * @returns
   */
  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  /**
   * find login user data
   * @param user 
   * @returns 
   */
  async findProfile(user: any): Promise<UserDocument> {
    const userId = user.sub;
    console.log(userId);
    
    const isValidId = mongoose.isValidObjectId(userId);

    if (!isValidId) {
      const error = ERROR_CODES.WROND_ID;
      throw new BadRequestException(error.message);
    }

    const userdata = await this.userModel.findById(userId).select('-password').exec();

    if (!userdata) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new NotFoundException(error.message);
    }

    return userdata;
  }
}
