export interface ITelegramUser {
    id: string;
    telegramUserId: string;
    isBot: boolean;
    firstName: string;
    lastName: string;
    userName: string;
    user: string;
}

export default class TelegramUserDto implements ITelegramUser {
    id;
    telegramUserId;
    isBot;
    firstName;
    lastName;
    userName;
    user;

    constructor(model) {
        this.id = model._id;
        this.telegramUserId = model.id;
        this.isBot = model.is_bot;
        this.firstName = model.first_name;
        this.lastName = model.last_name;
        this.userName = model.username;
        this.user = model.user;
    }
}
