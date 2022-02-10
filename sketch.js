// Window size
let WIDTH = 400; 
let HEIGHT = 400; 

// Frame Rate Parameters
let t0 = 0; 
let delay = 5;

// BST depth
let maxdepth = 8; 

// Number of branches to search using "concurrent" processing
let nBranch = 8;

// The speed of which peak bars recede 
let speed = 10;

// Randomly drops out tree nodes within specificed rate value
let dropout_rate = 0.4;

// data structures to keep track of the entire simulation
let leaf_index = [];
let locked = [];
let record = []; 
let f1 = [];
let f2 = [];
let rn = [];
let rc = [];

// Tree object to store all node info.
let tree; 

// Axis object to process tree info for visualization
let axis;

function initialize() {
  for (let i=0;i<nBranch;i++){
    locked.push(false);
    f1.push(false);
    f2.push(false);

    record.push([]);

    rn.push(null);
    rc.push(null);
    leaf_index.push(null);
  }

  tree = new Tree(new Node(WIDTH/2, HEIGHT-30), 60, 20, maxdepth, nBranch, dropout_rate);
  tree.root = tree.createTree(tree.root, 1);

  axis = new Axis(tree, 2, 0.5, maxdepth);
}

function setup() {
  createCanvas(WIDTH, HEIGHT);

  initialize();
}

function draw() {
  // Increment t0 per frame and skip the rendering process until it surpasses the specified delay value
  t0++;
  if (t0<delay){
    return;
  }
  t0 = 0;

  background(0);

  tree.draw(null, tree.root);
  axis.draw_line();

  // Search process per branch
  // Each search performs a random traversal starting from the root until it reaches 
  // a leaf or gets stuck by a dropped node along the way.
  // If the search lands at one of the leaves, the corresponding leaf object is used 
  // to access Axis object's methods for appropriate visualization.
  // If the search gets stuck in the middle, it will resume from the "parent" node.
  // In order to guarantee successful leaf search, a parent node may have at most one dropped-out child node. 
  for (let k=0;k<nBranch;k++){

    // if locked==True, the current branch processes visualization until a certain criteria is met.
    // else, the current branch performs leaf search by traversing the BST. 
    if (locked[k]){

      // Draw vertical bars to simulate a media player's frequency visualization
      axis.draw_background(rc[k]);
      axis.draw(leaf_index[k], rc[k]);

      // Check to see if the current branch is ready to start next search
      if ((f1[k]) && (f2[k]) && (axis.leaves[leaf_index[k]]<=50)){
        f1[k] = false;
        f2[k] = false;
        locked[k] = false;

        tree.reset(tree.root);
        record[k] = [];

        return;
      } 

      if (f2[k]){

        // Decrease the length of the vertical bar at corresponding leaf position
        axis.leaves[leaf_index[k]] -= speed;
      } else {

        // Increase the length of the vertical bar at corresponding leaf position
        axis.leaves[leaf_index[k]] += rn[k];
      }

      // Flag to check if the length of the vertical bar at corresponding leaf position has exceeded a certain limit
      if (axis.leaves[leaf_index[k]]>=rn[k]){
        f2[k] = true;
      }

    } else{

      // Perform BST Traversal from the root
      // If the search lands at one of the leaves, it returns the corresponding leaf's index value. 
      // If the search gets stuck in the middle, it returns null.
      leaf_index[k] = tree.visit(tree.root, 0, record[k], k);

      // Update the traversal history.
      record[k] = tree.hist[k];
      tree.hist[k] = [];

      // Upon successful leaf search, configure current branch's parameters for appropriate visualization.
      // From here, this branch focuses on the visualization process until it meets a certain criteria.
      // After visualization process, the branch starts a new search. 
      if (record[k].length==maxdepth-1){
        locked[k] = true;

        // Randomized parameter values to apply an appropriate amount of "seasoning" to the visualization aspects.
        rn[k] = 50+Math.floor(Math.random()*50);
        rc[k] = color(Math.floor(Math.random()*255), Math.floor(Math.random()*255), Math.floor(Math.random()*255));

        f1[k] = true;
      }
    }
  }
}