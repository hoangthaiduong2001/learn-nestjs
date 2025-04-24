import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';

@InputType()
export class UpdateUserDto {
  @Field(() => String)
  @IsString()
  id: string;

  @Field()
  @IsString()
  name: string;

  @Field(() => Number)
  @IsInt()
  age: number;

  @Field()
  @IsString()
  phone: string;

  @Field()
  @IsString()
  address: string;
}
