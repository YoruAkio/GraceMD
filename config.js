// setting your list menu on here
const menu = {
    main: ['help', 'owner', 'ping', 'quoted', 'nahidatelanjang'],
    owner: ['eval', 'exec', 'public'],
    convert: ['sticker', 'toimage'],
    // group: [
    //     'hidetag',
    //     'add',
    //     'welcome',
    //     'leaving',
    //     'setprofile',
    //     'setname',
    //     'linkgroup',
    // ],
    // download: [''],
    // education: [''],
};

const limit = {
    free: 15,
    premium: 150,
    VIP: 'Infinity',
    download: {
        free: 50000000, // use byte
        premium: 350000000, // use byte
        VIP: 1130000000, // use byte
    },
};

export default {
    limit,
    menu,

    // Set Prefix, Session Name, Database Name and other options here
    options: {
        public: false,
        antiCall: true, // reject call
        database: 'database.json', // End .json when using JSON database or use Mongo URI
        owner: ['6289509424877'], // set owner number on here
        sessionName: 'KioIsHere', // for name session
        prefix: /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i,
        pairingNumber: '', // Example Input : 62xxx
    },

    // Set pack name sticker on here
    Exif: {
        packId: 'https://airi.dev',
        packName: `AkioPack`,
        packPublish: 'KioIsHere',
        packEmail: 'yoruakio@proton.me',
        packWebsite: 'https://airi.dev',
        androidApp:
            'https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro',
        iOSApp: 'https://apps.apple.com/id/app/muslim-pro-al-quran-adzan/id388389451?|=id',
        emojis: [],
        isAvatar: 0,
    },

    // message  response awikwok there
    msg: {
        owner: 'Features can only be accessed owner!',
        group: 'Features only accessible in group!',
        private: 'Features only accessible private chat!',
        admin: 'Features can only be accessed by group admin!',
        botAdmin: "Bot is not admin, can't use the features!",
        bot: 'Features only accessible by me',
        media: 'Reply media...',
        query: 'No Query?',
        error: 'Seems to have encountered an unexpected error, please repeat your command for a while again',
        quoted: 'Reply message...',
        wait: 'Wait a minute...',
        urlInvalid: 'Url Invalid',
        notFound: 'Result Not Found!',
        premium: 'Premium Only Features!',
        vip: 'VIP Only Features!',
        dlFree: `File over ${formatSize(
            limit.download.free,
        )} can only be accessed by premium users`,
        dlPremium: `WhatsApp cannot send files larger than ${formatSize(
            limit.download.premium,
        )}`,
        dlVIP: `WhatsApp cannot send files larger than ${formatSize(
            limit.download.VIP,
        )}`,
    },
};

function formatSize(bytes, si = true, dp = 2) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return `${bytes} B`;
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (
        Math.round(Math.abs(bytes) * r) / r >= thresh &&
        u < units.length - 1
    );

    return `${bytes.toFixed(dp)} ${units[u]}`;
}
