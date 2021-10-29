const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');
canvas.width = 1500;
canvas.height = 700;

let rainDrops = [];
let cats = [];

const background = new Image();
background.src = "images/city.png";
const catSprite = new Image();
catSprite.src = "images/Walk.png";
const playerSprite = new Image();
playerSprite.src = "images/umbrella.png";

class Raindrop {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Cat {
    constructor(x, y, radius, color, velocity) {
        this.radius = radius
        this.x = x
        this.y = y
        this.color = color
        this.velocity = velocity
        this.height = 48;
        this.width = 48;
        this.frame = 0;
    }
    draw() {
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Player {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.width = 963;
        this.height = 880;
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

let player = new Player(canvas.width / 2, canvas.height / 2, 55, "green", { x: 0, y: 0 })

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    c.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function spawnRain() {
    setInterval(() => {
        rainDrops.push(new Raindrop(Math.random() * canvas.width, 0, Math.random() * (4 - 2) + 2, "blue", { x: 0, y: 8 }));
        rainDrops.push(new Raindrop(Math.random() * canvas.width, 0, Math.random() * (4 - 2) + 2, "blue", { x: 0, y: 8 }));
    }, 1)
}

function spawnCats() {
    setInterval(() => {
        cats.push(new Cat(0, canvas.height - 10, 6, "red", { x: Math.random() * (5 - 1) + 1, y: 0 }));
    }, Math.random() * (2000 - 1000) + 1000)
}

function dist(rain, other) {
    return Math.sqrt((rain.x - other.x) * (rain.x - other.x) + (rain.y - other.y) * (rain.y - other.y));
}

let mousePos = { x: 0, y: 0 };
addEventListener("mousemove", (event) => {
    mousePos = { x: event.x, y: event.y };
})

function handleFrame(character) {
    if (character.frame < 5) character.frame++;
    else character.frame = 0;
}

let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    now = Date.now();
    elapsed = now - then;

    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(background, 0, 0, canvas.width, canvas.height);
    player.y = 500;
    player.x = mousePos.x;
    drawSprite(playerSprite, 0, 0, player.width, player.height, player.x - 55, player.y - 45, player.width / 5, player.height / 5);
    //player.draw();


    cats.forEach((cat, index) => {
        rainDrops.forEach((rain, rIndex) => {
            if (dist(rain, cat) <= rain.radius + cat.radius) {
                cat.radius -= 1;
            }
        })
        if (cat.radius <= 1 || cat.x >= canvas.width + cat.radius) {
            setTimeout(() => {
                cats.splice(index, 1)
            }, 0)
        }
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            handleFrame(cat);
        }
        drawSprite(catSprite, cat.width * cat.frame, 0, cat.width, cat.height, cat.x - 20, cat.y - 55, cat.width, cat.height);
        cat.update();
    })

    rainDrops.forEach((rain, index) => {
        if ((dist(rain, player) <= player.radius)) {
            setTimeout(() => {
                rainDrops.splice(index, 1)
            }, 0)
        }
        rain.update();
    })

}

spawnRain();
spawnCats();
startAnimating(12);