const {log} = require('./automatic.functions')
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1251569831:AAFO6u25tkI_HPDeu05YlEq7YEbit0rD5o8';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/getmyid/, (msg, match) => {
    const chatId = msg.chat.id;
    console.log(chatId)
    bot.sendMessage(chatId, `Your ID:  ${chatId} `);//
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("polling_error", err => log( err, null, 'telegram_bot', 'error', false ) );


module.exports = async ( chatId = 589781832, message = '') => new Promise( async resolve => {
    if(!chatId || chatId === '' || !Number.isInteger( +chatId )){
        throw "Please pass a real chatId.";
        resolve();
        return;
    }
    if( !message || message === '' || typeof message !== 'string'){
        throw "Please pass a normal message.";
        resolve();
        return;
    }

    bot.sendMessage(chatId, `${message}`);
})