import React, { useState } from 'react';
import Game from './components/Game';
import StrategyUI from './components/StrategyUI';
import './App.css';

function App() {
    const [strategy, setStrategy] = useState({
        heroes: [
            { heroId: 'shield_maiden', x: 200, y: 450, behavior: 'neutral' }
        ]
    });

    const handleHeroDrop = (heroType, x, y) => {
        const newHero = { heroId: heroType, x, y, behavior: 'neutral' };
        setStrategy(prevStrategy => ({
            ...prevStrategy,
            heroes: [...prevStrategy.heroes, newHero]
        }));
    };

    return (
        <div className="App">
            <h1>Aegis Automata</h1>
            <div className="container">
                <StrategyUI /> {/* No longer needs props */}
                <Game strategy={strategy} onHeroDrop={handleHeroDrop} />
            </div>
        </div>
    );
}

export default App;