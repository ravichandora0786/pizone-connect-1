/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  HttpStatus,
  Res,
  ValidationPipe
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
// import { AccessTokenGuard } from 'src/common/guard/acessToken.guard';
import { RefreshTokenGuard } from '../../common/guard/refreshToken.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from 'src/common/guard/acessToken.guard';

@Controller('auth')
// @UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}
/**
 * 
 * @param createUserDto 
 * @param res 
 * @returns user
 */
  @Post('signup')
  async signup(@Body(ValidationPipe) createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.authService.signUp(createUserDto);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Signup successful', user });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

/**
 * 
 * @param data 
 * @param res 
 * @returns user, tokens
 */

  @Post('login')
  async login(
    @Body() data: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user, tokens } = await this.authService.login(data);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Login successful', user, tokens });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }
  /**
   * 
   * @param req 
   * @param res 
   * @returns msg
   */
  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response,) {
    try {
        await this.authService.logout(req.user['sub']);
      
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Logout successful'});
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message });
    }
  }

 /**
  * 
  * @param req 
  * @returns refresh tokens
  */

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return await this.authService.refreshTokens(userId, refreshToken);
  }
}
