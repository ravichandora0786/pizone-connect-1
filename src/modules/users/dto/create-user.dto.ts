/* eslint-disable prettier/prettier */
// import { Exclude, Expose } from 'class-transformer';

export class CreateUserDto {
  name: string;

  password: string;

  email: string;
  emp_id: number;
  role_id: number;
  contact: string;
  fcm_token: string;
  created_at: string;
  updated_at: string;
  gender: string;
  designation: string;
  date_of_joining: string;
  department: string;
  technology: string;
  reporting_manager: string;
  date_of_leaving: string;
  reason: string;
  status: number;
  session_id: string;
  request_password_id: string;
  profile_picture: string;
  branch: number;
  refreshToken?: string;
}
