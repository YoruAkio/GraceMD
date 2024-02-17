import config from '../config.js';
import Func from '../lib/function.js';
import EconomyUtils from '../lib/economyUtils.js';
const Eco = new EconomyUtils();

import fs from 'fs';
import chalk from 'chalk';
import axios from 'axios';
import path from 'path';
import { getBinaryNodeChildren } from '@whiskeysockets/baileys';
import { exec } from 'child_process';
import { format } from 'util';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = Func.__filename(import.meta.url);
const require = createRequire(import.meta.url);

export default async function Message(kiontol, m, chatUpdate) {
    try {
        if (!m) return;
        if (!config.options.public && !m.isOwner) return;
        if (m.from && db.groups[m.from]?.mute && !m.isOwner) return;
        if (m.isBaileys) return;

        (await import('../lib/loadDatabase.js')).default(m);

        const prefix = m.prefix;
        const isCmd = m.body.startsWith(prefix);
        const command = isCmd ? m.command.toLowerCase() : '';
        const quoted = m.isQuoted ? m.quoted : m;

        // LOG Chat
        if (m.message && !m.isBaileys) {
            console.log(
                chalk.black(chalk.bgWhite('- FROM')),
                chalk.black(chalk.bgGreen(m.pushName)),
                chalk.black(chalk.yellow(m.sender)) +
                    '\n' +
                    chalk.black(chalk.bgWhite('- IN')),
                chalk.black(
                    chalk.bgGreen(
                        m.isGroup ? m.metadata.subject : 'Private Chat',
                        m.from,
                    ),
                ) +
                    '\n' +
                    chalk.black(chalk.bgWhite('- MESSAGE')),
                chalk.black(chalk.bgGreen(m.body || m.type)),
            );
        }

        // Leveling System
        let info = {
            oldLevel: db.users[m.sender].adventure.level,
            oldExp: db.users[m.sender].adventure.exp,
            oldMaxExp: db.users[m.sender].adventure.maxExp,
            oldHealth: db.users[m.sender].adventure.health,
            oldMaxHealth: db.users[m.sender].adventure.maxHealth,
            oldAttack: db.users[m.sender].adventure.attack,
            oldArmor: db.users[m.sender].adventure.armor,
        };
        let levelUps = 0;

        while (
            db.users[m.sender].adventure.exp >=
            db.users[m.sender].adventure.maxExp
        ) {
            let excessExp =
                db.users[m.sender].adventure.exp -
                db.users[m.sender].adventure.maxExp;

            info.newLevel = db.users[m.sender].adventure.level + 1;
            info.newMaxExp =
                db.users[m.sender].adventure.maxExp +
                Math.floor(Math.random() * 100) +
                1;
            info.newMaxHealth =
                db.users[m.sender].adventure.maxHealth +
                Math.floor(Math.random() * 50) +
                1;
            info.newHealth =
                db.users[m.sender].adventure.health +
                Math.floor(Math.random() * 25) +
                1;
            info.newAttack =
                db.users[m.sender].adventure.attack +
                Math.floor(Math.random() * 8) +
                1;
            info.newArmor =
                db.users[m.sender].adventure.armor +
                Math.floor(Math.random() * 5) +
                1;

            db.users[m.sender].adventure.exp = excessExp;
            db.users[m.sender].adventure.level += 1;
            db.users[m.sender].adventure.maxExp = info.newMaxExp;
            db.users[m.sender].adventure.maxHealth = info.newMaxHealth;
            db.users[m.sender].adventure.health = info.newHealth;
            db.users[m.sender].adventure.attack = info.newAttack;
            db.users[m.sender].adventure.armor = info.newArmor;

            levelUps += 1;
        }

        if (levelUps > 0) {
            let message = `*Congratulation, You have level up to ${
                info.newLevel
            }*\n\nLevel : ${info.oldLevel} -> ${info.newLevel}\nExp : ${
                info.oldExp
            } -> ${db.users[m.sender].adventure.exp}\nMax Exp : ${
                info.oldMaxExp
            } -> ${info.newMaxExp}\nHeath : ${info.oldHealth} -> ${
                info.newHealth
            }\nMax Health : ${info.oldMaxHealth} -> ${
                info.newMaxHealth
            }\nAttack : ${info.oldAttack} -> ${info.newAttack}\nArmor : ${
                info.oldArmor
            } -> ${info.newArmor}`;

            kiontol.sendMessage(m.from, {
                text: message,
                contextInfo: { mentionedJid: [m.sender] },
            });
        }

        // Tier System,make the tier level up on 5 level up, then set the level to

        switch (command) {
            case 'menu':
            case 'help':
                {
                    let text = `Hi @${
                        m.sender.split`@`[0]
                    }, This is a list of available commands\n\n*Total Command :* ${Object.values(
                        config.menu,
                    )
                        .map(a => a.length)
                        .reduce((total, num) => total + num, 0)}\n\n`;

                    Object.entries(config.menu)
                        .map(([type, command]) => {
                            text += `┌──⭓ *${Func.toUpper(type)} Menu*\n`;
                            text += `│\n`;
                            text += `│⎚ ${command
                                .map(a => `${prefix + a}`)
                                .join('\n│⎚ ')}\n`;
                            text += `│\n`;
                            text += `└───────⭓\n\n`;
                        })
                        .join('\n\n');

                    kiontol.sendMessage(
                        m.from,
                        {
                            text,
                            contextInfo: {
                                mentionedJid: kiontol.parseMention(text),
                                externalAdReply: {
                                    title: kiontol?.user?.name,
                                    mediaType: 1,
                                    previewType: 0,
                                    renderLargerThumbnail: true,
                                    thumbnail:
                                        fs.readFileSync('./temp/kiontol.jpg'),
                                    sourceUrl: config.Exif.packWebsite,
                                },
                            },
                        },
                        { quoted: m },
                    );
                }
                break;
            /* Economy Section */
            case 'addbal':
                {
                    if (!m.isOwner) return m.reply('owner');
                    if (m.text.split(' ')[0] === 'me') {
                        let amount = m.text.split(' ')[1];
                        if (!amount) return m.reply('Amount is required!');
                        let db = global.db.users[m.sender];
                        db.money.inWallet += parseInt(amount);
                        m.reply(`Succes Add $${amount} to ${m.sender}`);
                    } else {
                        let jid = m.mentions[0];
                        let amount = m.text.split(' ')[1];
                        if (!amount) return m.reply('Amount is required!');
                        let db = global.db.users[jid];
                        db.money.inWallet += parseInt(amount);
                        m.reply(`Succes Add $${amount} to ${jid}`);
                    }
                }
                break;
            case 'balance':
            case 'bal':
                {
                    let jid = m.mentions[0] || m.sender;
                    let db = global.db.users[jid];
                    m.reply(
                        `*Balance Info*\n\nName : @${
                            jid.split`@`[0]
                        }\nWallet : $${db.money.inWallet}\nBank : $${
                            db.money.inBank
                        }\nTotal : $${db.balance}`,
                    );
                }
                break;
            case 'set':
                {
                    if (!m.isOwner) return m.reply('owner');
                    let [key, value] = m.text.split(' ');
                    if (!key) return m.reply('Key is required');
                    if (!value) return m.reply('Value is required');

                    switch (key) {
                        case 'bal':
                            {
                                let jid = m.mentions[0] || m.sender;
                                let db = global.db.users[jid];
                                db.money.inWallet += parseInt(value);
                                m.reply(`Succes Set $${value} to ${jid}`);
                            }
                            break;
                        case 'exp':
                            {
                                let jid = m.mentions[0] || m.sender;
                                let db = global.db.users[jid];
                                db.adventure.exp += parseInt(value);
                                m.reply(`Succes Set ${value} exp to ${jid}`);
                            }
                            break;
                        default: {
                            m.reply('Key Not Found');
                        }
                    }
                }
                break;
            case 'cursewallet':
                {
                    if (!m.isOwner) return m.reply('owner');
                    let jid = m.mentions[0] || m.sender;
                    let db = global.db.users[jid];
                    db.money.inWallet = 0;
                    m.reply(`Succes Curse Wallet of ${jid}`);
                }
                break;
            case 'usermentiontest':
            case 'umt':
                {
                    let jid = m.mentions[0] || m.sender;
                    let numberFromJid = jid.split('@')[0];
                    m.reply(`@${numberFromJid}`, {
                        contextInfo: { mentionedJid: [m.sender] },
                    });
                }
                break;
            case 'messageedittest':
            case 'met':
                {
                    // send message "Hello, world!", then edit message with value args 0
                    let newMessage = m.text.split(' ')[0];
                    let messageId = kiontol.sendMessage(
                        m.from,
                        'Hello, world!',
                    );
                    kiontol.updateMessage(m.from, messageId, newMessage);
                }
                break;
            case 'userinfo':
                {
                    let jid = m.mentions[0] || m.sender;
                    let db = global.db.users[jid];

                    let tierList = Eco.tierList;
                    let tier = tierList.find(
                        tier => tier.level === db.adventure.tier,
                    );

                    console.log(tier.name);

                    m.reply(
                        `User Info\n\nName : @${jid.split`@`[0]}\nLevel : ${
                            db.adventure.level
                        }\nExp : ${db.adventure.exp}\nHealth : ${
                            db.adventure.health
                        }\nAttack : ${db.adventure.attack}\nArmor : ${
                            db.adventure.armor
                        }`,
                    );
                }
                break;
            case 'test':
                {
                    let asd = JSON.stringify(Eco.randomNormalLoot());

                    m.reply(asd);
                }
                break;
            case 'infotest':
            case 'it':
                {
                    let jid = m.mentions[0] || m.sender;
                    let db = global.db.users[jid];
                    let user = Eco.getUserInfo(jid);
                    let item = Eco.getItemInfo(1);
                    console.log(user);
                    console.log(item);
                    m.reply(
                        `User Info\n\nName : ${user.get(
                            'name',
                        )}\nLevel : ${user.get('level')}\nExp : ${user.get(
                            'exp',
                        )}\nHealth : ${user.get('health')}\nAttack : ${user.get(
                            'attack',
                        )}\nArmor : ${user.get('armor')}`,
                    );
                }
                break;
            case 'hunt':
            case 'hunting':
                {
                    let res = Eco.huntMonster(m.sender);
                    JSON.stringify(res);
                    console.log(res);
                    m.reply(
                        `*Hunting Result*\n\nStatus : ${res.result}\n\n${res.message}`,
                    );
                }
                break;

            case 'randommonster':
            case 'rm': {
                let monster = Eco.monster;
                let location = 'forest';

                let monstersInLocation = monster[location];
                let randomIndex = Math.floor(
                    Math.random() * monstersInLocation.length,
                );
                let getMonster = monstersInLocation[randomIndex];

                let monsterInfo = {
                    name: getMonster.name,
                    id: getMonster.id,
                    health: getMonster.health,
                    damage: getMonster.damage,
                    loot: getMonster.loot,
                };

                m.reply(JSON.stringify(monsterInfo));
                break;
            }
            case 'inventory':
            case 'inv':
                {
                    let user = global.db.users[m.sender];
                    let text = `*Inventory of @${
                        m.sender.split`@`[0]
                    }*\n\nCoins : $${user.money.inWallet}\n\nItems :\n\n`;
                    let stringify = JSON.stringify(user.adventure.inventory);
                    let inventory = JSON.parse(stringify);
                    if (inventory.length === 0) {
                        text += 'Empty';
                    } else {
                        inventory.map((item, index) => {
                            text += `${index + 1}. ${item.name} x${
                                item.amount
                            } (ID: ${item.id})\n`;
                        });
                    }
                    m.reply(text);
                }
                break;
            case 'claim':
                {
                    let time = m.text.split(' ')[0];
                    let user = global.db.users[m.sender];
                    let lastDaily = user.adventure.lastDaily;
                    let lastWeekly = user.adventure.lastWeekly;
                    let lastMonthly = user.adventure.lastMonthly;
                    let cooldown = 86400000; // 24 hours
                    let cooldownWeekly = 604800000; // 7 days
                    let cooldownMonthly = 2592000000; // 30 days

                    if (time === 'daily') {
                        if (lastDaily + cooldown > new Date() * 1) {
                            return m.reply('You are on cooldown!');
                        }
                        let amount = Math.floor(Math.random() * 1000) + 1;
                        user.money.inWallet += amount;
                        user.adventure.lastDaily = new Date() * 1;
                        m.reply(`Succes Claim $${amount} Daily`);
                    } else if (time === 'weekly') {
                        if (lastWeekly + cooldownWeekly > new Date() * 1) {
                            return m.reply('You are on cooldown!');
                        }
                        let amount = Math.floor(Math.random() * 5000) + 1;
                        user.money.inWallet += amount;
                        user.adventure.lastWeekly = new Date() * 1;
                        m.reply(`Succes Claim $${amount} Weekly`);
                    } else if (time === 'monthly') {
                        if (lastMonthly + cooldownMonthly > new Date() * 1) {
                            return m.reply('You are on cooldown!');
                        }
                        let amount = Math.floor(Math.random() * 10000) + 1;
                        user.money.inWallet += amount;
                        user.adventure.lastMonthly = new Date() * 1;
                        m.reply(`Succes Claim $${amount} Monthly`);
                    } else {
                        m.reply('Invalid Time');
                    }
                }
                break;
            case 'sell':
                {
                    let itemId = m.text.split(' ')[0];
                    let amount = m.text.split(' ')[1];
                    let user = global.db.users[m.sender];
                    let item = user.adventure.inventory.find(
                        item => item.id === parseInt(itemId),
                    );
                    if (!item) return m.reply('Item Not Found');
                    if (item.amount < amount) return m.reply('Not Enough Item');
                    let itemData = Eco.item.monsterLoot.find(
                        item => item.id === parseInt(itemId),
                    );
                    let price = Math.floor(itemData.price * 0.25) * amount;
                    console.log(price);
                    user.money.inWallet += price;
                    item.amount -= amount;
                    m.reply(
                        `Succes Sell ${itemData.name} x${amount} for $${price}`,
                    );
                }
                break;
            case 'poker':
                {
                    let user = global.db.users[m.sender];
                    let amount = parseInt(m.text.split(' ')[0]);
                    if (isNaN(amount))
                        return m.reply('Amount must be a number');
                    if (!amount) return m.reply('Amount is required');
                    if (user.money.inWallet < amount)
                        return m.reply('Not Enough Money');
                    let result = Eco.pokerGame(m.sender, amount);
                    JSON.stringify(result);
                    m.reply(result.message);
                }
                break;
            case 'checkitemid':
            case 'cid':
                {
                    let itemId = m.text.split(' ')[0];
                    let item = Eco.item;
                    let lootItems = item.monsterLoot;
                    let itemData = lootItems.find(
                        item => item.id === parseInt(itemId),
                    );
                    m.reply(
                        `Item Name : ${itemData.name}\nItem Description : ${itemData.desc}`,
                    );
                }
                break;
            case 'additemtest':
            case 'ait':
                {
                    let user = m.sender;
                    let item = Eco.item;
                    let itemId = m.text.split(' ')[0];
                    let amount = m.text.split(' ')[1];
                    let randomItem = item.monsterLoot.find(
                        item => item.id === parseInt(itemId),
                    );
                    let db = global.db.users[user];
                    let existingItem = db.adventure.inventory.find(
                        invItem => invItem.id === randomItem.id,
                    );
                    if (existingItem) {
                        existingItem.amount += amount;
                    } else {
                        db.adventure.inventory.push({
                            name: randomItem.name,
                            id: randomItem.id,
                            amount: amount,
                        });
                    }

                    m.reply(
                        `Succes Add ${randomItem.name} x${amount} to ${user}`,
                    );
                }
                break;
            case 'randomloottest':
            case 'rlt':
                {
                    let monsterLootData = Eco.item;
                    const lootItems = monsterLootData.monsterLoot;
                    const randomIndex = Math.floor(
                        Math.random() * lootItems.length,
                    );

                    m.reply(
                        `You got ${lootItems[randomIndex].name} from the monster`,
                    );
                }
                break;
            case 'speed':
                {
                    const { promisify } = await import('util');
                    const cp = (await import('child_process')).default;
                    let execute = promisify(exec).bind(cp);
                    m.reply('Testing Speed...');
                    let o;
                    try {
                        o = exec(`speedtest --accept-license`); // install speedtest-cli
                    } catch (e) {
                        o = e;
                    } finally {
                        let { stdout, stderr } = o;
                        if (stdout) return m.reply(stdout);
                        if (stderr) return m.reply(stderr);
                    }
                }
                break;
            case 'owner':
                {
                    kiontol.sendContact(m.from, config.options.owner, m);
                }
                break;
            case 'ping':
                {
                    const moment = (await import('moment-timezone')).default;
                    const calculatePing = function (timestamp, now) {
                        return moment
                            .duration(now - moment(timestamp * 1000))
                            .asSeconds();
                    };
                    m.reply(
                        `*Ping :* *_${calculatePing(
                            m.timestamp,
                            Date.now(),
                        )} second(s)_*`,
                    );
                }
                break;
            case 'quoted':
            case 'q':
                {
                    const { Serialize } = await import('../lib/serialize.js');
                    if (!m.isQuoted) m.reply('quoted');
                    try {
                        const message = await Serialize(
                            kiontol,
                            await kiontol.loadMessage(m.from, m.quoted.id),
                        );
                        if (!message.isQuoted)
                            return m.reply('Quoted Not Found 🙄');
                        kiontol.sendMessage(m.from, {
                            forward: message.quoted,
                        });
                    } catch {
                        m.reply('Quoted Not Found 🙄');
                    }
                }
                break;
            case 'public':
                {
                    if (!m.isOwner) return m.reply('owner');
                    if (config.options.public) {
                        config.options.public = false;
                        m.reply('Switch Bot To Self Mode');
                    } else {
                        config.options.public = true;
                        m.reply('Switch Bot To Public Mode');
                    }
                }
                break;
            case 'kio':
                {
                    // get user name tag
                    let name = m.mentions[0]
                        ? m.mentions[0]
                        : m.isQuoted
                        ? quoted.sender
                        : m.sender;
                    m.reply(`The user name is ${name}`);
                }
                break;

            case 'nks':
                {
                    const neko = await Func.fetchJson(
                        // nekos.life nsfw cat image
                        'https://nekos.life/api/lewd/neko',
                    );

                    m.reply('NSFW Warning!');
                    m.reply(neko.url, { mime: 'image/jpeg' });
                }
                break;

            case 'nahidatelanjang':
                {
                    m.reply('Dasar sangean, ngapain liat-liat orang telanjang');
                }
                break;

            case 'sticker':
            case 's':
            case 'stiker':
                {
                    if (/image|video|webp/i.test(quoted.mime)) {
                        m.reply('wait');
                        const buffer = await quoted.download();
                        if (quoted?.msg?.seconds > 10)
                            return m.reply(`Max video 9 second`);
                        let exif;
                        if (m.text) {
                            let [packname, author] = m.text.split('|');
                            exif = {
                                packName: packname ? packname : '',
                                packPublish: author ? author : '',
                            };
                        } else {
                            exif = { ...config.Exif };
                        }
                        m.reply(buffer, { asSticker: true, ...exif });
                    } else if (m.mentions[0]) {
                        m.reply('wait');
                        let url = await kiontol.profilePictureUrl(
                            m.mentions[0],
                            'image',
                        );
                        m.reply(url, { asSticker: true, ...config.Exif });
                    } else if (
                        /(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm|gif))/i.test(
                            m.text,
                        )
                    ) {
                        m.reply('wait');
                        m.reply(Func.isUrl(m.text)[0], {
                            asSticker: true,
                            ...config.Exif,
                        });
                    } else {
                        m.reply(`Method Not Support`);
                    }
                }
                break;
            case 'toimg':
            case 'toimage':
                {
                    let { webp2mp4File } = await import('../lib/sticker.js');
                    if (!/webp/i.test(quoted.mimeimport.meta)) {
                        return m.reply(
                            `Reply Sticker with command ${prefix + command}`,
                        );
                    }
                    if (quoted.isAnimated) {
                        let media = await webp2mp4File(await quoted.download());
                        await m.reply(media);
                    }
                    let media = await quoted.download();
                    await m.reply(media, { mimetype: 'image/png' });
                }
                break;
            case 'rvo':
                {
                    if (!quoted.msg.viewOnce)
                        return m.reply(
                            `Reply view once with command ${prefix + command}`,
                        );
                    quoted.msg.viewOnce = false;
                    await kiontol.sendMessage(
                        m.from,
                        { forward: quoted },
                        { quoted: m },
                    );
                }
                break;
            default:
                if (
                    ['>', 'eval', '=>'].some(a =>
                        m.body?.toLowerCase()?.startsWith(a),
                    )
                ) {
                    if (!m.isOwner) return m.reply('owner');
                    let evalCmd = '';
                    try {
                        evalCmd = /await/i.test(m.text)
                            ? eval('(async() => { ' + m.text + ' })()')
                            : eval(m.text);
                    } catch (e) {
                        evalCmd = e;
                    }
                    new Promise(async (resolve, reject) => {
                        try {
                            resolve(evalCmd);
                        } catch (err) {
                            reject(err);
                        }
                    })
                        ?.then(res => m.reply(format(res)))
                        ?.catch(err => m.reply(format(err)));
                }

                if (
                    ['$', 'exec'].some(a =>
                        m.body?.toLowerCase()?.startsWith(a),
                    )
                ) {
                    if (!m.isOwner) return m.reply('owner');
                    try {
                        exec(m.text, async (err, stdout) => {
                            if (err) return m.reply(Func.format(err));
                            if (stdout) return m.reply(Func.format(stdout));
                        });
                    } catch (e) {
                        m.reply(Func.format(e));
                    }
                }

                if (/^bot/i.test(m.body)) {
                    m.reply(`Bot Activated "${m.pushName}"`);
                }
        }
    } catch (e) {
        m.reply(format(e));
    }
}
