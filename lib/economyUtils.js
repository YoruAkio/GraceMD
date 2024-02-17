import { item, tierList, monster, effectValue } from './json/economy.js';

export default class EconomyUtils {
    constructor() {
        this.db = global.db;
        this.userDb = this.db.users;
        this.item = item;
        this.monster = monster;
        this.tierList = tierList;
        this.effectValue = effectValue;
    }

    randomNormalLoot() {
        let normalLoot =
            this.item.normalLoot[
                Math.floor(Math.random() * this.item.normalLoot.length)
            ];
        console.log(normalLoot);
        return normalLoot;
    }

    randomMonster(location) {
        let monstersInLocation = this.monster[location];
        let randomIndex = Math.floor(Math.random() * monstersInLocation.length);
        let getMonster = monstersInLocation[randomIndex];
        let monsterInfo = {
            name: getMonster.name,
            id: getMonster.id,
            health: getMonster.health,
            damage: getMonster.damage,
            loot: getMonster.loot,
        };
        return monsterInfo;
    }

    huntMonster(userJid) {
        let user = this.userDb[userJid];

        let currentLocation = user.adventure.location;
        let normalLoot = this.item.normalLoot;
        let monstersInLocation = this.monster[currentLocation];
        let randomIndex = Math.floor(Math.random() * monstersInLocation.length);
        let getMonster = monstersInLocation[randomIndex];

        let monsterInfo = {
            name: getMonster.name,
            id: getMonster.id,
            health: getMonster.health,
            damage: getMonster.damage,
            loot: getMonster.loot,
        };

        // console.log(monsterInfo.health);
        let huntingInfo = [];

        // add cooldown 30 seconds
        if (user.adventure.lastHunting + 30000 > new Date() * 1) {
            return {
                result: 'cooldown',
                message: `You are on cooldown! Please wait for ${(
                    (user.adventure.lastHunting + 30000 - new Date() * 1) /
                    1000
                ).toFixed(0)} seconds.`,
            };
        }

        // Combat Loop
        while (monsterInfo.health > 0 && user.adventure.health > 0) {
            monsterInfo.health -= user.adventure.attack;
            if (monsterInfo.health <= 0) break;
            user.adventure.health -= monsterInfo.damage;

            huntingInfo.push({
                userHealth: user.adventure.health,
                monsterHealth: monsterInfo.health,
            });
        }

        // Outcome
        if (monsterInfo.health <= 0) {
            let expGain = monsterInfo.health + monsterInfo.damage;
            user.adventure.exp += expGain * 2;

            let loot = [];
            let monsterLoot = monsterInfo.loot;
            let randomItem = this.item.find(item => item.id === monsterLoot);
            let amount = Math.floor(Math.random() * 3) + 1;

            // random normalLoot with amount 3-15 and add it using addItemToInventory
            let randomNormalLoot =
                normalLoot[Math.floor(Math.random() * normalLoot.length)];
            let randomNormalItem = this.item.find(
                item => item.id === randomNormalLoot,
            );
            let normalAmount = Math.floor(Math.random() * 15) + 3;

            console.log(randomNormalItem, normalAmount);

            let existingItem = user.inventory.find(
                invItem => invItem.id === randomItem.id,
            );

            if (existingItem) {
                existingItem.amount += amount;
            }

            user.adventure.lastHunting = new Date() * 1 + 30000;
            return {
                result: 'victory',
                message: `You defeated the ${monsterInfo.name}! You gained ${expGain} experience and found ${amount} ${randomItem.name}!`,
            };
        } else {
            return {
                result: 'defeat',
                message: `You were defeated by ${monsterInfo.name}, because your damage is *${user.adventure.damage}* and monster health is *${monsterInfo.health}*, Please upgrade your equipment and try again!`,
            };
        }
    }

    addItemToInventory(userJid, itemId, amount) {
        let user = this.userDb[userJid];
        let item = this.item.find(item => item.id === itemId);
        let existingItem = user.adventure.inventory.find(
            invItem => invItem.id === itemId,
        );

        if (existingItem) {
            existingItem.amount += amount;
        } else {
            user.adventure.inventory.push({
                id: itemId,
                name: item.name,
                amount: amount,
            });
        }
    }

    getItemInfo(itemId) {
        return this.item.find(item => item.id === itemId);
    }

    getUserInfo(userJid) {
        let user = new Map();

        user.set('name', this.userDb[userJid].name);
        user.set('level', this.userDb[userJid].adventure.level);
        user.set('exp', this.userDb[userJid].adventure.exp);
        user.set('health', this.userDb[userJid].adventure.health);
        user.set('maxHealth', this.userDb[userJid].adventure.maxHealth);
        user.set('attack', this.userDb[userJid].adventure.damage);
        user.set('location', this.userDb[userJid].adventure.location);
        user.set('money', this.userDb[userJid].money.inWallet);
        user.set('inventory', this.userDb[userJid].adventure.inventory);
        return user;
    }

