class Tree {
	constructor(root, width, height, maxdepth, nBranch, dropout_rate) {
		this.root = root;
		this.root.visited = true;

		this.width = width;
		this.height = height;
		this.maxdepth = maxdepth;

		this.leaf_index = 0;
		this.leaves = [];

		this.dropout_rate = dropout_rate;
		
		this.hist = [];

		for (let i=0; i<nBranch; i++){
			this.hist.push([]);
		}
	}

	createTree(node, depth) {
		if (depth==this.maxdepth){
			node.is_leaf = true;
			node.leaf_index = this.leaf_index;
			this.leaf_index++;
			this.leaves.push(node);
			return node;
		}

		let left_node = new Node(node.x - this.width*(1/depth), node.y-this.height);
		let right_node = new Node(node.x + this.width*(1/depth), node.y-this.height);

		// This code block guarantees that the current node has at most one dropped-out child node
		if (Math.random()<this.dropout_rate){
			if (Math.random()<0.5){
				left_node.dropped = true;
			} else {
				right_node.dropped = true;
			}
		}

		node.left = this.createTree(left_node, depth+1);
		node.right = this.createTree(right_node, depth+1);

		return node;	
	}

	reset(node) {
		if (node==null){
			return;
		}

		node.visited = false;

		this.reset(node.left);
		this.reset(node.right);
	}

	visit(node, depth, record, branch_id) {
		if (depth==record.length){
			let child;
			let choices = [0, 1];
			let value = choices[Math.floor(Math.random()*choices.length)]

			if (value==0){
				child = node.left;
			} else {
				child = node.right;
			}

			if (child.dropped){
				return null;
			}

			child.visited = true;
			this.hist[branch_id].push(value);
			return child.leaf_index;
		}

		let value = record[depth];
		this.hist[branch_id].push(value);

		let child;
		if (value==0){
			child = node.left;
		} else {
			child = node.right;
		}

		return this.visit(child, depth+1, record, branch_id);
	}

	draw(prev, node) {
		if (node==null){
			return;
		}

		if (prev!=null){
			push();
			stroke(150,150,150);
			line(prev.x, prev.y, node.x, node.y);
			pop();
		}

		node.draw();

		this.draw(node, node.left);
		this.draw(node, node.right);
	}
}