/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
// import { User } from 'src/modules/users/schemas/user.schema';

@Schema({
  timestamps: true,
})
export class WorkFromHome extends mongoose.Document {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: mongoose.Types.ObjectId;

  @Prop({ required: true, default: '' })
  reason: string;

  @Prop({ default: '' })
  desc: string;

  @Prop({ required: true, default: '', type: Date })
  from_date: Date;

  @Prop({ required: true, default: '', type: Date })
  to_date: Date;

  @Prop({ required: true, default: '0.0', type: Number })
  total_days: number;

  @Prop({ default: '' })
  status: string;

  @Prop({ default: '' })
  status_changed_by: string;

  @Prop({ required: true, default: '', type: Number })
  type: number;
}

export const WorkFromHomeSchema = SchemaFactory.createForClass(WorkFromHome);
