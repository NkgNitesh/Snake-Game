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

function gameLoop() {
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
