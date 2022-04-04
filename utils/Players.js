"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Players = void 0;
//player
class Player {
    constructor({ socket }) {
        this.setPosition = ({ x, y }) => {
            this.x = x * 64 + 32;
            this.y = y * 64 + 32;
        };
        this.socket = socket;
        this.score = 0;
        this.x = 32;
        this.y = 32;
    }
}
class Players {
    constructor(data) {
        this.playerCount = 0;
        this.unusedName = (name) => {
            for (const [key, user] of Object.entries(this.list)) {
                if (key === name) {
                    return false;
                }
            }
            return true;
        };
        this.add = (socket, name) => {
            if (this.maxPlayers <= this.playerCount || !this.unusedName(name)) {
                return;
            }
            this.list[name] = new Player({ socket: socket });
            this.playerCount++;
        };
        this.delete = (name) => {
            delete this.list[name];
        };
        this.getNameBySocket = (socket) => {
            for (const [key, user] of Object.entries(this.list)) {
                if (user !== null && user.socket === socket) {
                    return key;
                }
            }
        };
        this.getPlayersInfo = () => {
            let pack = [];
            for (const [key, user] of Object.entries(this.list)) {
                if (user !== null) {
                    pack.push({ name: key, score: user.score });
                }
            }
            return { info: pack, count: Object.keys(this.list).length + "/" + this.maxPlayers };
        };
        this.getList = () => {
            return this.list;
        };
        this.list = {};
        this.maxPlayers = data.maxPlayers;
    }
}
exports.Players = Players;
module.exports = { Players };
