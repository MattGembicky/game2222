export class Wall {
  hp: number;

  constructor() {
    this.hp = 5;
  }

  damage = (value: number) => {
    this.hp -= value;
    if(this.hp < 0){
      this.drop();
    }
  }

  drop = () => {

  }
}

module.exports = { Wall };
