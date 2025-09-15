import { getDistance } from './utils.js';

// --- Game Constants ---
const TICKS_PER_SECOND = 60;
const SECONDS_PER_TICK = 1 / TICKS_PER_SECOND;
const MATCH_DURATION_SECONDS = 60;

export function updateGameState(gameState) {
    if (gameState.winner) return;

    // --- Update Timers ---
    gameState.tick++;
    gameState.timeElapsed += SECONDS_PER_TICK;

    // --- 1. Move Mobs ---
    for (let i = gameState.mobs.length - 1; i >= 0; i--) {
        const mob = gameState.mobs[i];
        const targetBase = gameState.bases[mob.targetBase];
        if (!targetBase) continue; // Skip if target base doesn't exist

        const distance = getDistance(mob.position, targetBase.position);
        if (distance === 0) continue;

        const dirX = (targetBase.position.x - mob.position.x) / distance;
        const dirY = (targetBase.position.y - mob.position.y) / distance;

        mob.position.x += dirX * mob.speed * SECONDS_PER_TICK;
        mob.position.y += dirY * mob.speed * SECONDS_PER_TICK;
    }

    // --- 2. Hero Actions ---
    for (const hero of gameState.heroes) {
        let closestMob = null;
        let minDistance = Infinity;

        for (const mob of gameState.mobs) {
            const distance = getDistance(hero.position, mob.position);
            if (distance < minDistance) {
                minDistance = distance;
                closestMob = mob;
            }
        }

        if (closestMob && minDistance <= hero.attackRange) {
            if (!hero.attackCooldown || hero.attackCooldown <= 0) {
                closestMob.health -= hero.attackDamage;
                gameState.totalDamage.player1 += hero.attackDamage;
                hero.attackCooldown = 1 * TICKS_PER_SECOND;
            }
        }

        if (hero.attackCooldown > 0) {
            hero.attackCooldown--;
        }
    }

    // --- 3. Resolve Deaths ---
    for (let i = gameState.mobs.length - 1; i >= 0; i--) {
        if (gameState.mobs[i].health <= 0) {
            gameState.mobs.splice(i, 1);
        }
    }

    // --- 4. Check for Mobs Reaching a Base ---
    for (let i = gameState.mobs.length - 1; i >= 0; i--) {
        const mob = gameState.mobs[i];
        const targetBase = gameState.bases[mob.targetBase];
        if (getDistance(mob.position, targetBase.position) < 10) {
            targetBase.health--;
            gameState.mobs.splice(i, 1);
        }
    }

    // --- 5. Check for Win Conditions ---
    const base1Health = gameState.bases.player1.health;
    const base2Health = gameState.bases.player2.health;

    if (base1Health <= 0) {
        gameState.winner = 'player2';
        return;
    }
    if (base2Health <= 0) {
        gameState.winner = 'player1';
        return;
    }

    if (gameState.timeElapsed >= MATCH_DURATION_SECONDS) {
        if (base1Health > base2Health) {
            gameState.winner = 'player1';
        } else if (base2Health > base1Health) {
            gameState.winner = 'player2';
        } else {
            gameState.winner = 'draw';
        }
    }
}