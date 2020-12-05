const { body } = document;
const canvas = document.createElement('canvas');

const ctx = canvas.getContext('2d');

const width = 500;
const height = 700;

const canvasPosition = window.innerWidth / 2 - width / 2;

let widthBatUser = 225;
let widthBatComputer = 225;

const batHeight = 10;
const batWidth = 50;
const batDiff = 25;

let ballX = 250;
let ballY = 350;

let playerMoved = false;
let batContact = false;

let speedY;
let speedX;
let trajectoryX;

let scorePlayer = 0;
let scoreComputer = 0;

function createCanvas() {
    canvas.height = height;
    canvas.width = width;
    body.appendChild(canvas);
    renderCanvas();
}

function renderCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'white';
    ctx.fillRect(widthBatUser, height - batDiff, batWidth, batHeight);
    ctx.fillRect(widthBatComputer, 15, batWidth, batHeight);

    ctx.beginPath();
    ctx.setLineDash([4]);
    ctx.moveTo(0, 350);
    ctx.lineTo(500, 350);
    ctx.strokeStyle = 'white';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ballX, ballY, 5, 2 * Math.PI, false);
    ctx.fill();

    ctx.font = '32px Courier New';
    ctx.fillText(scorePlayer, 20, canvas.height / 2 + 50);
    ctx.fillText(scoreComputer, 20, canvas.height / 2 - 30);
}

function ballReset() {
    ballX = width / 2;
    ballY = height / 2;
    speedY = -3;
    batContact = false;
}

function ballMove() {
    ballY += -speedY;
    if (playerMoved && batContact) {
        ballX += speedX;
    }
}
function ballBoundries() {
    //left wall
    if (ballX < 0) {
        speedX = -speedX;
    }

    //right wall
    if (ballX > width) {
        speedX = -speedX;
    }

    //player bat
    if (ballY > height - batDiff) {
        if (ballX > widthBatUser && ballX < widthBatUser + batWidth) {
            batContact = true;
            if (playerMoved) {
                speedY -= 1;
                if (speedY < -10) {
                    speedY = -10;
                }
            }
            speedY = -speedY;
            trajectoryX = ballX - (widthBatUser + batDiff);
            speedX = trajectoryX * 0.3;
        } else if (ballY > height) {
            ballReset();
        }
    }

    //computer bat
    if (ballY < batDiff) {
        if (ballX > widthBatComputer && ballX < widthBatComputer + batWidth) {
            batContact = true;
            if (playerMoved) {
                speedY += 1;
                if (speedY > 10) {
                    speedY = 10;
                }
            }
            speedY = -speedY;
            trajectoryX = ballX - (widthBatComputer + batDiff);
            speedX = trajectoryX * 0.3;
        } else if (ballY < 0) {
            ballReset();
        }
    }
}

function animate() {
    renderCanvas();
    ballMove();
    ballBoundries();
    window.requestAnimationFrame(animate);
}

const startGame = () => {
    scorePlayer = 0;
    scoreComputer = 0;
    ballReset();
    createCanvas();
    animate();

    canvas.addEventListener('mousemove', event => {
        playerMoved = true;
        widthBatUser = event.clientX - canvasPosition - batWidth / 2;
        canvas.style.cursor = 'none';
    });
};
startGame();
