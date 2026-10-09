// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color || 'white';
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia dirección al resetear
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false, color = 'white') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 5;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

   //rastreando la pelota más cercana
    autoMove(balls) {
        let closestBall = balls[0];
        for (let ball of balls) {
            if (ball.x > closestBall.x) {
                closestBall = ball;
            }
        }

        if (closestBall.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (closestBall.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {

        this.balls = [
            new Ball(canvas.width / 2, canvas.height / 2, 10, 4, 3, '#FF5733'),
            new Ball(canvas.width / 2, canvas.height / 2, 12, -3, 5, '#33FF57'),
            new Ball(canvas.width / 2, canvas.height / 2, 8, 5, -4, '#3357FF'),
            new Ball(canvas.width / 2, canvas.height / 2, 15, -4, -3, '#F3FF33'),
            new Ball(canvas.width / 2, canvas.height / 2, 7, 6, 2, '#FF33F3')
        ];

        // Paleta 1 (Jugador): Doble de alto (200px) y color personalizado
        this.paddle1 = new Paddle(0, canvas.height / 2 - 100, 10, 200, true, '#00E5FF');
        // Paleta 2 (CPU): Alto estándar (100px) y color personalizado
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 50, 10, 100, false, '#FF9100');

        this.keys = {};
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let ball of this.balls) {
            ball.draw();
        }

        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {
        for (let ball of this.balls) {
            ball.move();

            // Colisión con la paleta 1 (Jugador)
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
                ball.speedX = Math.abs(ball.speedX);
            }

            // Colisión con la paleta 2 (CPU)
            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
                ball.speedX = -Math.abs(ball.speedX);
            }

            // Detectar cuando la pelota sale de los bordes laterales
            if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
                ball.reset();
            }
        }

        // Movimiento de la paleta 1 (Jugador)
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        // Movimiento de la paleta 2 (CPU)
        this.paddle2.autoMove(this.balls);
    }

    // Captura de teclas para el control de la paleta
    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();