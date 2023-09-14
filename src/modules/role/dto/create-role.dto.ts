/* eslint-disable prettier/prettier */
import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';

export class CreateRoleDto {

    @IsNotEmpty()
    @IsString()
    role_name: string;
  
    @IsNotEmpty()
    @IsString()
     created_at: string;
}
