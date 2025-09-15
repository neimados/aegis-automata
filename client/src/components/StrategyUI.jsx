import React from 'react';

const StrategyUI = () => {
    const handleDragStart = (event, heroType) => {
        // Attach the hero type to the drag event so Phaser can read it
        event.dataTransfer.setData('heroType', heroType);
    };

    return (
        <div className="strategy-ui">
            <h3>Strategy Panel</h3>
            <p>Drag a hero onto the map:</p>
            
            <div
                className="hero-icon"
                draggable="true" // Make this element draggable
                onDragStart={(e) => handleDragStart(e, 'frost_mage')}
            >
                Frost Mage
            </div>
        </div>
    );
};

export default StrategyUI;