const Discord = require("discord.js");
const client = global.client;
const cooldowns = new Map();
const config = require('../config');

// YASHINU 💛 DENS WAS HERE!

exports.execute = async (message) => {
    if (message.author.bot || !config.Prefixes.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type == "dm") return;
    if(message.member.roles.cache.has(config.JailRole) || config.TeyitsizRolleri.some(rol => message.member.roles.cache.has(rol))) return;
    let args = message.content.substring(config.Prefixes.some(x => x.length)).split(" ")
    let command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0])
    let komut = args[0]
    args = args.splice(1);
    if (command) {

        if (!cooldowns.has(command.conf.command)) {
            cooldowns.set(command.conf.command, new Discord.Collection());
        }
        const simdikizaman = Date.now()
        const coolekle = cooldowns.get(command.conf.command)
        const cooldown_zamani = (command.conf.cooldown) * 1000;

        if (coolekle.has(message.member.id)) {
            const bitis_Zaman = coolekle.get(message.member.id) + cooldown_zamani;
            if (simdikizaman < bitis_Zaman) {
                const kalanz_zaman = (bitis_Zaman - simdikizaman) / 1000;
                return message.reply({ content: `Hey hey! Bu komutu çok hızlı kullanıyorsun **${kalanz_zaman.toFixed(1)}** saniye beklermisin` })
            }
        }
        setTimeout(() => coolekle.delete(message.member.id), cooldown_zamani)
        const embed = new Discord.MessageEmbed()
        try {
            if (command.conf.owner == true) {
                if (message.member.id == config.Owner) {
                    command.execute(client, message, args, embed)
                    if (config.Owner.some(x => !message.member.id == (x))) { 
                        coolekle.set(message.member.id, simdikizaman) 
                    }
                }
            } else {
                command.execute(client, message, args)
                if (config.Owner.some(x => !message.member.id == (x))) { 
                    coolekle.set(message.member.id, simdikizaman) 
                }
            }


        } catch (err) {
            console.log(err)

        }
    }
};

exports.conf = {
    event: "messageCreate",
};
// YASHINU 💛 DENS WAS HERE!
// YASHINU 💛 DENS WAS HERE!