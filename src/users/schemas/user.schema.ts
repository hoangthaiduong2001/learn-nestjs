import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_, rest) => {
      rest.id = rest._id;
      delete rest._id;
    },
  },
})
@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Prop()
  @Field()
  name: string;

  @Prop()
  @Field()
  email: string;

  @Prop()
  @Field()
  password: string;

  @Prop()
  @Field()
  age: number;

  @Prop()
  @Field()
  phone: string;

  @Prop()
  @Field()
  address: string;

  @Prop()
  @Field()
  createAt: Date;

  @Prop()
  @Field()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
