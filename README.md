# unicorn-platformer
A platformer game with unicorns

## Code Overview

This project implements a simple 2D platformer game using HTML5 Canvas, CSS, and JavaScript.

### File Structure:

*   `index.html`: The main HTML file that sets up the game canvas and links to the CSS and JavaScript files.
*   `style.css`: Contains basic styling for the webpage and the canvas.
*   `game.js`: The core game logic, including physics, game state management, and rendering.
*   `assets/`: Directory for game images (unicorn, donut, obstacle).

### Game Mechanics:

The game features a unicorn that automatically runs across platforms.
*   **Controls:** Press `Space` to make the unicorn jump.
*   **Objective:** Jump across platforms, avoid red hazards, and collect donuts.
*   **Scoring:** Points are awarded for survival time, with bonus points for collecting donuts.
*   **Hazards:** Red boxes on platforms that end the game on collision.
*   **Forgiving Jumps:** A "ledge grab" mechanic allows for more forgiving platforming.
*   **Game Over:** Occurs if the unicorn hits a hazard or falls off the screen.

### How to Run:

1.  Ensure you have the `unicorn.png` and `donut.png` images in the `assets/` directory (or provide your own).
2.  Open `index.html` in your web browser.

### Key JavaScript Concepts Used:

*   **HTML5 Canvas API:** For rendering all game elements.
*   **Game Loop (`requestAnimationFrame`):** Continuously updates game state (`update()`) and redraws the screen (`draw()`).
*   **Physics:** Simple gravity and jump mechanics.
*   **Collision Detection:** For platforms, hazards, and donuts.
*   **Procedural Generation:** Platforms, hazards, and donuts are generated dynamically as the game progresses.
