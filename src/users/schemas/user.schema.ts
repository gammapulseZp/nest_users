import { Next } from '@nestjs/common';
import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ //shema options
  /*pluralizes; build-in in Nest.js 
   may create another collection in addition to pluralized 
   use discriminators to have multiple shemas on one collection*/
  //collection : 'user' 
  strict: 'throw', //true by default; ignores or not non-shema fields; 'throw' - throws error if non-shema fields present in body
  versionKey: false, //removes __v field from response, not from DB
}) 

export class User {
  @Prop(/*{ //mongoose options object
    //required: true // !!! PartialType will not override this option! Solution - @IsNotEmpty() decorator on DTO or using discriminators=> multiple shemas on same collection
  }*/)
  first_name: string

  @Prop()
  last_name: string;

  @Prop(/*{unique: true}*/) //may create index with unique property and cause E11000 duplicate key error collection?
  email: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  gender: string;

  @Prop()
  age: number;

  @Prop()
  ip_address: string;

  @Prop()
  language: string;

  @Prop()
  company: string;

  @Prop()
  avatar: string;

  @Prop()
  deleted: boolean;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
const pre = UserSchema.pre('save', function(next){
  console.log('well hello, pre save shema hook')
  next()
})
const post = UserSchema.post('save', function(next){
  console.log('well hello, post save shema hook')
})
// OR manually w/o decorators
/*import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  }
  last_name: String,
  email: String,
   password: string;
  gender: String,
  age: String;
  ip_address: String,
  language: String,
  company: String,
  avatar: String,
  deleted: Boolean,
});*/