import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({
  timestamps: false,
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
export class RefreshToken {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  userId: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  token: string;

  @Field({ nullable: true })
  @Prop()
  createAt?: Date;

  @Field()
  @Prop({ required: true })
  iat: Date;

  @Field()
  @Prop({ required: true })
  exp: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
