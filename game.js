const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Image Assets
const unicornImg = new Image();
const donutImg = new Image();

unicornImg.src = 'assets/unicorn.png';
donutImg.src = 'assets/donut.png';

// Game variables
let unicorn = {
    x: 50,
    y: 250,
    width: 50,
    height: 50,
    velocityY: 0,
    isJumping: true // Start in the air
};

let gravity = 0.5;
let jumpStrength = -13;

let platforms = [];
let donuts = [];
let hazards = [];
let score = 0;
let gameOver = false;
let gameSpeed = 3.0;
let frameCount = 0;
const groundLevel = canvas.height - 20;

// Asset loading
let assetsLoaded = 0;
const totalAssets = 2; // unicorn and donut
function assetLoaded() {
    assetsLoaded++;
    if (assetsLoaded === totalAssets) {
        resetGame();
        gameLoop();
    }
}

unicornImg.onload = assetLoaded;
donutImg.onload = assetLoaded;

// Game Loop
function gameLoop() {
    if (!gameOver) {
        update();
    }
    draw(); // Draw even on game over
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    frameCount++;
    score += 0.1;

    // Apply gravity
    unicorn.velocityY += gravity;
    unicorn.y += unicorn.velocityY;

    // Platform generation
    let lastPlatform = platforms[platforms.length - 1];
    if (lastPlatform.x + lastPlatform.width < canvas.width) {
        generatePlatform();
    }

    // Move everything
    platforms.forEach(p => p.x -= gameSpeed);
    donuts.forEach(d => d.x -= gameSpeed);
    hazards.forEach(h => h.x -= gameSpeed);

    // Remove off-screen items
    platforms = platforms.filter(p => p.x + p.width > 0);
    donuts = donuts.filter(d => d.x + d.width > 0);
    hazards = hazards.filter(h => h.x + h.width > 0);

    // Hazard collision check (must happen before landing on platforms)
    for (const h of hazards) {
        if (
            unicorn.x < h.x + h.width &&
            unicorn.x + unicorn.width > h.x &&
            unicorn.y < h.y + h.height &&
            unicorn.y + unicorn.height > h.y
        ) {
            gameOver = true;
            return; // Exit update loop immediately
        }
    }

    // Platform collision detection
    let onPlatform = false;
    for (const p of platforms) {
        // 1. Check for landing on top
        if (
            unicorn.velocityY >= 0 && // Is falling
            unicorn.y + unicorn.height >= p.y && // Feet are at or below platform top
            unicorn.y + unicorn.height <= p.y + p.height && // But not fallen through
            unicorn.x + unicorn.width > p.x && // Horizontally aligned
            unicorn.x < p.x + p.width
        ) {
            unicorn.y = p.y - unicorn.height;
            unicorn.velocityY = 0;
            unicorn.isJumping = false;
            onPlatform = true;
            break;
        }
        // 2. Ledge Grab Logic
        else if (
            unicorn.isJumping &&
            unicorn.x + unicorn.width >= p.x && // Front of unicorn hits platform
            unicorn.x + unicorn.width <= p.x + 20 && // Within the first 20px of the platform edge
            unicorn.y + unicorn.height > p.y && // Feet are below platform top
            unicorn.y < p.y // Head is above platform top
        ) {
            unicorn.y = p.y - unicorn.height; // Snap to top
            unicorn.velocityY = 0;
            unicorn.isJumping = false;
            onPlatform = true;
            break;
        }
    }

    if (!onPlatform) {
        unicorn.isJumping = true;
    }

    // Donut collection
    donuts.forEach((d, index) => {
        if (
            unicorn.x < d.x + d.width &&
            unicorn.x + unicorn.width > d.x &&
            unicorn.y < d.y + d.height &&
            unicorn.y + unicorn.height > d.y
        ) {
            score += 100;
            donuts.splice(index, 1);
        }
    });
    
    // Game over condition: falling off the screen
    if (unicorn.y > canvas.height) {
        gameOver = true;
    }

    // Increase speed over time
    if (frameCount > 0 && frameCount % 500 === 0) {
        gameSpeed += 0.25;
    }
}

function generatePlatform() {
    const lastPlatform = platforms[platforms.length - 1];
    const newY = lastPlatform.y + (Math.random() - 0.5) * 150;
    const constrainedY = Math.max(150, Math.min(groundLevel - 50, newY));
    const newWidth = 100 + Math.random() * 150;
    const newGap = 80 + Math.random() * 70;

    const newPlatform = {
        x: lastPlatform.x + lastPlatform.width + newGap,
        y: constrainedY,
        width: newWidth,
        height: 20
    };
    platforms.push(newPlatform);

    // Occasionally add a hazard on the new platform, ensuring safe zones
    const safeZone = 60; // Safe space at start and end of platform
    const hazardWidth = 40;
    if (Math.random() > 0.6 && newPlatform.width > (safeZone * 2) + hazardWidth) {
        hazards.push({
            x: newPlatform.x + safeZone + Math.random() * (newPlatform.width - (safeZone * 2) - hazardWidth),
            y: newPlatform.y - 15, // Sit on top of the platform
            width: hazardWidth,
            height: 15
        });
    }
    // Occasionally add a donut on top of the new platform (if there's no hazard)
    else if (Math.random() > 0.4) {
        donuts.push({
            x: newPlatform.x + newPlatform.width / 2 - 15,
            y: newPlatform.y - 40,
            width: 30,
            height: 30
        });
    }
}


// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    ctx.fillStyle = '#6b4423';
    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    // Draw hazards
    ctx.fillStyle = 'red';
    hazards.forEach(h => {
        ctx.fillRect(h.x, h.y, h.width, h.height);
    });

    // Draw donuts
    donuts.forEach(d => {
        ctx.drawImage(donutImg, d.x, d.y, d.width, d.height);
    });

    // Draw unicorn
    ctx.drawImage(unicornImg, unicorn.x, unicorn.y, unicorn.width, unicorn.height);

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + Math.floor(score), 10, 30);
    
    if(gameOver) {
        drawGameOver();
    }
}

// Draw game over screen
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = '30px Arial';
    ctx.fillText('Score: ' + Math.floor(score), canvas.width / 2, canvas.height / 2 + 10);
    ctx.font = '20px Arial';
    ctx.fillText('Press Space to Restart', canvas.width / 2, canvas.height / 2 + 50);
    ctx.textAlign = 'left'; // Reset alignment
}


// Event Listeners
document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameOver) {
            resetGame();
        } else if (!unicorn.isJumping) {
            unicorn.velocityY = jumpStrength;
            unicorn.isJumping = true;
        }
    }
});

function resetGame() {
    unicorn.y = 250;
    unicorn.x = 50;
    unicorn.velocityY = 0;
    unicorn.isJumping = true;

    platforms = [];
    donuts = [];
    hazards = [];
    score = 0;
    gameOver = false;
    gameSpeed = 3.0;
    frameCount = 0;

    // Create initial set of platforms
    platforms.push({ x: 0, y: 300, width: 300, height: 20 });
    for(let i=0; i<5; i++) {
        generatePlatform();
    }
}
