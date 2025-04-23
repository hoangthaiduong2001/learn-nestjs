import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async create(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;
    const hashPassword = this.hashPassword(password);
    const result = await this.userModel.create({ name, email, password: hashPassword });
    return {
      message: 'Create user successfully',
      result,
    };
  }

  async findAll() {
    try {
      const user = await this.userModel.find();
      return {
        message: 'Get all user successfully',
        result: user,
      };
    } catch (error) {
      return {
        message: 'Error while retrieving user',
        error: error.message,
      };
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel.findOne({ _id: id });
      if (!user) {
        return {
          message: 'User not found',
        };
      }
      return {
        message: 'Get information user successfully',
        result: user,
      };
    } catch (error) {
      return {
        message: 'Error while retrieving user',
        error: error.message,
      };
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findByIdAndUpdate({ _id: id }, updateUserDto, {
        new: true,
      });
      if (!user) {
        return {
          message: 'User not found',
        };
      }
      return {
        message: 'Update information user successfully',
        result: user,
      };
    } catch (error) {
      return {
        message: 'Error while retrieving user',
        error: error.message,
      };
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userModel.findByIdAndDelete({ _id: id });
      if (!user) {
        return {
          message: 'User not found',
        };
      }
      return {
        message: 'Delete user successfully',
        result: user,
      };
    } catch (error) {
      return {
        message: 'Error while retrieving user',
        error: error.message,
      };
    }
  }
}
