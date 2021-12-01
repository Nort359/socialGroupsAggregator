import jwt from 'jsonwebtoken';

import { ObjectId } from 'mongoose';

import tokenModel from '../models/tokenModel';
import { IJwtTokens } from '../types/jwt';

import TokenTypes from '../enums/TokenTypes';

const ACCESS_EXPIRES = '30m';
const REFRESH_EXPIRES = '30d';

class TokenService {
    generateTokens(payload): IJwtTokens {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: ACCESS_EXPIRES,
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: REFRESH_EXPIRES,
        });

        return {
            accessToken,
            refreshToken,
        }
    }

    async saveToken(userId: ObjectId, refreshToken: string) {
        const tokenData = await tokenModel.findOne({ user: userId });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        return await tokenModel.create({ user: userId, refreshToken });
    }

    async removeToken(refreshToken: string) {
        return tokenModel.deleteOne({ refreshToken });
    }

    async findToken(refreshToken: string) {
        return tokenModel.findOne({ refreshToken });
    }

    validateToken(type: TokenTypes, token: string) {
        try {
            switch (type) {
                case TokenTypes.Access: {
                    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
                }
                case TokenTypes.Refresh: {
                    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
                }
                default: {
                    return false;
                }
            }
        } catch (e) {
            return false;
        }
    }


}

export default new TokenService();
