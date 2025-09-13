import { getDistance } from './utils.js';

// --- Game Constants ---
const TICKS_PER_SECOND = 60;
const SECONDS_PER_TICK = 1 / TICKS_PER_SECOND;
const MATCH_DURATION_SECONDS = 60;
const MAP_WIDTH = 800; // Example map size
const MAP_HEIGHT = 600; // Example map size

export function updateGameState(gameState) {
  // If a winner is already decided, do nothing.
  if (gameState.winner) {
    return;
  }

  // --- Update Timers ---
  gameState.tick++;
  gameState.timeElapsed += SECONDS_PER_TICK;

  // --- 1. Move Mobs ---
  // We loop backwards to safely remove mobs from the array as they are processed.
  for (let i = gameState.mobs.length - 1; i >= 0; i--) {
    const mob = gameState.mobs[i];
    const targetBase = gameState.bases[mob.targetBase];
    
    const distance = getDistance(mob.position, targetBase.position);
    
    // Calculate direction vector
    const dirX = (targetBase.position.x - mob.position.x) / distance;
    const dirY = (targetBase.position.y - mob.position.y) / distance;
    
    // Move the mob
    mob.position.x += dirX * mob.speed * SECONDS_PER_TICK;
    mob.position.y += dirY * mob.speed * SECONDS_PER_TICK;
  }
  
  // --- 2. Hero Actions (Attack Logic Placeholder) ---
  for (const hero of gameState.heroes) {
    // TODO:
    // a. Find the best target based on hero.behavior ('defensive', 'neutral', 'offensive').
    // b. If a target is found and is within hero.attackRange, perform an attack.
    // c. This is where you would also handle skill cooldowns and auto-casting.
  }
  
  // --- 3. Resolve Damage and Deaths (Placeholder) ---
  // TODO:
  // a. Apply damage from hero attacks to mobs.
  // b. Remove any mobs (and later, heroes) whose health is <= 0.
  
  // --- 4. Check for Mobs Reaching a Base ---
  for (let i = gameState.mobs.length - 1; i >= 0; i--) {
    const mob = gameState.mobs[i];
    const targetBase = gameState.bases[mob.targetBase];
    
    // Check if mob reached the base (using a small radius)
    if (getDistance(mob.position, targetBase.position) < 10) {
      targetBase.health--; // Decrease base health
      gameState.mobs.splice(i, 1); // Remove the mob
    }
  }

  // --- 5. Check for Win Conditions ---
  const base1Health = gameState.bases.player1.health;
  const base2Health = gameState.bases.player2.health;

  // Win by Knockout
  if (base1Health <= 0) {
    gameState.winner = 'player2';
    return;
  }
  if (base2Health <= 0) {
    gameState.winner = 'player1';
    return;
  }

  // Win by Timeout
  if (gameState.timeElapsed >= MATCH_DURATION_SECONDS) {
    // Tie-breaker 1: More lives remaining
    if (base1Health > base2Health) {
      gameState.winner = 'player1';
    } else if (base2Health > base1Health) {
      gameState.winner = 'player2';
    } else {
      // Tie-breakers 2 (damage) and 3 (mob distance) would be calculated here.
      // For now, we can call it a draw or default to player1.
      gameState.winner = 'draw'; 
    }
  }
}
