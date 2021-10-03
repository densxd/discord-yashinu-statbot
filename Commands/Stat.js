const { MessageEmbed } = require('discord.js');
const config = require('../config');
const MemberStats = require("../Models/MemberStats")

exports.execute = async (client, message, args) => {
    // if(!message.member.roles.cache.array().some(rol => message.guild.roles.cache.get(ayar.staffrole).rawPosition <= rol.rawPosition)) return  message.reply("`Bu komut yetkililere özeldir.`");
    let uye = message.mentions.users.first() || client.users.cache.get(args[0]) || message.guild.members.cache.get(args[0]) || message.member;
    let embed = new MessageEmbed().setColor("3f0000").setAuthor(uye.user.tag, message.guild.iconURL({dynamic: true, size: 2048})).setThumbnail(uye.user.avatarURL({dynamic:true, size: 2048})).setFooter(config.EmbedAltyazi)
    const statvarmi = await MemberStats.findOne({ guildID: message.guild.id, userID: uye.id })
    if (!statvarmi) return message.channel.send({ embeds:  [embed.setDescription('Belirtilen üyeye ait herhangi bir veri bulunamadı!')]  });
    MemberStats.findOne({ guildID: message.guild.id, userID: uye.id }, (err, data) => {
        let haftalikSesToplam = 0;
        data.voiceStats.forEach(c => haftalikSesToplam += c);
        let haftalikSesListe = '';
        data.voiceStats.forEach((value, key) => haftalikSesListe += ` \`●\` ${message.guild.channels.cache.has(key) ? '<#'+message.guild.channels.cache.get(key).id+'>' : 'bilinmeyen-kanal'}: \`${client.convertDuration(value)}\`\n`);
        let haftalikChatToplam = 0;
        data.chatStats.forEach(c => haftalikChatToplam += c);
        let haftalikChatListe = '';
        data.chatStats.forEach((value, key) => haftalikChatListe += `\`●\` ${message.guild.channels.cache.has(key) ? '<#'+message.guild.channels.cache.get(key).id+'>' : 'bilinmeyen-kanal'}: \`${value} mesaj\`\n`);
        embed.addField('**Genel İstatistik**', `\`●\` Genel Toplam Ses: \`${client.convertDuration(data.totalVoiceStats || 0)}\`\n\`●\` Genel Toplam Chat: \`${data.totalChatStats || 0} mesaj\``);
        embed.addField('Haftalık Ses', `\`●\` Toplam: \`${client.convertDuration(haftalikSesToplam)}\` \n ${haftalikSesListe}`);
        embed.addField('Haftalık Chat', `\`●\` Toplam: \`${haftalikChatToplam} mesaj\` \n ${haftalikChatListe}`);
        message.channel.send({ embeds: [embed] })
    });
}

exports.conf = {
    name: "stat",
    owner: false,
    cooldown: 5,
    aliases: ['stats', 'vinfo', 'cinfo'],
    description: "Belirtilen üyenin tüm ses ve chat bilgilerini gösterir.",
    usage: "stat [üye]",
}