import Vector2 from './vector2';
class Zone {

  constructor(props) {

    /* accepts an object as an argument and returns true or false. */
    this.acceptEntry = props.acceptEntry;     

    this.cooldown = props.cooldown;
    this.lastEntry = 0;

    this.centre = props.centre;
    this.radius = props.radius;

    /* these are unused, but left here because they might be useful
     * for rendering later, maybe? */
    this.id = props.id;
    this.color = props.color;
  }

  /**
   * checks if vector `u` is inside of zone. */
  contains(u) {
    var r = new Vector2();
    r.subtractVectors(u, this.centre);

    return (r.norm() < this.radius);
  }

  /**
   * projects vector `u` to outside of zone. */
  eject(u) {
    var r = new Vector2();
    r.subtractVectors(u, this.centre);

    if (r.norm() < this.radius) {
      u.addVectors(
        this.centre,
        r.normalise().scale(
          this.radius));
    }
  }

  /**
   * projects `pos` out of zone if either `player` is not qualified. */
  doorkeep(player, pos) {
    if (!this.contains(pos)) {
      player.zones[this.id] = false;
      return;
    }
    if (player.zones[this.id]) {
      /* already granted entry */
      return;
    }


    if (!this.acceptEntry(player)) {
      this.eject(pos);

    } else if (Date.now() - this.lastEntry < this.cooldown) {
      this.eject(pos);

    } else {
      player.zones[this.id] = true;
      this.lastEntry = Date.now();
    }
  }

}

export default Zone;
