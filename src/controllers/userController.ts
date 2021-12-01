import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import userService from '../service/userService';
import { ONE_DAY } from '../constants/time';
import ApiError from '../exceptions/apiError';

import TokenTypes from '../enums/TokenTypes';

class UserController {
    async registration(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }

            const { email, password } = req.body;
            const data = await userService.registration(email, password);

            res.cookie(TokenTypes.Refresh, data.refreshToken, {
                maxAge: ONE_DAY * 30,
                httpOnly: true,
            });

            return res.json(data);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const data = await userService.login(email, password);

            res.cookie(TokenTypes.Refresh, data.refreshToken, {
                maxAge: ONE_DAY * 30,
                httpOnly: true,
            });

            return res.json(data);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);

            res.clearCookie(TokenTypes.Refresh);

            return res.json(token);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);

            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;

            const data = await userService.refresh(refreshToken);

            res.cookie(TokenTypes.Refresh, data.refreshToken, {
                maxAge: ONE_DAY * 30,
                httpOnly: true,
            });

            return res.json(data);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (e) {
            console.error(e);
            next(e);
        }
    }
}

export default new UserController();
