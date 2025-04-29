import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { Roles } from 'src/decorator/role';
import { GqlJwtAuthGuard } from 'src/jwt-auth.guard';
import { CreateUserListResponse } from './dto/create-user-response.dto';
import { CreateUserDto } from './dto/create-user.input';
import { DeleteUserDTO } from './dto/delete-user.input';
import { UpdateUserDto } from './dto/update-user.input';
import { UserListResponse } from './dto/user-list-response.dto';
import { PaginationArgs } from './dto/user-pagination';
import { UserResponse } from './dto/user-response.dto';
import { User, UserRole } from './schemas/user.schema';
import { UsersService } from './users.service';

@UseGuards(GqlJwtAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @Mutation(() => CreateUserListResponse)
  async create(@Args('input') input: CreateUserDto): Promise<CreateUserListResponse> {
    const user = await this.usersService.create(input);
    return {
      message: 'Create user successfully',
      result: user,
    };
  }

  @Roles('user')
  @Query(() => UserListResponse)
  async users(@Args() pagination: PaginationArgs): Promise<UserListResponse> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const skip = (page - 1) * limit;
    const user = (await this.usersService.findAll({ skip, limit })).filter(
      user => user.role === UserRole.USER,
    );
    return {
      message: 'Get all user successfully',
      result: user,
    };
  }

  @Roles('user')
  @Query(() => UserResponse)
  async findOne(@Args('id', { type: () => String }) id: string): Promise<UserResponse> {
    if (!mongoose.isValidObjectId(id)) {
      return {
        message: 'Invalid user id format',
        result: null,
      };
    }
    const user = await this.usersService.findOne(id);
    if (!user) {
      return {
        message: 'User not found',
        result: null,
      };
    }
    return {
      message: 'Get information user successfully',
      result: user,
    };
  }

  @Roles('admin')
  @Mutation(() => UserResponse)
  async update(@Args('updateUserInput') updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.usersService.update(updateUserDto.id, updateUserDto);
    if (!user) {
      return {
        message: 'User not found',
        result: null,
      };
    }
    return {
      message: 'Update information user successfully',
      result: user,
    };
  }

  @Roles('admin')
  @Mutation(() => UserResponse)
  async delete(
    @Args('userId', { type: () => DeleteUserDTO }) deleteUserDto: DeleteUserDTO,
  ): Promise<UserResponse> {
    const user = await this.usersService.delete(deleteUserDto.id);
    if (!user) {
      return {
        message: 'User not found',
        result: null,
      };
    }
    return {
      message: 'Delete user successfully',
      result: user,
    };
  }
}
