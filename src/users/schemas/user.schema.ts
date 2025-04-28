import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

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
  password: string;

  @Prop()
  @Field({ nullable: true })
  age?: number;

  @Prop()
  @Field({ nullable: true })
  phone?: string;

  @Prop()
  @Field({ nullable: true })
  address?: string;

  @Prop({ default: UserRole.USER })
  @Field()
  role: UserRole;

  @Prop()
  @Field()
  createdAt: Date;

  @Prop()
  @Field()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
