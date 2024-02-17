import config from '../config.js';

export default function loadDatabase(m) {
    const isNumber = x => typeof x === 'number' && !isNaN(x);
    const isBoolean = x => typeof x === 'boolean' && Boolean(x);
    let user = global.db.users[m.sender];
    if (typeof user !== 'object') global.db.users[m.sender] = {};
    if (user) {
        if (!isNumber(user.limit)) user.limit = config.limit.free;
        if (!isBoolean(user.premium)) user.premium = m.isOwner ? true : false;
        if (!isBoolean(user.VIP)) user.VIP = m.isOwner ? true : false;
        if (!('lastChat' in user)) user.lastChat = new Date() * 1;
        if (!('name' in user)) user.name = m.pushName;
        if (!isBoolean(user.banned)) user.banned = false;
        if (!('money' in user)) user.money = { inBank: 0, inWallet: 0 };
        if (!('adventure' in user)) {
            user.adventure = {
                lastHunting: new Date() * 1,
                lastDaily: new Date() * 1,
                lastWeekly: new Date() * 1,
                lastMonthly: new Date() * 1,
                location: 'forst',
                tier: 1,
                exp: 0,
                level: 0,
                maxHealth: 100,
                health: 100,
                damage: 10,
                maxExp: 100,
                inventory: [],
            };
        }
    } else {
        global.db.users[m.sender] = {
            limit: config.limit.free,
            lastChat: new Date() * 1,
            premium: m.isOwner ? true : false,
            VIP: m.isOwner ? true : false,
            name: m.pushName,
            banned: false,
            money: {
                inBank: 0,
                inWallet: 0,
            },
            adventure: {
                lastHunting: new Date() * 1,
                lastDaily: new Date() * 1,
                lastWeekly: new Date() * 1,
                lastMonthly: new Date() * 1,
                location: 'forest',
                tier: 1,
                exp: 0,
                level: 0,
                maxHealth: 100,
                health: 100,
                damage: 10,
                maxExp: 100,
                inventory: [],
            },
        };
    }

    if (m.isGroup) {
        let group = global.db.groups[m.from];
        if (typeof group !== 'object') global.db.groups[m.from] = {};
        if (group) {
            if (!isBoolean(group.mute)) group.mute = false;
            if (!isNumber(group.lastChat)) group.lastChat = new Date() * 1;
            if (!isBoolean(group.welcome)) group.welcome = true;
            if (!isBoolean(group.leave)) group.leave = true;
        } else {
            global.db.groups[m.from] = {
                lastChat: new Date() * 1,
                mute: false,
                welcome: true,
                leave: true,
            };
        }
    }
}
