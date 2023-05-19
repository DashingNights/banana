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
    Email: {
        host: 'smtp.example.com',
        port: 587,
        from: '',
        pass: ''
    }
};
module.exports = config;
