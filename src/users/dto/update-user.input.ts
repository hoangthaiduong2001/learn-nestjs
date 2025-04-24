import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class UpdateUserDto {
  @Field(() => String)
  @IsString()
  id: string;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => Number)
  @IsInt()
  age: number;

  @Field(() => String)
  @IsString()
  phone: string;

  @Field(() => String)
  @IsString()
  address: string;
}
