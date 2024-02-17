import { monster } from './lib/json/economy.js'; // Assuming 'monster' data is available here

const location = 'forest';

// Access the monster data for the specified location directly
const monstersInLocation = monster[location];

// Get a random monster
const randomIndex = Math.floor(Math.random() * monstersInLocation.length);
const getMonster = monstersInLocation[randomIndex];

// Construct the monsterInfo object
const monsterInfo = {
    name: getMonster.name,
    id: getMonster.id,
    health: getMonster.health,
    damage: getMonster.damage,
    loot: getMonster.loot, // Assuming you might add a 'loot' property later
};

console.log(monsterInfo);
