const { Client, Collection } = require("discord.js")
const path = require('path');
const stuffs = require('stuffs')
const readdirRecursive = require('recursive-readdir');
const chillout = require('chillout');
const config = require("./config");
const mongoose = require('mongoose')
class Yashinu extends Client {
    constructor(options) {
        super(options)
        this.commands = new Collection()
        this.aliases = new Collection()
    }
    async cmdLoder() {

        let commandPath = path.resolve('./Commands')
        await stuffs.makeSureFolderExists(commandPath)
        let commandFiles = await readdirRecursive(commandPath);
        await chillout.forEach(commandFiles, (commandFile) => {
            let command = require(commandFile);
            let bsname = commandFile.split('\\').pop().split('/').pop();
            this.commands.set(command.conf.name, command);
            console.log(`(${bsname.replace('.js', '')}) adlı komut yüklendi.`)
            command.conf.aliases.forEach(aliases => client.aliases.set(aliases, command));
        });
        let eventPath = path.resolve('./Events')
        await stuffs.makeSureFolderExists(eventPath)
        let eventFiles = await readdirRecursive(eventPath);
        await chillout.forEach(eventFiles, (eventFile) => {
            let event = require(eventFile);
            let bsname = eventFile.split('\\').pop().split('/').pop();
            console.log(`(${bsname.replace('.js', '')}) adlı event yüklendi.`)
            this.on(event.conf.event, event.execute);
        });
        require('./Utill/functionHandler')(this)
        this.on("ready", () => {
            this.user.setPresence({ activities: [{ name: `${config.EmbedAltyazi}` }] })
        })
    }
    async database() {
        let dbconnecttime = Date.now()
        const dbAyar = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
        };

        mongoose.connect(config.MongoURL, dbAyar)

        mongoose.connection.on('connected', () => {
            console.log(`\nMongo bağlantısı kuruldu! Databaseye bağlanması (${Date.now() - dbconnecttime})ms sürdü.`);
        });

        mongoose.connection.on('err', err => {
            console.error(`Mongo bağlantı hatası: \n${err.stack}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Mongo bağlantısı kesildi!');
        });
    }
}

module.exports = { Yashinu }