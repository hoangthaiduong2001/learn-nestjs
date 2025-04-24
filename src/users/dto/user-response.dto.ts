import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../schemas/user.schema';

@ObjectType()
export class UserResponse {
  @Field()
  message: string;

  @Field(() => User, { nullable: true })
  result: User | null;
}
