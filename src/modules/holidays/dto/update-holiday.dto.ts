/* eslint-disable prettier/prettier */
import {
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateHolidayDto {
    @IsOptional()
    @IsString()
     title: string;

    @IsOptional()
    @IsString()
     date: string;

    @IsOptional()
    @IsString()
     image_url: string;

    // @IsOptional()
    // @IsString()
    //  created_at: string;

}
