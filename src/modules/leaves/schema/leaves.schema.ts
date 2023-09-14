/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class Leaves extends mongoose.Document {
  @Prop({ required: true, default: '' })
  purpose: string;

  @Prop({ required: true, default: '' })
  subject: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: User;

  @Prop({ required: true, default: '', type: Number })
  type: number;

  @Prop({ default: '' })
  reason: string;

  @Prop({ default: '' })
  desc: string;

  @Prop({ default: '', required: true, type: Date })
  from_date: Date;

  @Prop({ default: '', required: true, type: Date })
  to_date: Date;

  @Prop({ required: true, default: '0.0', type: Number })
  total_days: number;

  @Prop({ default: '' })
  status: string;

  @Prop({ default: '' })
  status_changed_by: string;
}

export const LeavesSchema = SchemaFactory.createForClass(Leaves);
