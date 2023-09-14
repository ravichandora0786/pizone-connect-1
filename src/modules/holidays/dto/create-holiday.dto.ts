/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';
// import { Date } from 'mongoose';

export class CreateHolidayDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
   date: Date;

  @IsNotEmpty()
  @IsString()
   image_url: string;

//   @IsNotEmpty()
//   @IsString()
//    created_at: string;

}
