/**
 * A base class that create a Circle, which will be inherit by Food and Cell
 */
class Circle {
  /**
   * @param {object} [props] - the property pass down by Food or Cell
   */
  constructor(props) {
    this.mass = props.mass;
    this.pos = props.pos;
    this.id = props.id;
  }
  /**
   * Use to caculate radius from mass
   * @return {number} - radius of the Circle
   */
  getRadius() {
    return Math.sqrt(Math.abs(this.mass) / Math.PI);
  }
}

export default Circle;
