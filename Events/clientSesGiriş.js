const client = global.client;
const Voice = require('@discordjs/voice')
const config = require('../config')

// YASHINU 💛 DENS WAS HERE!

exports.execute = async () => {
    client.user.setPresence({ activities: [{ name: `${config.EmbedAltyazi}` }] })
    if(client.channels.cache.has(config.BotSesKanal)) {
        const channel = client.channels.cache.get(config.BotSesKanal)
        const guild = client.guilds.cache.get(config.GuildID)
        let connection = Voice.getVoiceConnection(guild.id)
        if (!connection) {
          connection = Voice.joinVoiceChannel({
            adapterCreator: guild.voiceAdapterCreator,
            channelId: channel.id,
            guildId: guild.id,
            selfDeaf: true
          });
        }
    }
}

exports.conf = {
    event: "ready"
}

// YASHINU 💛 DENS WAS HERE!