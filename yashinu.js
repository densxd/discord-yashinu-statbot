const { Intents } = require('discord.js');
const config = require('./config');
const { Yashinu } = require('./Loader');
const CronJob = require('cron').CronJob;
const client = global.client = new Yashinu({
    fetchAllMember: true, intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})
client.cmdLoder()
client.database()

var resetStats = new CronJob('00 00 00 * * 1', async function() { // 1 = Pazartesi // 1 = Monday
  let guild = client.guilds.cache.get(config.GuildID);
  let newData = new Map();
  await MemberStats.updateMany({ guildID: guild.id }, { voiceStats: newData, chatStats: newData });
  let stats = await MemberStats.find({ guildID: guild.id });
  stats.filter(s => !guild.members.cache.has(s.userID)).forEach(s => MemberStats.findByIdAndDelete(s._id));
  console.log('Haftalık istatistikler sıfırlandı!');
}, null, true, 'Europe/Istanbul');
resetStats.start();

client.login(config.Token).then(console.info('[HEY!] Bot başarılı olarka giriş yaptı!')).catch(x=> console.log(`Bot giriş yaparken hata ile karşılaştı (${x})`))
// YASHINU 💛 DENS WAS HERE!