    addMoney(userJid, amount) {
        let user = this.userDb[userJid];
        user.money.inWallet += parseInt(amount);
    }

    removeMoney(userJid, amount) {
        let user = this.userDb[userJid];
        user.money.inWallet -= parseInt(amount);
    }

    pokerGame(userJid, betAmount) {
        const user = this.userDb[userJid];
        if (user.money.inWallet < betAmount) {
            return {
                result: 'insufficient',
                message: 'You do not have enough balance!',
            };
        }

        const deck = [...'23456789TJQKA'.repeat(4).split('')].map(rank => ({
            rank,
            suit: ['S', 'H', 'C', 'D'][(Math.random() * 4) | 0],
        }));
        const shuffle = arr => arr.sort(() => Math.random() - 0.5);
        shuffle(deck);

        const playerHand = deck.splice(0, 5);
        const botHand = deck.splice(0, 5);

        const evaluateHand = hand => {
            const ranks = hand
                .map(c => c.rank)
                .sort(
                    (a, b) =>
                        '23456789TJQKA'.indexOf(a) - '23456789TJQKA'.indexOf(b),
                );
            const suits = hand.map(c => c.suit);
            let rankCounts = {};
            ranks.forEach(r => (rankCounts[r] = (rankCounts[r] || 0) + 1));

            const isFlush = suits.every(s => s === suits[0]);
            const isStraight = ranks.every(
                (r, i) =>
                    i === 0 ||
                    '23456789TJQKA'.indexOf(r) ===
                        '23456789TJQKA'.indexOf(ranks[i - 1]) + 1,
            );
            if (isStraight && ranks[4] === 'A' && ranks[0] === '2')
                ranks.push('A'); // Wheel straight

            let handType = 'High Card';

            if (isStraight && isFlush) {
                handType = 'Straight Flush';
            } else if (Object.values(rankCounts).includes(4)) {
                handType = 'Four of a Kind';
            } else if (
                Object.values(rankCounts).includes(3) &&
                Object.values(rankCounts).includes(2)
            ) {
                handType = 'Full House';
            } else if (isFlush) {
                handType = 'Flush';
            } else if (isStraight) {
                handType = 'Straight';
            } else if (Object.values(rankCounts).includes(3)) {
                handType = 'Three of a Kind';
            } else if (
                Object.values(rankCounts).filter(x => x === 2).length === 2
            ) {
                handType = 'Two Pair';
            } else if (Object.values(rankCounts).includes(2)) {
                handType = 'Pair';
            }

            const strength = ranks
                .map(r => '23456789TJQKA'.indexOf(r))
                .reverse();
            return { type: handType, strength };
        };

        const playerResult = evaluateHand(playerHand);
        const botResult = evaluateHand(botHand);
        let playerWins = null;

        // Winner & Tiebreaker Logic
        if (playerResult.type === botResult.type) {
            for (let i = 0; i < playerResult.strength.length; i++) {
                if (playerResult.strength[i] > botResult.strength[i]) {
                    playerWins = true;
                    break;
                } else if (playerResult.strength[i] < botResult.strength[i]) {
                    playerWins = false;
                    break;
                }
            }
        } else {
            playerWins = playerResult.strength > botResult.strength;
        }

        if (playerWins === true) {
            let wonAmount =
                betAmount * 2 +
                Math.floor(betAmount * 0.25) +
                Math.floor(Math.random() * 100) +
                1;
            this.addMoney(userJid, parseInt(wonAmount));
            return {
                result: 'win',
                message: `*Poket Game*\n\n*Your Hand*: ${playerResult.type}\n*Bot's Hand*: ${botResult.type}\n\nYou won ${wonAmount} coins!`,
            };
        } else if (playerWins === false) {
            this.removeMoney(userJid, parseInt(betAmount));
            return {
                result: 'lose',
                message: `*Poket Game*\n\n*Your Hand*: ${playerResult.type}\n*Bot's Hand*: ${botResult.type}\n\nYou lost ${betAmount} coins!`,
            };
        } else {
            this.addMoney(userJid, parseInt(betAmount));
            return {
                result: 'draw',
                message: `*Poket Game*\n\n*Your Hand*: ${playerResult.type}\n*Bot's Hand*: ${botResult.type}\n\nIt's a draw! You got your ${betAmount} coins back!`,
            };
        }
    }
}
