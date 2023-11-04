const { REST, Routes} = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'joke',
        description: 'Replies with joke'
    }
]

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands}
        );
        console.log('Slash commands registered');
    } catch (error) {
        console.log(`Error:\n${error}`);
    }
})();