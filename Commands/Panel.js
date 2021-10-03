const { MessageEmbed } = require('discord.js');
const config = require('../config');
const MemberStats = require("../Models/MemberStats")

exports.execute = async (client, message, args) => {
    if (!config.Owner.includes(message.member.id) && message.guild.ownerID != message.member.id) return message.channel.send({ content: `**Bunu yapmak için yeterli yetkin yok!**` })
    let secim = args[0];
    const embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }));
    if (secim === 'sıfırla') {
        if (!args[1] || (args[1] !== 'ses' && args[1] !== 'chat')) return message.channel.send({ embeds: [embed.setDescription('Sıfırlanacak veriyi belirtmelisin! (ses/chat)')] }).then(x => setTimeout(() => x.delete(), 5000))
        if (args[1] === 'ses') {
            let newData = new Map();
            await MemberStats.updateMany({ guildID: message.guild.id }, { voiceStats: newData });
        }

        if (args[1] === 'chat') {
            let newData = new Map();
            await MemberStats.updateMany({ guildID: message.guild.id }, { chatStats: newData });
        }
        return message.channel.send({ embeds: [embed.setDescription('Başarıyla belirtilen istatistik verileri sıfırlandı!')] });
    }
    if (!secim) return message.channel.send({ embeds: [embed.setDescription('Ses veya Chat istatistiklerini sıfırlamak istiyorsan.\n Chat statlarını sıfırlamak için **sıfırla chat** veya Ses için **sıfırla ses** yapmalısın!')] })
}

exports.conf = {
    name: "panel",
    owner: false,
    cooldown: 5,
    aliases: ['ayar','ayarlar'],
    description: "Sunucu Stat ayarları.",
    usage: "panel [seçim] [ayar]",
}