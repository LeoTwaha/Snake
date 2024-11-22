const gameBorder = document.getElementById("game-border");
const gameBox = document.getElementById("game-box");
const startBtn = document.getElementById("startBtn");
const title = document.getElementById("title");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

let snake = [{ x: 10, y: 10 }];
let apple = { x: 0, y: 0 };
let direction = 'up';
let isGameStarted = false;
let gameInterval;
let highScore = 0;
let gameSpeedDelay = 200;
let gridSize = 20;
var x = window.matchMedia("(max-width: 700px)");

if(x.matches){
    gridSize -= 5;
}
startBtn.addEventListener("click", () => {
    isGameStarted = true;
    startGame();
});

// Main game functions
function draw() {
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake() {
    gameBox.innerHTML = ""; // Clear the gameBox to avoid duplicates
    snake.forEach((segment) => {
        const snakeElement = createGameElement("div", "snake");
        setPosition(snakeElement, segment);
        gameBox.appendChild(snakeElement);
    });
}

function drawFood() {
    const appleElement = createGameElement('div', 'apple');
    setPosition(appleElement, apple);
    gameBox.appendChild(appleElement);
}

function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position) {
    element.style.gridColumnStart = position.x + 1; // Adjust for 1-based CSS grid
    element.style.gridRowStart = position.y + 1;
}

function generateFood() {
    let newApple;
    do {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        newApple = { x, y };
    } while (snake.some(segment => segment.x === newApple.x && segment.y === newApple.y));
    return newApple;
}

function startGame() {
    snake = [{ x: 10, y: 10 }]; // Reset snake
    apple = generateFood(); // Generate first apple
    direction = 'up'; // Reset direction
    gameSpeedDelay = 200; // Reset speed
    gameBox.innerHTML = ""; // Clear the game board

    // Update UI
    gameBorder.style.display = "block";
    title.style.display = "none";
    startBtn.style.display = "none";

    // Start game interval
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Movement logic
function move() {
    const head = { ...snake[0] }; // Copy the current head

    // Update head position based on direction
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }

    snake.unshift(head); // Add new head to the snake

    // Check if the snake eats the apple
    if (head.x === apple.x && head.y === apple.y) {
        apple = generateFood(); // Generate new apple
        increaseSpeed(); // Increase speed
    } else {
        snake.pop(); // Remove tail if no apple is eaten
    }
}

function increaseSpeed() {
    if (gameSpeedDelay > 25) {
        if (gameSpeedDelay > 150) {
            gameSpeedDelay -= 5;
        } else if (gameSpeedDelay > 100) {
            gameSpeedDelay -= 3;
        } else if (gameSpeedDelay > 50) {
            gameSpeedDelay -= 2;
        } else {
            gameSpeedDelay -= 1;
        }
    }

    // Restart the interval with the new speed
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Collision logic
function checkCollision() {
    const head = snake[0];

    // Check collision with walls
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        resetGame();
        return;
    }

    // Check collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
    }
}

// Game reset logic
function resetGame() {
    updateHighScore();
    clearInterval(gameInterval);
    isGameStarted = false;

    // Reset UI
    gameBorder.style.display = "none";
    title.style.display = "block";
    startBtn.style.display = "block";
}

// Update score logic
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString();
}

// High score logic
function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString();
    }
}

// Direction control
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (direction !== "down") direction = "up";
            break;
        case "ArrowDown":
            if (direction !== "up") direction = "down";
            break;
        case "ArrowLeft":
            if (direction !== "right") direction = "left";
            break;
        case "ArrowRight":
            if (direction !== "left") direction = "right";
            break;
    }
});

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    evt.preventDefault();
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* right swipe */ 
            direction = "left";
        } else {
            /* left swipe */
            direction = "right";
            
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* down swipe */ 
            direction = "up";
        } else { 
            /* up swipe */
            direction = "down";
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};