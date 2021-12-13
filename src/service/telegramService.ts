import { ObjectId } from 'mongodb';

import TelegramUserModel from '../models/TelegramUserModel';
import ChatStatuses from '../enums/ChatStatuses';

import { ITelegramUser } from '../dtos/telegram/telegramUserDto';
import { ITelegramChat } from '../dtos/telegram/telegramChatDto';

class TelegramService {
    async saveUser(data: ITelegramUser): Promise<ITelegramUser> {
        const { telegramUserId } = data;
        const telegramUser = await TelegramUserModel.findOne({ telegramUserId });

        if (!telegramUser) {
            return TelegramUserModel.create(data);
        }

        return telegramUser;
    }

    async patchChat(telegramUserId: string, chat: ITelegramChat): Promise<ITelegramUser>  {
        const telegramUser = await TelegramUserModel.findOne({ telegramUserId });

        console.log('chat', chat);
        console.log('telegramUser.chats', telegramUser.chats);

        if (telegramUser) {
            switch (chat.status) {
                case ChatStatuses.LEFT:
                case ChatStatuses.KICKED: {
                    telegramUser.chats = [
                        ...telegramUser.chats.filter((item) => item.id !== chat.id),
                    ];

                    break;
                }
                default: {
                    telegramUser.chats = [
                        ...telegramUser.chats.filter((item) => item.id !== chat.id),
                        chat,
                    ];

                    break;
                }
            }

            telegramUser.save();

            return telegramUser;
        }

        return telegramUser;
    }

    async getTelegramDataByUser(user: string) {
        return TelegramUserModel.findOne({ user: new ObjectId(user) });
    }
}

export default new TelegramService();
