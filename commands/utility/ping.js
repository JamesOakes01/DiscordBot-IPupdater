const { SlashCommandBuilder } = require('discord.js');

async function GetIP () {
    var res = await fetch('https://ipinfo.io/ip')
    var data = await res.text()

    console.log(data)
	return(data)
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with the IP of the server!'),
	async execute(interaction) {
		const ip = await GetIP();
		await interaction.reply(ip);
	},
};