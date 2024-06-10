// Create a canvas element, set its ID and dimensions, and append it to the body of the document
let canvas = document.createElement('canvas');
canvas.id = 'game';
canvas.width = 512;
canvas.height = 512;
document.body.appendChild(canvas);

// Initialize the score
let score = 0;

// Get the 2D rendering context for the canvas
let context = canvas.getContext('2d');

// Define the size of a box (a segment of the snake or a piece of food)
let box = 32;

// Initialize the snake as an array of one segment located in the middle of the game area
let snake = [];
snake[0] = { x: 8 * box, y: 8 * box };

// Initialize the obstacles as an array of objects
let obstacles = [
    { x: 5 * box, y: 7 * box },
    { x: 8 * box, y: 12 * box },
    { x: 13 * box, y: 3 * box }
];

// Set the initial direction of the snake to the right
let direction = "right";

// Place the food at a random location
let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}

// Update the score and display it
function updateScore() {
    score++;
    document.getElementById('score').innerText = 'Score: ' + score;
}

// Function to draw the game area
function createBG() {
    context.fillStyle = "lightgreen";
    context.fillRect(0, 0, 16 * box, 16 * box);
}

// Function to draw the snake
function createSnake() {
    for (i = 0; i < snake.length; i++) {
        context.fillStyle = "green";
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

// Function to draw the obstacles
function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        context.fillStyle = "grey";
        context.fillRect(obstacles[i].x, obstacles[i].y, box, box);
    }
}

// Function to draw the food
function drawFood() {
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, box, box);
}

// Event listener to update the direction based on the arrow key pressed by the user
document.addEventListener('keydown', update);

function update(event) {
    if (event.keyCode == 37 && direction != 'right') direction = 'left';
    if (event.keyCode == 38 && direction != 'down') direction = 'up';
    if (event.keyCode == 39 && direction != 'left') direction = 'right';
    if (event.keyCode == 40 && direction != 'up') direction = 'down';
}

// Function to update the game state
function startGame() {
    // If the snake hits the border of the game area, it appears on the opposite side
    if (snake[0].x > 15 * box && direction == "right") snake[0].x = 0;
    if (snake[0].x < 0 && direction == 'left') snake[0].x = 16 * box;
    if (snake[0].y > 15 * box && direction == "down") snake[0].y = 0;
    if (snake[0].y < 0 && direction == 'up') snake[0].y = 16 * box;

    // If the snake hits itself, the game is over
    for (i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            clearInterval(game);
            alert('Game Over :(');
        }
    }

    // Draw the game area, the snake, and the food
    createBG();
    createSnake();
    drawFood();
    drawObstacles();

    // Calculate the new head position of the snake based on the current direction
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "right") snakeX += box;
    if (direction == "left") snakeX -= box;
    if (direction == "up") snakeY -= box;
    if (direction == "down") snakeY += box;

    // Wrap the snake's position if it goes off the edge of the game area
    if (snakeX < 0) snakeX = 15 * box;
    if (snakeX > 15 * box) snakeX = 0;
    if (snakeY < 0) snakeY = 15 * box;
    if (snakeY > 15 * box) snakeY = 0;

    // If the new head position coincides with an obstacle, the game is over
    for (let i = 0; i < obstacles.length; i++) {
        if (snakeX == obstacles[i].x && snakeY == obstacles[i].y) {
            clearInterval(game);
            alert('Game Over :(');
        }
    }

    // If the new head position coincides with the food position, a new food is placed and the snake grows
    // Otherwise, the snake moves by removing the last segment
    if (snakeX != food.x || snakeY != food.y) {
        snake.pop();
    } else {
        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;
        updateScore();
    }

    // Add the new head to the front of the snake
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);
}

// Start the game loop
let game = setInterval(startGame, 100);