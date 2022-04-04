//types
import { TPlayer, TPlayerList } from './Players';
import { Size, GenerationProps } from '../index';

export type Position = {
  x: number,
  y: number
};

type WorldObject = null | TPlayer | Wall;

//objects
import { Wall } from './Objects.js';

class World {
  static width: number;
  static height: number;
  maxPlayers: number;
  grid: Array<Array<WorldObject>>;

  constructor(data: GenerationProps) {
    World.width = data.size.width;
    World.height = data.size.height;
    this.maxPlayers = data.maxPlayers;
    //make grid
    this.grid = [];
    this.createGrid();
  }

  createGrid = () => {
    for(var y = 0; y < World.height; y++){
      this.grid[y] = [];
      for(var x = 0; x < World.width; x++){
        this.grid[y][x] = new Wall();
      }
    }
  }

  getPlayerPositions = () => {
    let tempGrid: Array<Array<boolean>> = [];
    for(var y = 0; y < World.height; y++){
      tempGrid[y] = [];
      for(var x = 0; x < World.width; x++){
        tempGrid[y][x] = false;
      }
    }

    function getPosition(row: number): Position | null {
      const free = tempGrid[row].map((pos, index) => pos === false ? index : -1).filter((e) => e !== -1);
      if(free === []){
        return null;
      }
      const rand = Math.floor(Math.random() * free.length);
      return {x: rand, y: row};
    }

    function block(x: number, y: number) {
      x = x >= 0 ? x < World.width ? x : World.width : 0;
      y = y >= 0 ? y < World.height ? y : World.height : 0;
      const boudX = x + 7 < World.width ? x + 7 : World.width;
      const boudY = y + 7 < World.width ? y + 7 : World.width;
      for(let by = y; by <= boudY; by++){
        for(let bx = x; bx <= boudX; bx++){
          tempGrid[y][x] = true;
        }
      }
    }

    let posPack: Array<Position> = [];
    let notBlockedRows: Array<number> = [...Array(World.height).keys()];
    while(this.maxPlayers !== posPack.length){
      const randRow = Math.floor(Math.random() * notBlockedRows.length);
      const position = getPosition(randRow);
      if(position !== null){
        posPack.push(position);
        block(position.x - 3, position.y - 3);
      }else{
        notBlockedRows = notBlockedRows.filter(row => row !== randRow);
        if(notBlockedRows.length === 0){
          break;
        }
      }
    }
    return posPack;
  }

  generate = (playerList: TPlayerList) => {
    let positions = this.getPlayerPositions();
    if(Object.keys(playerList).length !== 0){
      for(const [name, data] of Object.entries(playerList)){
        if(playerList[name] !== null){
          playerList[name].setPosition(positions[0]);
          this.grid[positions[0].y][positions[0].x] = null;
          positions = positions.slice(1);
        }
      }
    }
  }

  init = () => {
    return this.grid;
  }
}

module.exports = World;
