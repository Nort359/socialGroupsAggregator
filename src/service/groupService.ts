import { ObjectId } from 'mongoose';

import GroupModel from '../models/groupModel';
import GroupDto from '../dtos/groupDto';
import ApiError from '../exceptions/apiError';

class GroupService {
    async get(name) {

    }

    async getAll() {
        return GroupModel.find();
    }

    async add(name: string, user: ObjectId) {
        const candidate = await GroupModel.findOne({ name });

        if (candidate) {
            throw ApiError.BadRequest(`Группа с именем "${GroupModel}" уже существует. Придумайте другое имя`);
        }

        const data = await GroupModel.create({ name, user });

        return { group: new GroupDto(data) };
    }

    async update() {

    }

    async remove() {

    }
}

export default new GroupService();
