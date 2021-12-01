import mailService from './mailService';
import tokenService from './tokenService';

import UserModel from '../models/userModel';
import UserDto from '../dtos/userDto';
import ApiError from '../exceptions/apiError';
import TokenTypes from '../enums/TokenTypes';

const bcrypt = require('bcrypt');
const uuid = require('uuid');

class UserService {
    async registration(email: string, password: string) {
        const candidate = await UserModel.findOne({ email });

        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({ email, password: hashPassword, activationLink });

        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async activate(activationLink: string) {
        const user = await UserModel.findOne({ activationLink });

        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации');
        }

        user.isActivated = true;
        await user.save();
    }

    async login(email: string, password: string) {
        const user = await UserModel.findOne({ email });
        const errorMessage = 'Пользователь с ведёнными данными не найден';

        if (!user) {
            throw ApiError.BadRequest(errorMessage);
        }

        const isPassEqual = await bcrypt.compare(password, user.password);

        if (!isPassEqual) {
            throw ApiError.BadRequest(errorMessage);
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async logout(refreshToken: string) {
        return await tokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const data = tokenService.validateToken(TokenTypes.Refresh, refreshToken);
        const tokenDb = await tokenService.findToken(refreshToken);

        if (!data && !tokenDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(data.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }

    async getAllUsers() {
        return UserModel.find();
    }
}

export default new UserService();
