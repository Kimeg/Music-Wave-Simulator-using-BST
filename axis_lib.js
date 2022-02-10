class Axis {
	constructor(tree, width, height, depth){
		this.tree = tree;

		this.x1 = tree.leaves[0].x;
		this.y1 = tree.leaves[0].y;
		this.x2 = tree.leaves[tree.leaves.length-1].x;
		this.y2 = tree.leaves[tree.leaves.length-1].y;

		this.width = width;
		this.height = height;
		this.depth = depth;

		this.leaves = [];

		for (let i=0;i<(2**(depth-1));i++){
			this.leaves.push(10+Math.random()*20);
		}
	}

	draw_background(c) {
		push();
		stroke(200);
		strokeWeight(1);
		fill(c);

		for (let i=0; i<2**(this.depth-1); i++){
			let h = Math.random()*30;
			rect(this.tree.leaves[i].x, this.y1-50-h, this.width, h);
		}
		pop();
	}

	draw_line() {
		push();
		stroke(255);
		line(this.x1, this.y1-50, this.x2, this.y2-50);
		pop();
	}

	draw(index, c) {
		push();
		stroke(200);
		strokeWeight(1);
		fill(c);

		for (let i=0; i<this.leaves[index]; i++){
			rect(this.tree.leaves[index].x, this.y1-50-i*this.height, this.width, i*this.height);
		}
		pop();
	}
}