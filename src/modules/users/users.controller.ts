/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/common/guard/acessToken.guard';
import { LeavesService } from '../leaves/leaves.service';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly leaveService: LeavesService,
    ) { }


  /**
   * find all user
   * @returns
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  /**
   * find login user data
   * @param req 
   * @returns 
  */
 @Get('/profile')
 finduserprofile(@Req() req,) {
   return this.usersService.findProfile(req.user);
  }
  
  /**
   * find user by object id
   * @param id
   * @returns
   */
  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
  /**
   * update user by id
   * @param id
   * @param updateUserDto
   * @returns
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * delete user by id
   * @param id
   * @returns
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('/all/leave')
  async findAllLeavesByUser(@Req() req,) {
    return this.leaveService.findAllLeavesByUser(req.user);
  }
}
