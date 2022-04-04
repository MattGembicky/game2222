//types
export type TPlayer = {
    socket: any;
    x: number;
    y: number;
    score: number;
}
export type TPlayerList = {
    [key: string]: TPlayer | null;
}
import { Size, GenerationProps } from '../index';
export type GenerateProps = {
  size: Size,
  maxPlayers: number
};


//player
class Player {
  socket: string;
  score: number;
  x: number;
  y: number;

  constructor({socket}: {socket: any}) {
    this.socket = socket;
    this.score = 0;
    this.x = 32;
    this.y = 32;
  }

  setPosition = ({x, y}: {x: number, y: number}) => {
    this.x = x * 64 + 32;
    this.y = y * 64 + 32;
  }
}


export class Players {
  list: TPlayerList;
  maxPlayers: number;
  private playerCount = 0;

  constructor(data: GenerationProps) {
    this.list = {};
    this.maxPlayers = data.maxPlayers;
  }

  private unusedName = (name: string) => {
    for(const [key, user] of Object.entries(this.list)){
      if(key === name){
        return false;
      }
    }
    return true;
  }

  add = (socket: any, name: string) => {
    if(this.maxPlayers <= this.playerCount || !this.unusedName(name)){
      return;
    }
    this.list[name] = new Player({socket: socket});
    this.playerCount++;
  }

  delete = (name: string) => {
    delete this.list[name];
  }

  getNameBySocket = (socket: any) => {
    for(const [key, user] of Object.entries(this.list)){
      if(user !== null && user.socket === socket){
        return key;
      }
    }
  }

  getPlayersInfo = () => {
    let pack = [];
    for(const [key, user] of Object.entries(this.list)){
      if(user !== null){
        pack.push({name: key, score: user.score});
      }
    }
    return {info: pack, count: Object.keys(this.list).length + "/" + this.maxPlayers};
  }

  getList = () => {
    return this.list;
  }
}

module.exports = { Players };
