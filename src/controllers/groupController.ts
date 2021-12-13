import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import groupService from '../service/groupService';
import ApiError from '../exceptions/apiError';

class GroupController {
    async get(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await groupService.getAll();
            res.json(data);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async getAllUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { user } = req.params;

            const data = await groupService.getAllUser(user);
            res.json(data);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async add(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }

            const { name, user } = req.body;
            const { group } = await groupService.add(name, user);

            return res.json(group);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, name } = req.body;

            return await groupService.update({ id, name });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }

            const { id } = req.params;
            const data = await groupService.remove(id);

            return res.json(data);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}

export default new GroupController();
