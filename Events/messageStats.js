const MemberStats = require('../Models/MemberStats');
exports.execute = async (message) => {

    if (message.author.bot || !message.guild) return;
    MemberStats.findOne({ guildID: message.guild.id, userID: message.author.id }, (err, data) => {
        let kanalID = message.channel.parentId || message.channel.id;
        if (!data) {
            let voiceMap = new Map();
            let chatMap = new Map();
            chatMap.set(kanalID, 1);
            let newMember = new MemberStats({
                guildID: message.guild.id,
                userID: message.author.id,
                voiceStats: voiceMap,
                totalVoiceStats: 0,
                chatStats: chatMap,
                totalChatStats: 1
            });
            newMember.save();
        } else {
            let onceki = data.chatStats.get(kanalID) || 0;
            data.chatStats.set(kanalID, Number(onceki)+1);
            data.totalChatStats++;
            data.save();
        };
    });
}

exports.conf = {
    event: "messageCreate"
}