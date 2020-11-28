const { body } = document;
const canvas = document.createElement('canvas');

const ctx = canvas.getContext('2d');

const width = 500;
const height = 700;

const canvasPosition = window.screen.width / 2 - width / 2;

let widthBatUser = 225;
let widthBatComputer = 225;

const batHeight = 10;
const batWidth = 50;

let ballX = 250;
let ballY = 350;

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
    ctx.fillRect(widthBatUser, height - 25, batWidth, batHeight);
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

function animate() {
    renderCanvas();
}

const startGame = () => {
    scorePlayer = 0;
    scoreComputer = 0;

    createCanvas();

    setInterval(animate, 1000 / 60);

    canvas.addEventListener('mousemove', event => {
        widthBatUser = event.clientX - canvasPosition - batWidth / 2;
        console.log(event);
        console.log(event.clientX);
        canvas.style.cursor = 'none';
    });
};
startGame();
