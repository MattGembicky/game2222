"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//objects
const Objects_js_1 = require("./Objects.js");
class World {
    constructor(data) {
        this.createGrid = () => {
            for (var y = 0; y < World.height; y++) {
                this.grid[y] = [];
                for (var x = 0; x < World.width; x++) {
                    this.grid[y][x] = new Objects_js_1.Wall();
                }
            }
        };
        this.getPlayerPositions = () => {
            let tempGrid = [];
            for (var y = 0; y < World.height; y++) {
                tempGrid[y] = [];
                for (var x = 0; x < World.width; x++) {
                    tempGrid[y][x] = false;
                }
            }
            function getPosition(row) {
                const free = tempGrid[row].map((pos, index) => pos === false ? index : -1).filter((e) => e !== -1);
                if (free === []) {
                    return null;
                }
                const rand = Math.floor(Math.random() * free.length);
                return { x: rand, y: row };
            }
            function block(x, y) {
                x = x >= 0 ? x < World.width ? x : World.width : 0;
                y = y >= 0 ? y < World.height ? y : World.height : 0;
                const boudX = x + 7 < World.width ? x + 7 : World.width;
                const boudY = y + 7 < World.width ? y + 7 : World.width;
                for (let by = y; by <= boudY; by++) {
                    for (let bx = x; bx <= boudX; bx++) {
                        tempGrid[y][x] = true;
                    }
                }
            }
            let posPack = [];
            let notBlockedRows = [...Array(World.height).keys()];
            while (this.maxPlayers !== posPack.length) {
                const randRow = Math.floor(Math.random() * notBlockedRows.length);
                const position = getPosition(randRow);
                if (position !== null) {
                    posPack.push(position);
                    block(position.x - 3, position.y - 3);
                }
                else {
                    notBlockedRows = notBlockedRows.filter(row => row !== randRow);
                    if (notBlockedRows.length === 0) {
                        break;
                    }
                }
            }
            return posPack;
        };
        this.generate = (playerList) => {
            let positions = this.getPlayerPositions();
            if (Object.keys(playerList).length !== 0) {
                for (const [name, data] of Object.entries(playerList)) {
                    if (playerList[name] !== null) {
                        playerList[name].setPosition(positions[0]);
                        this.grid[positions[0].y][positions[0].x] = null;
                        positions = positions.slice(1);
                    }
                }
            }
        };
        this.init = () => {
            return this.grid;
        };
        World.width = data.size.width;
        World.height = data.size.height;
        this.maxPlayers = data.maxPlayers;
        //make grid
        this.grid = [];
        this.createGrid();
    }
}
module.exports = World;
