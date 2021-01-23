const { body } = document;

// Zeichenfläche (Canvas) wird definiert.
// Sobald das Spiel vorbei ist, wird ein
// neuer DIV Container erzeugt.
const canvas = document.createElement('canvas');
const gameOverEl = document.createElement('div');

// Definiert ein 2D Spielfeld
const ctx = canvas.getContext('2d');

// Legt die breite und höhe des "Spielfelds" (Canvas) fest.
const width = 500;
const height = 700;

// Positiohiert das Canvas Element in der Mitte des Bildschirms.
const canvasPosition = window.innerWidth / 2 - width / 2;

// Breite des Schlägers des Spielers und des Computers
let widthBatUser = 225;
let widthBatComputer = 225;

// Höhe des Schlägers, breite und Abstand zum Spielfeldrand.
const batHeight = 10;
const batWidth = 50;
const batDiff = 25;

// X und Y Position des Balls bei Spielstart.
let ballX = 250;
let ballY = 350;

let playerMoved = false;
let batContact = false;
let newGame = true;

let speedY;
let speedX;
let speedComputerBat;
let trajectoryX;

// Punktezahl bei Spielstart und Siegbedingung (winningScore).
let scorePlayer = 0;
let scoreComputer = 0;
let winningScore = 2;
let isGameOver = false;

// Zeichenfläche wird generiert mit einer
// Höhe und Breite, im Body angehängt und gerendert.
function createCanvas() {
    canvas.height = height;
    canvas.width = width;
    body.appendChild(canvas);
    renderCanvas();
}

// Die Zeichenfläche wird als Rechteck erzeugt mit HG schwarz.
function renderCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Die Spieler und Computer Schläger werden generiert mit einem Abstand zur Spielfläche.
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

    // Score Anzeige wird formatiert.
    ctx.font = '32px Courier New';
    ctx.fillText(scorePlayer, 20, canvas.height / 2 + 50);
    ctx.fillText(scoreComputer, 20, canvas.height / 2 - 30);
}

// Ball wird resetet zum Anfangszustand,
// die X und Y Position, die Geschwindigkeit
// sowie die Geschwindigkeit des Computer Schlägers.
// Es hat noch kein Kontakt zu einem Schläger gegeben.
function ballReset() {
    ballX = width / 2;
    ballY = height / 2;
    speedY = -3;
    speedComputerBat = 4;
    batContact = false;
}

// Die Geschwindigkeit des Balls beim Abprallen wird gesetzt
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
                    speedComputerBat = 6;
                }
            }
            speedY = -speedY;
            trajectoryX = ballX - (widthBatUser + batDiff);
            speedX = trajectoryX * 0.3;
        } else if (ballY > height) {
            ballReset();
            scoreComputer++;
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
            scorePlayer++;
        }
    }
}
function showWinnerScreen(winner) {
    // alert(`And the winner is ${winner}`);
    canvas.hidden = true;
    // Container
    gameOverEl.textContent = '';
    gameOverEl.classList.add('game-over-container');
    // Title
    const title = document.createElement('h1');
    title.textContent = `${winner} Wins!`;
    // Button
    const playAgainBtn = document.createElement('button');
    playAgainBtn.setAttribute('onclick', 'startGame()');
    playAgainBtn.textContent = 'Play Again';
    // Append
    gameOverEl.append(title, playAgainBtn);
    body.appendChild(gameOverEl);
}

function gameOver() {
    if (scorePlayer === winningScore || scoreComputer === winningScore) {
        isGameOver = true;
        let winner = scorePlayer > scoreComputer ? 'Player' : 'Computer';
        showWinnerScreen(winner);
    }
}

function ballMoveKi() {
    if (playerMoved) {
        if (widthBatComputer + batDiff < ballX) {
            widthBatComputer += speedComputerBat;
        } else {
            widthBatComputer -= speedComputerBat;
        }
    }
}

function animate() {
    renderCanvas();
    ballMove();
    ballBoundries();
    ballMoveKi();
    gameOver();
    if (!isGameOver) {
        window.requestAnimationFrame(animate);
    }
}

const startGame = () => {
    if (isGameOver && !newGame) {
        body.removeChild(gameOverEl);
        canvas.hidden = false;
    }
    isGameOver = false;
    newGame = false;
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
