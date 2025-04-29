import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer number' })
  @Min(1, { message: 'Limit must be greater than or equal to 1' })
  page?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'Page must be an integer number' })
  @Min(1, { message: 'Page must be greater than or equal to 1' })
  limit?: number;
}
