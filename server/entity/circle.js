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
    this.color = props.color;
  }
  /**
   * Use to caculate radius from mass
   * @return {number} - radius of the Circle
   */
  getRadius() {
    return Math.sqrt(this.mass / Math.PI);
  }
}

export default Circle;
