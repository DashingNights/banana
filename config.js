const config = {
    Mongodb: {
        host: '127.0.0.1',
        name: 'PROD'
    },
    JWT: {
        token: 'secret'
    },
    Session: {
        token: 'token'
    },
    Discord: {
        // this is for debugging bug report, refer to server.js
        webhook: 'https://discord.com/api/webhooks/1109138023620284416/th9cnHlVZsAnC7cptkuiUTWIHMNGe1DiMHzpNkHGbPsa_pAukDZZrUH_3O6CabMnoYDs'
    }
};
module.exports = config;