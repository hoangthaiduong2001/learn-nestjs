import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
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

  async findAll({ skip = 0, limit = 10 }: { skip?: number; limit?: number }): Promise<User[]> {
    return this.userModel.find().skip(skip).limit(limit).exec();
  }

  async findOne(id: string) {
    return this.userModel.findOne({ _id: id });
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
