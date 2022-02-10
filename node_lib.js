class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visited = false; 
    this.is_leaf = false;
    this.left = null;
    this.right = null;

    this.dropped = false;
  }
  
  draw() {
    let c = 0;
    if (this.visited){
      c = color(0, 255, 0);
    }

    if (this.dropped){
      c = color(200, 0, 150);
    }

    push();
    fill(c)
    stroke(150);
    strokeWeight(1);
    circle(this.x, this.y, 10);
    pop();
  }
}