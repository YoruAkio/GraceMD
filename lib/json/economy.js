export const item = {
    /**
     * NormalLoot id: 100
     * @desc: Loot that can be found in the wild
     * @type: loot
     */
    normalLoot: [
        {
            name: 'Apple',
            id: 100,
            desc: 'A fruit that can be found in the wild',
            tier: 'common',
            price: 100,
            type: 'loot',
        },
        {
            name: 'Berry',
            id: 101,
            desc: 'A berry that can be found in the wild',
            tier: 'common',
            price: 100,
            type: 'loot',
        },
        {
            name: 'Mushroom',
            id: 102,
            desc: 'A mushroom that can be found in the wild',
            tier: 'common',
            price: 100,
            type: 'loot',
        },
        {
            name: 'Herb',
            id: 103,
            desc: 'A herb that can be found in the wild',
            tier: 'common',
            price: 200,
            type: 'loot',
        },
        {
            name: 'Root',
            id: 104,
            desc: 'A root that can be found in the wild',
            tier: 'common',
            price: 200,
            type: 'loot',
        },
        {
            name: 'Flower',
            id: 105,
            desc: 'A flower that can be found in the wild',
            tier: 'common',
            price: 200,
            type: 'loot',
        },
        {
            name: 'Seed',
            id: 106,
            desc: 'A seed that can be found in the wild',
            tier: 'common',
            price: 300,
            type: 'loot',
        },
        {
            name: 'Feather',
            id: 107,
            desc: 'A feather that can be found in the wild',
            tier: 'common',
            price: 300,
            type: 'loot',
        },
        {
            name: 'Egg',
            id: 108,
            desc: 'An egg that can be found in the wild',
            tier: 'common',
            price: 300,
            type: 'loot',
        },
        {
            name: 'Bone',
            id: 109,
            desc: 'A bone that can be found in the wild',
            tier: 'common',
            price: 400,
            type: 'loot',
        },
        {
            name: 'Shell',
            id: 110,
            desc: 'A shell that can be found in the wild',
            tier: 'common',
            price: 400,
            type: 'loot',
        },
        {
            name: 'Tooth',
            id: 111,
            desc: 'A tooth that can be found in the wild',
            tier: 'common',
            price: 400,
            type: 'loot',
        },
    ],
    /**
     * MonsterLoot id: 200
     * @desc: Loot that can be found from monsters
     * @type: loot
     */
    monsterLoot: [
        {
            name: 'Cockroach Leg',
            id: 200,
            desc: 'A leg from a cockroach',
            price: 100,
            type: 'loot',
        },
        {
            name: 'Rat Tail',
            id: 201,
            desc: 'A tail from a rat',
            price: 100,
            type: 'loot',
        },
        {
            name: 'Spider Web',
            id: 202,
            desc: 'A web from a spider',
            price: 100,
            type: 'loot',
        },
        {
            name: 'Snake Skin',
            id: 203,
            desc: 'A skin from a snake',
            price: 200,
            type: 'loot',
        },
        {
            name: 'Wolf Fur',
            id: 204,
            desc: 'A fur from a wolf',
            price: 200,
            type: 'loot',
        },
        {
            name: 'Bear Claw',
            id: 205,
            desc: 'A claw from a bear',
            price: 200,
            type: 'loot',
        },
        {
            name: 'Fox Tail',
            id: 206,
            desc: 'A tail from a fox',
            price: 300,
            type: 'loot',
        },
        {
            name: 'Deer Antler',
            id: 207,
            desc: 'An antler from a deer',
            price: 300,
            type: 'loot',
        },
        {
            name: 'Skeleton Bone',
            id: 208,
            desc: 'A bone from a skeleton',
            price: 300,
            type: 'loot',
        },
        {
            name: 'Zombie Brain',
            id: 209,
            desc: 'A brain from a zombie',
            price: 400,
            type: 'loot',
        },
        {
            name: 'Ghost Soul',
            id: 210,
            desc: 'A soul from a ghost',
            price: 400,
            type: 'loot',
        },
        {
            name: 'Vampire Blood',
            id: 211,
            desc: 'Blood from a vampire',
            price: 400,
            type: 'loot',
        },
    ],
    /**
     * Weapon id: 300
     */
    weapon: {
        sword: {
            name: 'Sword',
            price: 1500,
            damage: 50,
            desc: 'A sword that can be used to attack enemies',
            effect: 'attack',
            type: 'weapon',
        },
        bow: {
            name: 'Bow',
            price: 2000,
            damage: 50,
            desc: 'A bow that can be used to attack enemies',
            effect: 'attack',
            type: 'weapon',
        },
        spear: {
            name: 'Spear',
            price: 2500,
            damage: 50,
            desc: 'A spear that can be used to attack enemies',
            effect: 'attack',
            type: 'weapon',
        },
    },
    /**
     * Armor id: 400
     */
    armor: {},
    /**
     * Potion id: 500
     */
    potion: {
        heal: {
            name: 'Healing Potion',
            price: 500,
            desc: 'A potion that can be used to heal yourself',
            effect: 'restoreSmallHealth',
            type: 'consumable',
        },
        power: {
            name: 'Power Potion',
            price: 500,
            desc: 'A potion that can be used to increase your attack',
            effect: 'buffAttack',
            type: 'consumable',
        },
    },
};

