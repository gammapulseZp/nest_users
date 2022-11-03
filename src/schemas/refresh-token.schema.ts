import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from "mongoose";

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({
  versionKey: false, //removes __v field from response, not from DB
  strict: "throw",
  //necessary for using .virtual schema callbacks since it works after data recieved from DB and before it is returned
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      // remove these props when object is serialized
      delete ret.id;
    }
  },
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      // remove these props when object is serialized
      delete ret.id;
    }
  },
})

export class RefreshToken {
  @Prop({ type: SchemaTypes.ObjectId , ref: 'User' })
  user: string;

  @Prop()
  token: string;

  @Prop()
  revoked: number;

  @Prop()
  revokedByIp: string;

  @Prop()
  expires: number;

  @Prop()
  createdByIp: string;

  // gets calculated but not returned in response object, no ts errors
  // @Prop({
  //   get(): boolean {
  //     return !this.revoked && !this.isExpired;
  //   }
  // })
  // isActive: boolean;
}

const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expires;
});
RefreshTokenSchema.virtual('isActive').get(function () {
  const isExpired = Date.now() >= this.expires
  return !this.revoked && !isExpired;
});

export default RefreshTokenSchema
