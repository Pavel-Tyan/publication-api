import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel, UserModelDocument } from './user.model';
import { genSaltSync, hashSync } from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(@InjectModel(UserModel.name) private readonly userModel: Model<UserModelDocument>) {}

    async createUser(dto: UserDto) {
        const salt = genSaltSync(10);
        const newUser = new this.userModel({
            email: dto.email,
            name: dto.name,
            surname: dto.surname,
            passwordHash: hashSync(dto.password, salt),
        });
        return newUser.save();
    }

    async findUser(email: string) {
        return this.userModel.findOne({ email }).exec();
    }
}
