import { ObjectId } from 'mongodb';

import GroupModel from '../models/groupModel';
import GroupDto from '../dtos/groupDto';
import ApiError from '../exceptions/apiError';

class GroupService {
    async get(name) {

    }

    async getAll() {
        const data = await GroupModel
            .find()
            .exec();

        return data?.map((item) => new GroupDto(item));
    }

    async getAllUser(user: string) {
        const data = await GroupModel
            .find({ user: new ObjectId(user) })
            .exec();

        return data.map((item) => new GroupDto(item));
    }

    async add(name: string, user: string) {
        const candidate = await GroupModel.findOne({ name });

        if (candidate) {
            throw ApiError.BadRequest(`Группа с именем "${GroupModel}" уже существует. Придумайте другое имя`);
        }

        const data = await GroupModel.create({ name, user: new ObjectId(user) });

        return { group: new GroupDto(data) };
    }

    async update(data) {
        let result = await GroupModel.findOne({ _id: new ObjectId(data.id) });

        if (result) {
            result = {
                ...result,
                ...data,
            };

            return result.save();
        }

        return result;
    }

    async remove(id) {
        return GroupModel.deleteOne({ _id: new ObjectId(id) });
    }
}

export default new GroupService();
