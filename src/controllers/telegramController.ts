import { Request, Response, NextFunction } from 'express';

import telegramService from '../service/telegramService';

import telegramBot from '../bots/telegram';

class TelegramController {
    telegramBot;

    constructor() {
        this.telegramBot = telegramBot;
    }

    async getTelegramDataByUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { user } = req.params;
            const data = await telegramService.getTelegramDataByUser(user);

            res.json(data);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const { chats, message } = req.body;

            chats?.forEach((id) => telegramBot.telegram.sendMessage(id, message));
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}

export default new TelegramController();
