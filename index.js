const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "7435455438:AAHY-W7-jf0XQeEp6bJyf_L35wt8bSh9OK4";
const server = express();
const bot = new TelegramBot(TOKEN, { polling: true });
const port = process.env.PORT || 5001; // Changed from 5000 to 5001
const gameName = "ArchTap";
const queries = {};

server.use(express.static(path.join(__dirname, 'Taper')));

bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "Say /game if you want to play."));

bot.onText(/start|game/, (msg) => bot.sendGame(msg.from.id, Taper));

bot.on("callback_query", (query) => {
    if (query.game_short_name !== Taper) {
        bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
    } else {
        queries[query.id] = query;
        let gameurl = "https://albertunitydev.github.io/Taper/";
        bot.answerCallbackQuery({
            callback_query_id: query.id,
            url: gameurl
        });SS
    }
});

bot.on("inline_query", (iq) => {
    bot.answerInlineQuery(iq.id, [{
        type: "game",
        id: "0",
        game_short_name: Taper
    }]);
});

server.get("/highscore/:score", (req, res, next) => {
    if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
    let query = queries[req.query.id];
    let options;
    if (query.message) {
        options = {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id
        };
    } else {
        options = {
            inline_message_id: query.inline_message_id
        };
    }
    bot.setGameScore(query.from.id, parseInt(req.params.score), options, (err, result) => {
        if (err) {
            console.error(err);
        } else {
            console.log(result);
        }
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
