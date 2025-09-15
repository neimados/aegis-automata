import { createSeededRandom } from './utils.js';

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

export class GameState {
  constructor(seed = 'default-seed') {
    this.seed = seed;
    this.rng = createSeededRandom(hashCode(seed));
    
    this.mobs = [];
    this.heroes = [];
    this.bases = {};
    
    this.tick = 0;
    this.timeElapsed = 0;
    this.totalDamage = { player1: 0, player2: 0 }; // Add this
    this.winner = null;
  }
}