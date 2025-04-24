import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../schemas/user.schema';

@ObjectType()
export class CreateUserListResponse {
  @Field()
  message: string;

  @Field(() => User)
  result?: User;
}
