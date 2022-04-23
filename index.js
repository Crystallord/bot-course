const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options.js');

const token = '5320394390:AAEr6DwW2Gcc1x30qUQp8xCtdpHQmYxUe9k';

const bot = new TelegramApi(token, {polling: true})

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 1 до 3, а ты должен(а) угадать!')
  const randomNumber = Math.floor((Math.random() * (3 - 1)) + 1);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай :)', gameOptions);
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: "Привет!"},
    {command: '/info', description: "Зачем ты создан?"},
    {command: '/game', description: "Сыграть в игру :)"}
  ])
  
  bot.on('message', async msg => {
    const user = {
      firstName: msg.from.first_name ? msg.from.first_name : '',
      secondName: msg.from.last_name ? msg.from.last_name : ''
    }
    const text = msg.text;
    const chatId = msg.chat.id;
  
    if (text === '/start') {
      await bot.sendMessage(chatId, `${user.firstName} ${user.secondName}, добро пожаловать в телеграм бот Pro100Films!`);
      return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp');
    }
  
    if (text === '/info') {
      return bot.sendMessage(chatId, `Я был создан Хомяком, что бы искать ему интересные фильмы на вечер. Если хочешь, могу искать и для тебя =)`);
    }

    if (text === '/game') {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, `${user.firstName}, я глупая машина. Я умею общаться только через меню.`)
  })

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if ( data === '/again') {
      return startGame(chatId);
    }

    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `Правильно!`, againOptions);
    } else {
      return bot.sendMessage(chatId, `АХАХАХАХА, НЕ ВЕРНО!!! Это было ${chats[chatId]}`, againOptions);
    }
  })
}

start()