let nextEntityId = 0;

export class Base {
  constructor(owner) {
    this.owner = owner; // e.g., 'player1' or 'player2'
    this.health = 3;
    // Position would be fixed based on owner
    this.position = owner === 'player1' ? { x: 50, y: 550 } : { x: 750, y: 50 };
  }
}

export class Mob {
  constructor(type, startPosition, targetBase) {
    this.id = nextEntityId++;
    this.type = type;
    this.position = { ...startPosition }; // Make a copy
    this.targetBase = targetBase;
    this.health = 50; // Example value
    this.speed = 25; // Units per second
  }
}

export class Hero {
  constructor(type, startPosition, behavior) {
    this.id = nextEntityId++;
    this.type = type;
    this.position = { ...startPosition };
    this.behavior = behavior; // 'defensive', 'neutral', 'offensive'
    this.health = 200; // Example value
    this.attackRange = 150; // Example value
    this.attackDamage = 10; // Example value
  }
}
