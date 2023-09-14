/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkFromHomeService } from './work_from_home.service';
import { WorkFromHomeController } from './work_from_home.controller';
import { WorkFromHomeSchema } from './schema/work_from_home.schema';
import { HolidaysModule } from '../holidays/holidays.module';
// import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // AuthModule,
    HolidaysModule,
    MongooseModule.forFeature([
      { name: 'WorkFromHome', schema: WorkFromHomeSchema },
    ]),
  ],
  controllers: [WorkFromHomeController],
  providers: [WorkFromHomeService],
})
export class WorkFromHomeModule {}
