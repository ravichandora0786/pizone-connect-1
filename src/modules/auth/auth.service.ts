/* eslint-disable prettier/prettier */
import { Injectable, ForbiddenException, BadRequestException,} from '@nestjs/common';
// import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { ERROR_CODES } from 'src/constant/index';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 
   * @param createUserDto 
   * @returns 
   */
  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const existingUser = await this.usersService.findByUserEmail(createUserDto.email);

    if (existingUser) {
      // throw new Error('Username already taken');
      const error = ERROR_CODES.USER_ALREADY;
      throw new BadRequestException(error.message);
    }

    const hashedPassword = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({ ...createUserDto , password: hashedPassword, });

        const tokens = await this.getTokens(newUser._id, newUser.email);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return newUser;
  }

/**
 * 
 * @param data
 * @returns login users
 */
async login(data: AuthDto ) {
    const user = await this.usersService.findByUserEmail(data.email);

    if (!user) {
      const error = ERROR_CODES.USER_NOT_FOUND;
      throw new BadRequestException(error.message);
    }

    const passwordMatch = await bcrypt.compare(data.password,user.password);

    if (!passwordMatch) {
      const error = ERROR_CODES.WROND_PASSWORD;
      throw new BadRequestException(error.message);
    }
    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, tokens.refreshToken);

    return { user, tokens };
  }

  /**
   * 
   * @param userId 
   * @returns logout user
   */
  async logout(userId: string) {
     await this.usersService.update(userId, { refreshToken: null });
     
  }

  /**
   * 
   * @param userId 
   * @param refreshToken 
   * @returns refresh tokens
   */
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken, user.refreshToken
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * 
   * @param data 
   * @returns convert into bcrypt data
   */
  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  /**
   * 
   * @param userId 
   * @param refreshToken 
   * @returns update tokens
   */
  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  /**
   * 
   * @param userId 
   * @param email 
   * @returns create access and refresh tokens
   */
  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '5h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '1d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

}
