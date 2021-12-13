import { Schema, model } from 'mongoose';

const TelegramUserSchema = new Schema({
    telegramUserId: { type: String, unique: true, required: true },
    isBot: { type: Boolean },
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String },
    chats: { type: Array },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default model('TelegramUser', TelegramUserSchema);
