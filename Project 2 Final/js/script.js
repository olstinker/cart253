/**
Exercise: Progress Report
Project 2 Prototype
Gia ~~

This is a prototype of a game that simulates (in a very reduced, gamified manner) the stress of working at a warehouse like Amazon.
The player has to respond to orders from the boss, using conveyor belts.

To be added:
- there is only one type of product, though in the future there will be more!
- boss orders change too quickly sometimes, which will have to be fixed
- need to add a way for the products to be determined as the right one being asked
(likely through linking the order system to the checkOverlap system)
- need to add the "rent" bar that fills up with each consecutive order being filled
- have to add win/fail states
- still have to add timer systems (as described in my prototype proposal)
- add graphical assets
- add sound FX or music

- cut off controls once it is released on Dropzone
- if an object reaches the top of the screen (y < 0) can move it back to converyor belt area and change its velocity

-
- win/fail states, fail state as a general timer that counts down
- faliure to put the right object on the drop zone/dropping it off the converyor = reduced money and time
- need to make it so products don't overlap when spawned
- add other products??
- make product disappear after it reaches an edge after dropzone

STATES IDEAS
- have an intro state with a series of visuals explaining the story?
- could add a "PRESS ENTER TO SKIP" that brings you to the title screen
  - during title screen could add a button for bringing up controls
- Fail state version changes depending on where they got  (food, rent, healthcare, childcare) to if time runs out


- graphics ideas:
  - in order to keep the program lightweight, maybe steer away from heavy gifs.
  - for VFX, using animated opacity could be interesting (steam, dust, smoke, etc)
  - for the converyor belt, use the idea of the arrows
  - for the dropzone, having different colours to indicate a correct or incorrect object could be interesting


*/

"use strict";

let state = "game";

// this is a list of possible orders that are stored in an array
let orders = [`Red`];

//this is the starting order, that will be replaced once the game begins
let currentOrder = `YOU READY TO WORK?!`;

//this is an object that counts the time (going up)
let gameCounter;
//this sets the max amount of time for the game to be completed within (millis)
//if we subtract the gameTimer from the timeLimit, we will get how much time is left
let maxTime = 30;
//give the Timer a font
let gameTimerFont;
//give the Timer some properties
let gameTimer = {
  x: 1100,
  y: 50,
};

//this sets a timer, and ties it to the orders changing
let orderTimer = 3000;
let orderChange = orderTimer;

//this changes if the clicked order corresponds to the one displayed
//but is currently not implemented in this prototype version
let correctOrder = false;

//this sets up the variables and array for all of the products
//currently, they are named after products, even though they
//are just all different colour squares. This will be changed.
let products = [];
let numProducts = 15;
let dropzone = undefined;

//HUD elements declared
let rentbar = undefined;

//this sets up a boundary area for the products to spawn in on the belt
let topEdge = 400;
let bottomEdge = 750;
//some padding so the products don't look like they're right on the edge
let padding = 50;

function preload() {
  //preload fonts
  gameTimerFont = loadFont("assets/gameTimerfont.ttf");
}

//SET UP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function setup() {
  createCanvas(1200, 800);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(50);

  //create the Dropzone
  let x = 800;
  let y = 0;
  dropzone = new Dropzone(x, y);

  //HUD elements setup
  rentbar = new Rentbar(x, y);

  // Create the correct number of products and put them in our array
  for (let i = 0; i < numProducts; i++) {
    let x = random(0, width);
    //this keeps them within the conveyor belt boundary
    let y = constrain(
      random(topEdge + padding, height),
      topEdge,
      bottomEdge - padding
    );
    let product = new Product(x, y);
    products.push(product);
  }

  //need to create functioning deposit lanes change the product direction and detect
  //if it is overlapping with the product
  //ramp up in speed, as though the product gets "launched" down a tube
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    product.vx = product.speed;
    product.colour = "Red";
  }
}

// DRAW ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function draw() {
  //State switching !
  if (state === "title") {
    drawTitle();
  } else if (state === "intro") {
    drawIntro();
  } else if (state === "game") {
    drawGame();
  } else if (state === "success") {
    drawSuccess();
  } else if (state === `gameover`) {
    drawGameover();
  }
}

function drawGameover() {
  background(0);

  //this draws the gameTimer
  push();
  textFont(gameTimerFont);
  fill(255, 0, 0);
  stroke(0);
  textSize(100);
  text("YOU LOSE", width / 2, height / 2);
  pop();
}

// DRAW THE "GAME" STATE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function drawGame() {
  background(0);
  gameOverCheck();
  //this displays the Rentbar
  rentbar.display();

  //this displays the dropzone
  dropzone.display();

  //this begins the main counter for the game
  gameCounter = millis();

  //divide the millis into an integer
  gameCounter = int(gameCounter / 1000);

  //this draws the gameTimer
  push();
  textFont(gameTimerFont);
  fill(255);
  stroke(0);
  textSize(100);
  text(maxTime - gameCounter, gameTimer.x, gameTimer.y);
  pop();

  //this changes the gamestate if time runs out
  function gameOverCheck() {
    if (gameCounter >= 0) {
      state = "gameover";
    }
  }
  //this draws the product arrival conveyor belt
  push();
  stroke(255);
  fill(0);
  rect(0, topEdge, width, bottomEdge / 2);
  pop();

  //this checks if enough time has passed before changing the order
  if (millis() > orderChange) {
    currentOrder = random(orders);
    let r = random(0, 1);

    //attempting to add some randomness to the duration of the timer
    if (r < 0.5) {
      orderChange = millis() + orderTimer;
    }
  }

  //this displays the order
  text(currentOrder, width / 2, height - 50);

  //displays the product
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    product.move();
    product.wrap();
    product.display();
  }

  //this controls the drag and drop input of the mouse
  function mousePressed() {
    for (let i = 0; i < products.length; i++) {
      let product = products[i];
      product.mousePressed();
    }
  }

  function mouseReleased() {
    for (let i = 0; i < products.length; i++) {
      let product = products[i];
      if (product.isBeingDragged) {
        dropzone.checkOverlap(product);
        dropzone.checkColour(product);
      }
      product.mouseReleased();
    }
  }
}