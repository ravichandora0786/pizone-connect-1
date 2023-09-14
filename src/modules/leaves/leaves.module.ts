/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { LeavesController } from './leaves.controller';
// import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { LeavesSchema } from './schema/leaves.schema';
import { HolidaysModule } from '../holidays/holidays.module';

@Module({
  imports: [
    // AuthModule,
    HolidaysModule,
    MongooseModule.forFeature([{ name: 'Leaves', schema: LeavesSchema }]),
  ],
  controllers: [LeavesController],
  providers: [LeavesService],
  exports: [LeavesService]
})
export class LeavesModule {}
