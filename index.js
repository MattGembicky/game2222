"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
var server = require('http').Server(app);
const Players_1 = require("./utils/Players");
const World = require("./utils/World");
console.log("Started");
const PORT = process.env.PORT || 8080;
// middlewares
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}));
// server
server.listen(PORT, function () {
    console.log(`Server runing without problem - Running on port: ${PORT}`);
});
// totaly socket
const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
let code = "0";
let world;
let players;
let screenSocket;
function createCode() {
    function rnd() {
        return Math.floor(Math.random() * 10);
    }
    if (code === "0") {
        code = "" + rnd() + rnd() + rnd() + rnd();
    }
}
io.on("connection", (socket) => {
    socket.on('generateCode', (data) => {
        world = new World(data);
        players = new Players_1.Players(data);
        createCode();
        socket.emit("code", code);
        screenSocket = socket;
    });
    socket.on('addPlayer', (data) => {
        if (code === data.code) {
            players.add(socket, data.name);
            screenSocket.emit('playersReady', players.getPlayersInfo());
        }
    });
    socket.on('startGame', () => {
        world.generate(players.getList());
        screenSocket.emit('initWorld', world.init());
    });
    socket.on('disconnect', () => {
        if (socket === screenSocket) {
            code = "0";
            return;
        }
        if (players) {
            players.delete(players.getNameBySocket(socket));
            screenSocket.emit('playersReady', players.getPlayersInfo());
        }
    });
});
