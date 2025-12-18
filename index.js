const { Telegraf } = require('telegraf');
const express = require('express');
const app = express();

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

const verifiedUsernames = new Set();
const notifiedUserIds = new Set();

// Telegram bot
bot.start((ctx) => {
    const username = ctx.from.username;
    const userId = ctx.from.id;

    if (!username) {
        return ctx.reply(
            "⚠️ You don't have a Telegram username.\n\n" +
            "Go to Telegram Settings → Username and set one."
        );
    }

    verifiedUsernames.add(username);

    if (!notifiedUserIds.has(userId)) {
        notifiedUserIds.add(userId);

        ctx.reply(
            `✅ Your username has been verified!\n\n` +
            `Your username: @${username}\n\n` +
            `Copy your username and paste it on the website for final verification.`
        );
    }
});

// Website check endpoint
app.get('/check/:username', (req, res) => {
    const username = req.params.username.replace('@', '');
    res.json({ valid: verifiedUsernames.has(username) });
});

// Required for Render
app.get('/', (req, res) => {
    res.send('Telegram verifier bot running');
});

bot.launch();
app.listen(process.env.PORT || 3000);
