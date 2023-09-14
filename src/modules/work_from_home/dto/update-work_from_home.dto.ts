/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkFromHomeDto } from './create-work_from_home.dto';

export class UpdateWorkFromHomeDto extends PartialType(CreateWorkFromHomeDto) {}
