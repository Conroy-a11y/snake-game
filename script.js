// grab the canvas element and 2D drawing context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// size of each cell in pixels and number of cells per row/column
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// game state variables
let snake = [{ x: 10, y: 10 }]; // array of segments, head at index 0
let velocity = { x: 0, y: 0 };   // current movement direction
let apple = { x: 15, y: 15 };    // apple location on grid
let score = 0;                   // player's score

// listen for keyboard input to control the snake

document.addEventListener('keydown', keyDown);

// main loop: update game state, render, and schedule next tick
function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, 100); // adjust delay for speed
}

// update the game state on each tick
function update() {
    // compute new head position based on current velocity
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    // screen wrap: appear on opposite side when leaving bounds
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    // check for collision with any existing segment
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            reset(); // restart game on self-collision
            return;
        }
    }

    // add new head to the front of the snake array
    snake.unshift(head);

    // apple eaten?
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        placeApple(); // relocate apple
    } else {
        // remove tail segment to keep length constant
        snake.pop();
    }
}

// render the current game state to the canvas
function draw() {
    // clear the canvas with background color
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw each segment of the snake
    ctx.fillStyle = 'lime';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // draw the apple
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2);

    // draw the score in top-left corner
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

// handle arrow key input and update snake velocity
function keyDown(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (velocity.y === 0) velocity = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (velocity.y === 0) velocity = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (velocity.x === 0) velocity = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (velocity.x === 0) velocity = { x: 1, y: 0 };
            break;
    }
}

// randomly position the apple on the grid, avoiding the snake
function placeApple() {
    apple.x = Math.floor(Math.random() * tileCount);
    apple.y = Math.floor(Math.random() * tileCount);
    // if the apple lands on the snake, try again
    for (let segment of snake) {
        if (segment.x === apple.x && segment.y === apple.y) {
            placeApple();
            return;
        }
    }
}

// reset game state to initial values after a crash
function reset() {
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 0, y: 0 };
    score = 0;
    placeApple();
}

placeApple();
gameLoop();
