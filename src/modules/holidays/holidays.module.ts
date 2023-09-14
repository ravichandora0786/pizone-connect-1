/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { HolidaysController } from './holidays.controller';
// import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HolidaysSchema } from './entities/holiday.entity';
// import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    // AuthModule,
    // UsersModule,
    MongooseModule.forFeature([{ name: 'Holiday', schema: HolidaysSchema }]),
  ],
  controllers: [HolidaysController],
  providers: [HolidaysService],
  exports: [HolidaysService],
})
export class HolidaysModule {}
