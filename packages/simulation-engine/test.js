const { GameState } = require('./index.js');
const { Hero, Mob } = require('./entities.js');
const { updateGameState } = require('./gameLoop.js'); // Import the new function

console.log('--- Running Simulation Test ---');

// 1. Create a new game state
const gameState = new GameState({}, {}, 'match-alpha');

// 2. Add a mob heading for player1's base
const mob1 = new Mob('grunt', { x: 750, y: 50 }, 'player1'); // Start near player2's base
gameState.mobs.push(mob1);

console.log('Initial State:');
console.log(`Mob Position: { x: ${mob1.position.x}, y: ${mob1.position.y} }`);
console.log('Player 1 Base Health:', gameState.bases.player1.health);

// 3. Run the simulation for 10 seconds (600 ticks)
for (let i = 0; i < 10 * 60; i++) {
    updateGameState(gameState);
}

console.log('\nState after 10 seconds:');
console.log(`Mob Position: { x: ${mob1.position.x.toFixed(2)}, y: ${mob1.position.y.toFixed(2)} }`);
console.log('Player 1 Base Health:', gameState.bases.player1.health);

// 4. Continue simulation until a winner is decided
while (!gameState.winner) {
    updateGameState(gameState);
}

console.log('\nFinal State:');
console.log('Winner:', gameState.winner);
console.log('Match Duration (s):', gameState.timeElapsed.toFixed(2));
console.log('Player 1 Base Health:', gameState.bases.player1.health);
console.log('Player 2 Base Health:', gameState.bases.player2.health);