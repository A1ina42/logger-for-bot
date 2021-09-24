const moment = require('moment')
const { Telegraf } = require('telegraf')
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
app.use(express.static(__dirname + '/public'));
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const bot = new Telegraf(process.env.BOT_TOKEN)
let curSocket = [];

async function saveLogs(ctx, message) {
  curSocket.forEach((socket) => {
    socket.emit("data", { name: ctx.from.first_name, time: moment.unix(ctx.message.date).format("DD.MM.YYYY HH:mm:ss"), message});
  })
}

bot.on('text', async (ctx) => await saveLogs(ctx, ctx.message.text));
bot.on('voice', async (ctx) => await saveLogs(ctx, "voice"));
bot.on('invoice', async (ctx) => await saveLogs(ctx, "invoice"));
bot.on('video', async (ctx) => await saveLogs(ctx, "video"));
bot.on('audio', async (ctx) => await saveLogs(ctx, "audio"));
bot.on('dice', async (ctx) => await saveLogs(ctx, "dice"));
bot.on('game', async (ctx) => await saveLogs(ctx, "game"));
bot.on('location', async (ctx) => await saveLogs(ctx, "location"));
bot.on('photo', async (ctx) => await saveLogs(ctx, "photo"));
bot.on('sticker', async (ctx) => await saveLogs(ctx, "sticker"));
bot.on('document', async (ctx) => await saveLogs(ctx, "document"));
bot.on('animation', async (ctx) => await saveLogs(ctx, "animation"));
bot.on('contact', async (ctx) => await saveLogs(ctx, "contact"));
bot.on('poll', async (ctx) => await saveLogs(ctx, "poll"));

bot.launch();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

io.on("connection", async (socket) => {
  await curSocket.push(socket);
  socket.on("disconnect", () => curSocket = curSocket.filter(el => el.id != socket.id));
});

httpServer.listen(80);