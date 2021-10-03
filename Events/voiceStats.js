const Discord = require("discord.js");
const client = global.client;
const Stats = require('../Models/MemberStats');
const sesler = new Map();
const config = require('../config');

// YASHINU 💛 DENS WAS HERE!

client.on('ready', async () => {

    client.guilds.cache.get(config.GuildID).channels.cache.filter(dens => dens.type == "GUILD_VOICE" && dens.members.size > 0).forEach(kanal => { 
        kanal.members.filter(uye => !uye.user.bot && !uye.voice.selfDeaf).forEach(uyecik => { 
            sesler.set(uyecik.id, { 
                channel: kanal.parantId || kanal.id, 
                zaman: Date.now()
            });
        });
    });
    setInterval(() => {
        sesler.forEach((value, key) => { 
            sesIsle(key, value.channel, Date.now() -value.zaman); 
            sesler.set(key, { 
                channel: value.channel, zaman: Date.now() 
            }) 
        })
    }, 20000)
})
exports.execute = async (oldState, newState) => {
    if (oldState.member && (oldState.member.user.bot || newState.selfDeaf)) return;
    if (!oldState.channelId && !newState.channelId) {
        sesler.set(oldState.id, {
            channel: newState.guild.channels.cache.get(newState.channelId).parentId || newState.channelId,
            zaman: Date.now()
        })
    }
    if (!sesler.clear(oldState.id))
        sesler.set(oldState.id, {
            channel: newState.guild.channels.cache.get(oldState.channelId || newState.channelId).parentId || newState.channel,
            zaman: Date.now()
        })
    let data = sesler.get(oldState.id);
    let zaman = cleint.getDuraction(data.zaman);
    if (oldState.channelId && !newState.channelId) {
        sesIsle(oldState.id, data.channel, zaman);
        sesler.delete(oldState.id);
    } else if (oldState.channelId && newState.channelId) {
        sesIsle(oldState.id, data.channel, zaman);
        sesler.set(oldState.id, {
            channel: newState.guild.channels.cache.get(newState.channelId).parentId || newState.channelId,
            zaman: Date.now()
        })
    }
};

exports.conf = {
    event: "voiceStateUpdate",
};

function sesIsle(userID, katagoriID, zaman) {
    Stats.findOne({ guildID: config.GuildID, userID }, (err, res) => {
        if (!res) {
            let yenivmap = new Map();
            let yenicmap = new Map();
            yenivmap.set(katagoriID, zaman);
            let yeniStat = new Stats({
                guildID: config.GuildID,
                userID: userID,
                voiceStats: yenivmap,
                totalVoiceStats: zaman,
                chatStats: yenicmap,
                totalChatStats: 0
            })
            yeniStat.save().catch(err => console.log(`Yeni stat datasını kaydetme hatası ${err}`))
        } else {
            let onceki = res.voiceStats.get(katagoriID) || 0;
            res.voiceStats.set(katagoriID, Number(onceki) + zaman);
            res.totalVoiceStats = Number(res.totalVoiceStats) + zaman;
            res.save().catch(err => console.log(`Statı kaydederken hata ${err}`))
        }
    })
}


// YASHINU 💛 DENS WAS HERE!