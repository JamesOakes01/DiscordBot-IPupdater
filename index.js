// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { channel } = require('node:diagnostics_channel');

//axios
const axios = require('axios');
const { send } = require('node:process');
const { data } = require('./commands/utility/ping');

//customstuff


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

//
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

/*
client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
});
*/

client.on('ready', () => {


    console.log(`Logged in as ${client.user.tag}!`);
	//console.log(axios.get('ipinfo.io/ip'))
	//console.log(fetch('https://ipinfo.io/ip'));
	//setInterval(getData, 10000);
	getData()
    
	//client.channels.cache.get('1080390380001951798').send('Hello here!');
});

const getData = async () => {
    const res = await fetch('https://ipinfo.io/ip')
    const data = await res.text()

    console.log(data)
	//console.log(fs.readFile('CurrentIP.txt'))
	const currentip1 = fs.readFileSync('CurrentIP.txt', 'utf8')
	if (data != currentip1) {
		console.log("The IP has changed. New ip is \n" + data + "\nWhile old IP was " + currentip1)
		fs.writeFileSync('CurrentIP.txt', data)
		sendMessage(data)
	}
	console.log(currentip1)
	//return(data)
}

function getIP() {
	
}

function sendMessage (messages){
	client.channels.cache.get('1080390380001951798').send("The new server IP is:\n" + messages);
}

client.on(Events.InteractionCreate, async interaction => {
	
    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});



// Log in to Discord with your client's token
client.login(token);






/*
const Discord = require('discord.js');

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: 2048 })


client.on('ready', () => {


 console.log(`Logged in as ${client.user.tag}!`);


 });


client.on('message', msg => {

console.log(msg);
 if (msg.content === 'ping') {


 msg.reply('pong');


 }


 });

client.login(token);
*/