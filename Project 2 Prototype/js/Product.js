class Product {
  // Create a new Product object
  constructor(x, y, vx) {
    this.x = x;
    this.y = y;
    // NOTE: We don't know the dimensions of a generic Product
    // so we start them as undefined
    this.width = 40;
    this.height = 40;
    // NOTE: We don't know how a generic Product will move
    // so we set its velocity to 0
    this.vx = 0;
    this.vy = 0;
    this.speed = 2;
    this.isBeingDragged = false;
  }

  // Move the Product according to its velocity
  move() {
    if (!this.isBeingDragged) {
      this.x += this.vx;
      this.y += this.vy;
    } else {
      this.x = mouseX;
      this.y = mouseY;
    }
  }

  // Wrap the Product if it reaches the right edge
  wrap() {
    if (this.x > width) {
      this.x -= width;
    }
  }

  // Display the Product
  display() {
    push();
    rectMode(CENTER);
    fill(255, 0, 0);
    stroke(255);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }

  mousePressed() {
    if (
      mouseX > this.x - this.width / 2 &&
      mouseX < this.x + this.width / 2 &&
      mouseY > this.y - this.height / 2 &&
      mouseY < this.y + this.height / 2
    ) {
      this.isBeingDragged = true;
    }
  }

  mouseReleased() {
    this.isBeingDragged = false;
  }
}
