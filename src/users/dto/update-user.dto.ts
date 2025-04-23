import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  age: number;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;
}
