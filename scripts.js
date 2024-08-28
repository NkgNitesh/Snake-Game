const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const playAgainButton = document.getElementById('playAgainButton');

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
};

let score = 0;
let highScore = 0;
let direction = 'RIGHT';
let theme = 'classic';
let speed = 100;

// Load sound effects
let eatSound = new Audio('eating-sound-effect-36186.mp3');
let gameOverSound = new Audio('game-over-31-179699.mp3');
// Place these at the top of your game.js file
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Initialize the direction of the snake
let snakeDirection = 'RIGHT'; // Make sure this aligns with your existing direction logic
// Add these listeners after your global variable declarations
document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;

    handleSwipe(); // Call function to handle swipe
}, false);

// Prevent scrolling on touch to enhance game interaction
document.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });



document.addEventListener('keydown', setDirection);

// Function to start the game
function startGame() {
    direction = 'RIGHT'; // Reset initial direction
    createSnake();
    createFood();
    score = 0;
    speed = 150; // Reset speed to default value
    playAgainButton.style.display = 'none'; // Hide Play Again button
    game = setInterval(gameLoop, speed);
}
function setDirection(event) {
    event.preventDefault();

    if (event.keyCode == 37 && direction != 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode == 38 && direction != 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode == 39 && direction != 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode == 40 && direction != 'UP') {
        direction = 'DOWN';
    }
}

function applyTheme() {
    if (theme === 'classic') {
        return { snakeColor: 'green', foodColor: 'red' };
    } else if (theme === 'dark') {
        return { snakeColor: 'white', foodColor: 'yellow' };
    } else if (theme === 'neon') {
        return { snakeColor: '#39FF14', foodColor: '#FF3131' };
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height;
}
function checkCollision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            gameOver(); // End game and show Play Again button
            return true;
        }
    }
    return false;
}
function gameOver() {
    clearInterval(game); // Stop the game loop
    playAgainButton.style.display = 'block'; // Show Play Again button
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let colors = applyTheme();

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? colors.snakeColor : 'lightgreen';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = 'darkgreen';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = colors.foodColor;
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == 'LEFT') snakeX -= box;
    if (direction == 'UP') snakeY -= box;
    if (direction == 'RIGHT') snakeX += box;
    if (direction == 'DOWN') snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        eatSound.play();
        food = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (collision(newHead, snake)) {
        gameOverSound.play();
        clearInterval(game);
        alert('Game Over! Your Score: ' + score);
        return;
    }

    snake.unshift(newHead);

    // Update score display
    document.getElementById('score').innerText = 'Score: ' + score;

    // Check and update high score
    if (score > highScore) {
        highScore = score;
    }
    document.getElementById('highScore').innerText = 'High Score: ' + highScore;
}
// Define the handleSwipe function near other input handling functions
function handleSwipe() {
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    // Determine if the swipe is more horizontal or vertical
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            // Right swipe
            if (snakeDirection !== 'LEFT') {
                snakeDirection = 'RIGHT';
            }
        } else {
            // Left swipe
            if (snakeDirection !== 'RIGHT') {
                snakeDirection = 'LEFT';
            }
        }
    } else {
        if (dy > 0) {
            // Down swipe
            if (snakeDirection !== 'UP') {
                snakeDirection = 'DOWN';
            }
        } else {
            // Up swipe
            if (snakeDirection !== 'DOWN') {
                snakeDirection = 'UP';
            }
        }
    }
}

function gameLoop() {
    // Assume this function is called continuously to update the game
function gameLoop() {
    // Other game logic (like drawing, collision checks, etc.)

    // Update the snake's position based on the current direction
    moveSnake();

    // Rest of the game loop logic
}

// Function to move the snake based on the current direction
function moveSnake() {
    let head = snake[0]; // Assume the snake is an array of objects representing its body segments

    // Determine new head position based on current direction
    let newHead;

    if (snakeDirection === 'UP') {
        newHead = { x: head.x, y: head.y - 1 }; // Move up
    } else if (snakeDirection === 'DOWN') {
        newHead = { x: head.x, y: head.y + 1 }; // Move down
    } else if (snakeDirection === 'LEFT') {
        newHead = { x: head.x - 1, y: head.y }; // Move left
    } else if (snakeDirection === 'RIGHT') {
        newHead = { x: head.x + 1, y: head.y }; // Move right
    }

    // Add the new head to the snake body
    snake.unshift(newHead);

    // Remove the last segment of the snake (unless it has just eaten food)
    snake.pop();
}

    draw();
    if (score % 15 === 0 && score !== 0) {
        speed -= 1;
        if (speed<70) speed=70;
        clearInterval(game);
        game = setInterval(gameLoop, speed);
    }
    
}

let game = setInterval(gameLoop, speed);





// Add event listener to Play Again button to restart the game
playAgainButton.addEventListener('click', startGame);

// Initialize game on page load
startGame();
