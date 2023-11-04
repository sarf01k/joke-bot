const { Client, IntentsBitField } = require('discord.js');
require('dotenv').config();
const https = require('https');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`🟢 ${client.user.tag} is online...`);
});

client.on('messageCreate', async message => {
    if (message.content.toLowerCase() === 'joke') {
        try {
            const joke = await fetchJoke();
            message.reply(joke);
        } catch (error) {
            console.error(error);
            message.reply('Sorry, I couldn\'t fetch a joke at the moment.');
        }
    }
});

async function fetchJoke() {
    return new Promise((resolve, reject) => {
        https.get('https://v2.jokeapi.dev/joke/Programming?safe-mode', response => {
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', () => {
                try {
                    const joke = JSON.parse(data);
                    if (joke.type === 'single') {
                        resolve(joke.joke);
                    } else if (joke.type === 'twopart') {
                        resolve(`- ${joke.setup}\n  ${joke.delivery}`);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', error => {
            reject(error);
        });
    });
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'joke') {
        try {
            const joke = await fetchJoke();
            await interaction.reply(joke);
        } catch (error) {
            console.error(error);
            await interaction.reply('Sorry, I couldn\'t fetch a joke at the moment.');
        }
    }
})

client.login(`${process.env.TOKEN}`);