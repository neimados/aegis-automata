import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
// Import your simulation logic!
import { GameState } from 'simulation-engine';
import { Base, Hero, Mob } from 'simulation-engine/entities';
import { updateGameState } from 'simulation-engine/gameLoop';


class MainScene extends Phaser.Scene {
    // Add an init method to receive data from the React component
    init(data) {
        this.strategy = data.strategy;
        this.onHeroDrop = data.onHeroDrop; // Get the handler function
    }
    create() {
         // --- 1. Initialize the Simulation State ---
        this.gameState = new GameState('visual-test');

        this.gameState.bases.player1 = new Base('player1');
        this.gameState.bases.player2 = new Base('player2');

        const mob = new Mob('grunt', { x: 700, y: 100 }, 'player1');
        this.gameState.mobs.push(mob);

        // Use the strategy prop to create heroes
        for (const heroConfig of this.strategy.heroes) {
            const hero = new Hero(heroConfig.heroId, { x: heroConfig.x, y: heroConfig.y }, heroConfig.behavior);
            this.gameState.heroes.push(hero);
        }

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
        // Draw hero attack range
        for (const hero of this.gameState.heroes) {
            const heroSprite = this.heroSprites.get(hero.id);
            // Add a semi-transparent circle for the range
            const rangeIndicator = this.add.circle(heroSprite.x, heroSprite.y, hero.attackRange, 0x0000ff, 0.1);
            // We can store it on the sprite to manage it later if needed
            heroSprite.rangeIndicator = rangeIndicator;
        }
        // Make the entire game canvas a drop zone
        this.zone = this.add.zone(400, 300, 800, 600).setRectangleDropZone(800, 600);

        // This event listener will fire when a drop occurs
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            // We'll get the hero type from the data that was dragged
            const heroType = gameObject.getData('heroType');
            if (heroType) {
                // This is where we'll tell React to add a new hero
                console.log(`Dropped ${heroType} at x: ${pointer.x}, y: ${pointer.y}`);
            }
        });
        this.input.on('drop', (pointer, gameObject, dropZone) => {
        const heroType = gameObject.getData('heroType');
        if (heroType && this.onHeroDrop) {
            // Call the function from App.jsx to update the state!
            this.onHeroDrop(heroType, pointer.x, pointer.y);
        }
    });
    }

    update() {
        // --- 3. Run One Tick of the Simulation ---
        updateGameState(this.gameState);

        // --- 4. Sync Visuals with the Simulation State ---
        // Update mob positions
        const activeMobIds = new Set(this.gameState.mobs.map(m => m.id));

        // Remove sprites for mobs that are no longer in the simulation
        for (const [id, sprite] of this.mobSprites.entries()) {
            if (!activeMobIds.has(id)) {
                sprite.destroy();
                this.mobSprites.delete(id);
            }
        }

        // Update remaining mob positions
        for (const mob of this.gameState.mobs) {
            const mobSprite = this.mobSprites.get(mob.id);
            if (mobSprite) {
                mobSprite.x = mob.position.x;
                mobSprite.y = mob.position.y;
            }
        }
    }
}

// Update the Game component to accept the 'strategy' prop
const Game = ({ strategy, onHeroDrop }) => {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameRef.current,
            scene: [MainScene],
            backgroundColor: '#1a1a1a',
        };

        const game = new Phaser.Game(config);

        window.phaserGame = game; 
        game.scene.start('default', { strategy, onHeroDrop });

          // --- Listen for native browser drop events on the canvas ---
        const canvas = game.canvas;
        const handleDrop = (event) => {
            event.preventDefault();
            const heroType = event.dataTransfer.getData('heroType');
            if (heroType) {
                // Get drop coordinates relative to the canvas
                const bounds = canvas.getBoundingClientRect();
                const x = event.clientX - bounds.left;
                const y = event.clientY - bounds.top;
                onHeroDrop(heroType, x, y);
            }
        };

        const handleDragOver = (event) => {
            event.preventDefault();
        };

        canvas.addEventListener('drop', handleDrop);
        canvas.addEventListener('dragover', handleDragOver);
        // --- End of new code ---

        return () => {
            // Cleanup the event listeners
            canvas.removeEventListener('drop', handleDrop);
            canvas.removeEventListener('dragover', handleDragOver);

            game.destroy(true);
        };
    }, [strategy, onHeroDrop]);

    return <div ref={gameRef} />;
};

export default Game;