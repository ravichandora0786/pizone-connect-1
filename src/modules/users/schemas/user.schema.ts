/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document{
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, default: '' })
  password: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ default: '' })
  emp_id: number;

  @Prop({ default: '' })
  role_id: number;

  @Prop({ required: true, default: '' })
  contact: string;

  @Prop({ default: '' })
  fcm_token: string;

  @Prop({ default: '' })
  created_at: string;

  @Prop({ default: '' })
  updated_at: string;

  @Prop({ required: true, default: '' })
  gender: string;

  @Prop({ default: '' })
  designation: string;

  @Prop({ required: true, default: '' })
  date_of_joining: string;

  @Prop({ default: '' })
  department: string;

  @Prop({ default: '' })
  technology: string;

  @Prop({ default: '' })
  reporting_manager: string;

  @Prop({ default: '' })
  date_of_leaving: string;

  @Prop({ default: '' })
  reason: string;

  @Prop({ default: '' })
  status: number;

  @Prop({ default: '' })
  session_id: string;

  @Prop({ default: '' })
  request_password_id: string;

  @Prop({ default: '' })
  profile_picture: string;

  @Prop({ default: '' })
  branch: number;

  @Prop()
  refreshToken: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
