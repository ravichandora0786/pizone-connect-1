/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { configModule } from './config/config.module';
import { HolidaysModule } from './modules/holidays/holidays.module';
import { RoleModule } from './modules/role/role.module';
import { LeavesModule } from './modules/leaves/leaves.module';
import { WorkFromHomeModule } from './modules/work_from_home/work_from_home.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UsersModule,
    configModule,
    HolidaysModule,
    RoleModule,
    LeavesModule,
    WorkFromHomeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
