import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel, UserModelDocument } from './user.model';
import { compare, genSaltSync, hashSync } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel.name) private readonly userModel: Model<UserModelDocument>,
        private readonly jwtService: JwtService,
    ) {}

    async createUser(dto: CreateUserDto): Promise<UserModel> {
        const salt = genSaltSync(10);
        const newUser = new this.userModel({
            email: dto.email,
            name: dto.name,
            surname: dto.surname,
            passwordHash: hashSync(dto.password, salt),
        });
        return newUser.save();
    }

    async findUser(email: string): Promise<UserModel> {
        return this.userModel.findOne({ email }).exec();
    }

    async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
        const user = await this.findUser(email);

        if (!user) {
            throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
        }

        const isCorrectPassword = await compare(password, user.passwordHash);

        if (!isCorrectPassword) {
            throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
        }

        return { email: user.email };
    }

    async login(email: string) {
        const payload = { email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
