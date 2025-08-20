const express = require('express');
const WebSocket = require('ws');
const TelegramBot = require('node-telegram-bot

-api');
const app = express();
const wss = new WebSocket.Server({ port: 8080 });
const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: true });

app.use(express.json());

wss.on('connection', ws => {
    console.log('Device connected');
    ws.on('message', message => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'screenshot') {
                bot.sendPhoto('YOUR_CHAT_ID', Buffer.from(data.image, 'base64'), { caption: 'Screenshot from device' });
            }
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'ScreenBot ready! Use /screenshot to capture screen.');
});

bot.onText(/\/screenshot/, (msg) => {
    wss.clients.forEach(client => {
        client.send(JSON.stringify({ command: 'take_screenshot' }));
    });
    bot.sendMessage(msg.chat.id, 'Requesting screenshot...');
});

app.listen(3000, () => console.log('Server running on port 3000'));
