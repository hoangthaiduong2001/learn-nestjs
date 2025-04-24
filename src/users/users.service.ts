import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.input';
import { UpdateUserDto } from './dto/update-user.input';
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
    return this.userModel.create({ name, email, password: hashPassword });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    return this.userModel.findOne({ _id: id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
