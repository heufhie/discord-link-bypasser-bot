const { Client, IntentsBitField } = require('discord.js');
require('dotenv').config();

let fetch;
(async () => {
    fetch = (await import('node-fetch')).default;
})();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', () => {
    console.log('The link bypasser is ready!!');
});

client.on('messageCreate', async (message) => {
    const content = message.content.toLowerCase();

    if (message.author.bot) return;

    if (content.startsWith('!bypass')) {
        const args = content.split(' ');
        const url = args[1];

        if (!url) {
            return message.reply('Please provide a URL to bypass.');
        }

        const apiUrl = `https://api.bypass.vip/bypass?url=${encodeURIComponent(url)}`;

        try {
            const response = await fetch(apiUrl); // Use fetch to call the API
            const body = await response.json(); // Parse the response JSON

            if (body.status === 'success' && body.result) {
                message.reply(`Here's your bypassed link: ${body.result}`);
            } else {
                message.reply('Could not bypass the URL. Please try again later.');
            }
        } catch (error) {
            console.error(error); // Log the error for debugging
            message.reply('There was an error while trying to bypass the URL.');
        }
    }
});

client.login(process.env.TOKEN);
