import Vector2 from './vector2';

/**
 * A class that create a Zone.
 */
class Zone {
  /**
   * Create a Zone.
   * @param {object} props - The props to construct a pixi object.
   * @param {function} props.acceptEntry - It check whether a player can entry the zone.
   * @param {number} props.cooldown - The player's cooldown's time.
   * @param {Vector2} props.centre - The player's centre position.
   * @param {number} props.radius - The player's radius.
   * @param {uuid} props.id - The player's uuid.
   * @param {number} props.color - The player's color.
   */
  constructor(props) {
    this.acceptEntry = props.acceptEntry;

    this.cooldown = props.cooldown;
    this.lastEntry = Date.now();

    this.centre = props.centre;
    this.radius = props.radius;

    this.remainTime = props.cooldown;

    /* these are unused, but left here because they might be useful
     * for rendering later, maybe? */
    this.id = props.id;
    this.color = props.color;
  }

  /**
   * checks if vector `u` is within `offset` of zone.
   * @param {Vector2} u - The player's position.
   * @param {number} offset - offset
   * @return {bool} - contains or not
   */
  contains(u, offset) {
    offset = offset || 0;
    const r = new Vector2();
    r.subtractVectors(u, this.centre);
    return (r.norm() < this.radius + offset);
  }

  /**
   * projects vector `u` to outside of zone.
   * @param {Vector2} u - The player's position.
   * @param {number} offset - offset
   */
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

  /**
   * @return {number} - Remaining Cooldown Time in milliseconds
   */
  getRemainingCooldownTime() {
    return this.cooldown - (Date.now() - this.lastEntry);
  }

  /**
   * projects `player` out of zone if not qualified
   * @param {player} player - player's object
   */
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
