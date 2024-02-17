import config from '../config.js';

export default async function GroupParticipants(
    kiontol,
    { id, participants, action },
) {
    try {
        const metadata = await kiontol.groupMetadata(id);

        // participants
        for (const jid of participants) {
            // get profile picture user
            let profile;
            try {
                profile = await kiontol.profilePictureUrl(jid, 'image');
            } catch {
                profile =
                    'https://lh3.googleusercontent.com/proxy/esjjzRYoXlhgNYXqU8Gf_3lu6V-eONTnymkLzdwQ6F6z0MWAqIwIpqgq_lk4caRIZF_0Uqb5U8NWNrJcaeTuCjp7xZlpL48JDx-qzAXSTh00AVVqBoT7MJ0259pik9mnQ1LldFLfHZUGDGY=w1200-h630-p-k-no-nu';
            }

            // switch (action) {
            //     case 'add': {
            //         if (!db.groups[id]?.welcome) return;
            //         kiontol.sendMessage(id, {
            //             text: `Welcome @${jid.split('@')[0]} to "${
            //                 metadata.subject
            //             }"`,
            //             contextInfo: {
            //                 mentionedJid: [jid],
            //                 externalAdReply: {
            //                     title: `Welcome`,
            //                     mediaType: 1,
            //                     previewType: 0,
            //                     renderLargerThumbnail: true,
            //                     thumbnailUrl: profile,
            //                     sourceUrl: config.Exif.packWebsite,
            //                 },
            //             },
            //         });
            //         break;
            //     }
            //     case 'remove': {
            //         if (!db.groups[id]?.leave) return;
            //         kiontol.sendMessage(id, {
            //             text: `@${jid.split('@')[0]} Leaving From "${
            //                 metadata.subject
            //             }"`,
            //             contextInfo: {
            //                 mentionedJid: [jid],
            //                 externalAdReply: {
            //                     title: `Leave`,
            //                     mediaType: 1,
            //                     previewType: 0,
            //                     renderLargerThumbnail: true,
            //                     thumbnailUrl: profile,
            //                     sourceUrl: config.Exif.packWebsite,
            //                 },
            //             },
            //         });
            //         break;
            //     }
            // }
        }
    } catch (e) {
        throw e;
    }
}
