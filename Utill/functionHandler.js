const Discord = require('discord.js')
const moment = require('moment')
require('moment-duration-format');
moment.locale("tr")
module.exports = (client) =>{
    client.convertDuration = (date) => {
        return moment.duration(date).format('H [saat,] m [dakika,] s [saniye]');
      };
      
    client.getDuraction = (ms) => {
    return Date.now() - ms;
    };
}