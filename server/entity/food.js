import Circle from './circle';

/**
 * The Food class
 */
class Food extends Circle {
  /**
   * @param {object} [props] - the property of Food
   */
  constructor(props) {
    super(props);
    this.isEaten = props.isEaten;
  }
}

export default Food;
