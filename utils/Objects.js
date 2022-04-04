"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wall = void 0;
class Wall {
    constructor() {
        this.damage = (value) => {
            this.hp -= value;
            if (this.hp < 0) {
                this.drop();
            }
        };
        this.drop = () => {
        };
        this.hp = 5;
    }
}
exports.Wall = Wall;
module.exports = { Wall };
