class Squarewave {

  constructor(props) {

    this.period = props.period;
    this.dutyCycle = props.dutyCycle;

    this.lastTimestamp = Date.now()/1000;
    this.value = 0;

  }

  update() {
    const t = Date.now()/1000;
    const delta_t = t - this.lastTimestamp;

    this.value = (delta_t/this.period < this.dutyCycle) ? 1 : 0;
    if (delta_t > this.period) { this.lastTimestamp = t; }
  }

}

export default Squarewave;
