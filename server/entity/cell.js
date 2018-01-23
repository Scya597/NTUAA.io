import Circle from './circle';

/**
 * The Cell class
 */
class Cell extends Circle {
  /**
   * @param {object} [props] - the property of Cell
   */
  constructor(props) {
    super(props);
    this.vel = props.vel;
    this.isEaten = props.isEaten;
  }

  /**
   * Use to eat other Cell and set their isEaten to true
   * @param {object} [cell] - the Cell to be eaten
   */
  eat(cell) {
    cell.isEaten = true;
    this.mass += cell.mass;
    console.log(this.vel);
  }
}

export default Cell;
