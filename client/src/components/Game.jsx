import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
// Import your simulation logic!
import { GameState } from 'simulation-engine';
import { Base, Hero, Mob } from 'simulation-engine/entities';
import { updateGameState } from 'simulation-engine/gameLoop';


class MainScene extends Phaser.Scene {
    create() {
        // --- 1. Initialize the Simulation State ---
        this.gameState = new GameState('visual-test');

        // CORRECT: Create the bases FIRST
        this.gameState.bases.player1 = new Base('player1');
        this.gameState.bases.player2 = new Base('player2');

        // NOW, create entities that depend on the bases
        const mob = new Mob('grunt', { x: 750, y: 50 }, 'player1'); // Target player1's base
        const hero = new Hero('shield_maiden', { x: 200, y: 450 }, 'neutral');
        this.gameState.mobs.push(mob);
        this.gameState.heroes.push(hero);

        // --- 2. Create Visual Representations (the rest of the code is the same) ---
        this.mobSprites = new Map();
        this.heroSprites = new Map();

        // Draw bases
        this.add.circle(this.gameState.bases.player1.position.x, this.gameState.bases.player1.position.y, 20, 0x00ff00);
        this.add.circle(this.gameState.bases.player2.position.x, this.gameState.bases.player2.position.y, 20, 0xff0000);

        // Draw initial mobs
        for (const mob of this.gameState.mobs) {
            const mobSprite = this.add.circle(mob.position.x, mob.position.y, 8, 0xffffff);
            this.mobSprites.set(mob.id, mobSprite);
        }

        // Draw initial heroes
        for (const hero of this.gameState.heroes) {
            const heroSprite = this.add.circle(hero.position.x, hero.position.y, 12, 0x0000ff);
            this.heroSprites.set(hero.id, heroSprite);
        }
    }

    update() {
        // --- 3. Run One Tick of the Simulation ---
        updateGameState(this.gameState);

        // --- 4. Sync Visuals with the Simulation State ---
        // Update mob positions
        for (const mob of this.gameState.mobs) {
            const mobSprite = this.mobSprites.get(mob.id);
            if (mobSprite) {
                mobSprite.x = mob.position.x;
                mobSprite.y = mob.position.y;
            }
        }
    }
}

// The React component part remains the same
const Game = () => {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameRef.current,
            scene: [MainScene],
            backgroundColor: '#1a1a1a', // A dark grey background
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div ref={gameRef} />;
};

export default Game;