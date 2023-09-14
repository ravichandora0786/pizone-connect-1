/* eslint-disable prettier/prettier */
import { IsDate, IsEmpty, IsNotEmpty, IsString } from "class-validator";
import { User } from "src/modules/users/schemas/user.schema";

export class CreateLeavesDto {

  @IsNotEmpty()
  @IsString()
  purpose: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsEmpty({ message: 'You cannot pass user id' })
  user_id: User;

  @IsNotEmpty()
  @IsString()
  type: number;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsNotEmpty()
  @IsDate()
  from_date: Date;

  @IsNotEmpty()
  @IsDate()
  to_date: Date;

  @IsNotEmpty()
  @IsString()
  total_days: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  status_changed_by: string;
}
