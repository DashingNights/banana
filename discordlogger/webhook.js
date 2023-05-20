const axios = require('axios');
const config = require('../config');


class DiscordLogger {

    sendMessage(Event, logmsg) {
        //date for Hong Kong time
        var date = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Hong_Kong' });
        let embeds = [
            {
            title: Event,
            color: ff1100,
            footer: {
                text: `📅 ${date}`,
            },
            fields: [
                {
                name: '⠀',
                value: logmsg
                },
            ],
            },
        ];
        let data = JSON.stringify({ embeds });
        // Send the bug report to a Discord channel using a webhook
        try {
            var axiosconfig = {
                method: 'POST',
                url: config.Discord.webhook2, // Replace with your own webhook URL
                headers: { 'Content-Type': 'application/json' },
                data: data,
            };
            axios(axiosconfig)
            .then((response) => {
                console.log('');
                return response;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
        } catch (error) {
        console.error('Error sending Discord message:', error.response);
        }
    }
}
