/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Role extends Document {
  @Prop()
  role_name: string;

  @Prop()
  created_at: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
