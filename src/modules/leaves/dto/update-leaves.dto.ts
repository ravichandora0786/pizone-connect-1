/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateLeavesDto } from './create-leaves.dto';

export class UpdateLeavesDto extends PartialType(CreateLeavesDto) {}
