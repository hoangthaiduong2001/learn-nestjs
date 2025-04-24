import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteUserDTO {
  @Field(() => ID)
  @IsNotEmpty()
  id: string;
}