// add 7 location on monster array, and give them a name, health, damage, and loot
export const monster = {
    forest: [
        {
            name: 'Cockroach',
            id: 1,
            health: 100,
            damage: 10,
            loot: item.monsterLoot[0],
        },
        {
            name: 'Rat',
            id: 2,
            health: 150,
            damage: 15,
            loot: item.monsterLoot[1],
        },
        {
            name: 'Spider',
            id: 3,
            health: 200,
            damage: 20,
            loot: item.monsterLoot[2],
        },
    ],
    mountain: [
        {
            name: 'Snake',
            id: 4,
            health: 250,
            damage: 25,
            loot: item.monsterLoot[3],
        },
        {
            name: 'Wolf',
            id: 5,
            health: 300,
            damage: 30,
            loot: item.monsterLoot[4],
        },
        {
            name: 'Bear',
            id: 6,
            health: 350,
            damage: 35,
            loot: item.monsterLoot[5],
        },
    ],
    cave: [
        {
            name: 'Fox',
            id: 7,
            health: 400,
            damage: 40,
            loot: item.monsterLoot[6],
        },
        {
            name: 'Deer',
            id: 8,
            health: 450,
            damage: 45,
            loot: item.monsterLoot[7],
        },
        {
            name: 'Skeleton',
            id: 9,
            health: 500,
            damage: 50,
            loot: item.monsterLoot[8],
        },
    ],
    graveyard: [
        {
            name: 'Zombie',
            id: 10,
            health: 550,
            damage: 55,
            loot: item.monsterLoot[9],
        },
        {
            name: 'Ghost',
            id: 11,
            health: 600,
            damage: 60,
            loot: item.monsterLoot[10],
        },
        {
            name: 'Vampire',
            id: 12,
            health: 650,
            damage: 65,
            loot: item.monsterLoot[11],
        },
    ],
};

export const effectValue = {
    restoreSmallHealth: 20,
    restoreMediumHealth: 50,
};

export const effectList = [
    {
        name: 'attack',
        desc: 'Increase your attack',
    },
    {
        name: 'defense',
        desc: 'Increase your defense',
    },
    {
        name: 'restoreSmallHealth',
        desc: 'Restore a small amount of health',
    },
    {
        name: 'restoreMediumHealth',
        desc: 'Restore a medium amount of health',
    },
];

export const tierList = [
    {
        id: 1,
        name: 'Beginner',
        desc: 'Default tier for new players',
    },
    {
        id: 2,
        name: 'Apprentice',
        desc: 'Tier for players who have reached level 10',
    },
    {
        id: 3,
        name: 'Adventurer',
        desc: 'Tier for players who have reached level 20',
    },
    {
        id: 4,
        name: 'Veteran',
        desc: 'Tier for players who have reached level 30',
    },
    {
        id: 5,
        name: 'Expert',
        desc: 'Tier for players who have reached level 40',
    },
    {
        id: 6,
        name: 'Master',
        desc: 'Tier for players who have reached level 50',
    },
    {
        id: 7,
        name: 'Legend',
        desc: 'Tier for players who have reached level 60',
    },
];
