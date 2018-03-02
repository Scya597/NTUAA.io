class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  setVector(u) {
    this.x = u.x;
    this.y = u.y;
    return this;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  add(u) {
    this.x += u.x;
    this.y += u.y;
    return this;
  }
  addVectors(u, v) {
    this.x = u.x + v.x;
    this.y = u.y + v.y;
    return this;
  }

  subtract(u) {
    this.x -= u.x;
    this.y -= u.y;
    return this;
  }
  subtractVectors(u, v) {
    this.x = u.x - v.x;
    this.y = u.y - v.y;
    return this;
  }

  scale(a) {
    this.x *= a;
    this.y *= a;
    return this;
  }
  scaleVector(u, a) {
    this.x = u.x * a;
    this.y = u.y * a;
    return this;
  }

  divide(a) {
    this.x /= a;
    this.y /= a;
    return this;
  }
  divideVector(u, a) {
    this.x = u.x / a;
    this.y = u.y / a;
    return this;
  }

  dot(u) {
    return (this.x * u.x) + (this.y * u.y);
  }

  norm() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  }
  normSquared() {
    return (this.x * this.x) + (this.y * this.y);
  }

  normalise() {
    return this.divide(this.norm());
  }
  unitVector(u) {
    this.setVector(u);
    this.normalise();
    return this;
  }

  project(u) {
    const n = u.clone().normalise();
    return this.scaleVector(n, n.dot(this));
  }

  clipNorm(m) {
    return (this.norm() > m) ?
      this.normalise().scale(m) :
      this;
  }

  clipComponents(x1, x2, y1, y2) {
    if (this.x < x1) { this.x = x1; }
    if (this.x > x2) { this.x = x2; }
    if (this.y < y1) { this.y = y1; }
    if (this.y > y2) { this.y = y2; }
    return this;
  }

  interpolate(u, ratio) {
    return this.scale(1 - ratio).add(u.clone().scale(ratio));
  }

  interpolateVectors(u, v, ratio) {
    return this.addVectors(
      u.clone().scale(1 - ratio),
      v.clone().scale(ratio),
    );
  }
}

export default Vector2;
