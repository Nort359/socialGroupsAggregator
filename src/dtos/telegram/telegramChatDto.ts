import ChatStatuses from '../../enums/ChatStatuses';

export interface ITelegramChat {
    id: string;
    title: string;
    type: string;
    status: ChatStatuses;
}

export default class TelegramChatDto implements ITelegramChat {
    id;
    title;
    type;
    status;

    constructor(model) {
        this.id = model.id;
        this.title = model.title;
        this.type = model.type;
        this.status = model.status || ChatStatuses.LEFT;
    }
}
