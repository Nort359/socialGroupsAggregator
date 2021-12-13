import { Telegraf } from 'telegraf';

import { commands } from '../constants/telegram';
import userService from '../service/userService';
import telegramService from '../service/telegramService';
import telegramUserDto from '../dtos/telegram/telegramUserDto';
import TelegramChatDto from '../dtos/telegram/telegramChatDto';

const { TELEGRAM_BOT_TOKEN } = process.env;

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
    const { first_name, last_name } = ctx.message?.from;

    return ctx.reply(`
        Здравствуйте ${first_name} ${last_name}.
        Введите ваш email / паролль через символ '/',
        для идентификации вас в системе.
    `);
});

bot.help((ctx) => ctx.reply(commands));

bot.on('my_chat_member', async (ctx) => {
    const { from, chat, new_chat_member: newChatMember } = ctx.update.my_chat_member || {};

    await telegramService.patchChat(
        from.id.toString(),
        new TelegramChatDto({
            ...chat,
            status: newChatMember.status,
        }),
    );
});

bot.on('message', async (ctx) => {
    try {
        // @ts-ignore
        const { text } = ctx.message;
        const [ , email, password ] = text.match(/^([^&]*?)\/(.*)$/);

        const user = await userService.getUser(email.trim().toLowerCase(), password.trim());

        if (user) {
            try {
                await telegramService.saveUser(new telegramUserDto({
                    ...ctx.message?.from,
                    user: user.id,
                }));

                ctx.reply(`Вы успешно авторизированы`);
            } catch (error) {
                ctx.reply('Что-то пошло не так, попробуйте снова.');
            }
        }
    } catch (error) {
        console.log('error', error);
        ctx.reply('Такого пользователя в системе нет. Попробуйте снова.');
    }
});

bot.launch();

export default bot;

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
