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

bot.on('text', (ctx) => {
  curSocket.forEach((socket) => {
    socket.emit("data", { id: ctx.from.id, name: ctx.from.first_name, time: moment.unix(ctx.message.date).format("DD.MM.YYYY HH:mm:ss"), message: ctx.message.text });
  })
});

bot.on('voice', (ctx) => {
  curSocket.forEach((socket) => {
    socket.emit("data", { id: ctx.from.id, name: ctx.from.first_name, time: moment.unix(ctx.message.date).format("DD.MM.YYYY HH:mm:ss"), message: "voice" });
  })
});

bot.launch()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
})

io.on("connection", (socket) => {
  curSocket.push(socket);
  socket.on("disconnect", () => {
    curSocket = curSocket.filter(el => {
      console.log(el.id == socket.id);
     return el.id != socket.id
    });
    console.log(curSocket.length)
  });
});

httpServer.listen(80);