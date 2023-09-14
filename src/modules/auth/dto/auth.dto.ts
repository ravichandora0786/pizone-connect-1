/* eslint-disable prettier/prettier */

import { IsString } from "class-validator";


/**
 * login user data
 */
export class AuthDto {

  @IsString()
  email: string;

  @IsString()
  password: string;
}
