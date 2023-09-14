/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import  { Document } from 'mongoose';

@Schema({
    timestamps: true,
  })
export class Holiday extends Document {

    @Prop({ required: true, default: '' })
    title: string;

    @Prop({ required: true, default: '', type: Date })
    date: Date;

    @Prop({ required: true, default: ''  })
    image_url: string;

    // @Prop({ required: true, default: ''  })
    // created_at: string;

}

    
export const HolidaysSchema = SchemaFactory.createForClass(Holiday);
