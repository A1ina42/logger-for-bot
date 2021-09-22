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
let curSocket;

bot.on('text', (ctx) => {
  if (curSocket) {
    curSocket.emit("data", { id: ctx.from.id, name: ctx.from.first_name, time: moment.unix(ctx.message.date).format("DD.MM.YYYY HH:mm:ss"), message: ctx.message.text });
  }
});

bot.launch()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

io.on("connection", (socket) => {
  curSocket = socket;
});

httpServer.listen(80);