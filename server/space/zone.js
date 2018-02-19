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
   * checks if vector `u` is within `offset` of zone. */
  contains(u, offset) {
    offset = offset || 0;
    const r = new Vector2();
    r.subtractVectors(u, this.centre);
    return (r.norm() < this.radius + offset);
  }

  /**
   * projects vector `u` to outside of zone. */
  eject(u, offset) {
    offset = offset || 0;

    const r = new Vector2();
    r.subtractVectors(u, this.centre);

    if (r.norm() < this.radius + offset) {
      u.addVectors(
        this.centre,
        r.normalise().scale(this.radius + offset),
      );
    }
  }

  /** in milliseconds */
  getRemainingCooldownTime() {
    return this.cooldown - (Date.now() - this.lastEntry);
  }

  /**
   * projects `player` out of zone if not qualified */
  doorkeep(player) {
    const { pos } = player.cellList[0];
    const radius = player.cellList[0].getRadius();

    if (!this.contains(pos, radius)) {
      player.zones[this.id] = false;
      return;
    }
    if (player.zones[this.id]) {
      /* already granted entry */
      return;
    }


    if (!this.acceptEntry(player) ||
    (Date.now() - this.lastEntry < this.cooldown)) {
      this.eject(pos, radius);
    } else {
      player.zones[this.id] = true;
      this.lastEntry = Date.now();
    }
  }
}

export default Zone;
