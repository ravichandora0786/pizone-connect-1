/* eslint-disable prettier/prettier */
import { IsDate, IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/modules/users/schemas/user.schema';

export class CreateWorkFromHomeDto {
  @IsEmpty({ message: 'You cannot pass user id' })
  user_id: User;

  @IsNotEmpty()
  @IsString()
  subject: string;

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
  from_date: string;

  @IsNotEmpty()
  @IsDate()
  to_date: string;

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
