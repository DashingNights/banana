# Banana Project

This is a one-page documentation for the Banana Project. This project is primarily made for the HKUGA College student-ran 'College Insider'. Please edit to fit usage purposes when forked.

DEMO:
[DEMO: https://insider.argus10q.live](https://insider.argus10q.live)

## Adding to your phone home-screen

[Guide](https://www.macrumors.com/how-to/add-a-web-link-to-home-screen-iphone-ipad/)

## Overview

The Banana Project is a website that allows users to read and write articles. The project has both front-end and back-end components, and it is built using Node.js, Express.js, and MongoDB.

## Getting Started

### Video tutorial for simple setup

[![video tutorial of setup](https://img.youtube.com/vi/LN8A-FSzVqI/0.jpg)](https://www.youtube.com/watch?v=LN8A-FSzVqI)

To run the Banana Project, follow the instructions below:

1. Install MongoDB, Node.js, and npm on your host computer. Set up firewall to allow port 1234. (can be changed in config.js)

2. Clone the repository using the following command:

`git clone https://github.com/DashingNights/banana.git`

3. Install the dependencies using the following command:

`npm install`

[Installing MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)

4. Create the config.js file in the root directory and add the following code:

```javascript
const config = {
	port: 1234, //website port
	Mongodb: {
		host: "127.0.0.1",
		name: "PROD",
	},
	Session: {
		//random string
		token: "token",
	},
	Discord: {
		//THIS IS FOR BUG REPORTING
		webhook: "https://discord.com/api/webhooks/CHANGE_THIS_LINK",
		//THIS IS FOR LOGGING
		webhook2: "https://discord.com/api/webhooks/CHANGE_THIS_LINK",
		//THESE FEATURES CAN ONLY BE TURNED OFF ( IN CODE ) IF YOU KNOW WHAT YOU ARE DOING, PLEASE DO NOT TURN THEM OFF IF YOU DO NOT KNOW WHAT YOU ARE DOING, HAVING A LOGGING SYSTEM IS VERY IMPORTANT FOR DEBUGGING
	},
	auth0: {
		management: {
			domain: "domain-here.auth0.com", //same as issuerBaseURL, without "https://", example: "dev-eav9286n4ywh7.us.auth0.com"
			clientId: "AAAAAAAAAA", //same as "clientID" below, under "Application" -> Settings -> Client ID
			clientSecret: "AAAAAAAAAA", //under "Application" -> Settings -> Client secret
			scope: "read:role_members read:users", //do not change unless you know what you are doing
		},
		config: {
			authRequired: false, //do not change unless you know what you are doing
			auth0Logout: true, //do not change unless you know what you are doing
			baseURL: "https://your-website.com", //your website url, example: https://hkugacinsider.com/
			clientID: "AAAAAAAAAA", //same as "clientId" above
			issuerBaseURL: "https://domain-here.auth0.com", //same as "domain" above, with "https://" in front, example: "https://dev-eav9286n4ywh7.us.auth0.com"
			secret: "AAAAAAAAAAAA", //a random string, used to encrypt your session
		},
	},
};
module.exports = config;
```

5. Start the server using the following command:

`npm start`

6. Access the website at `http://localhost:1234`

## Authentication

This project uses the [Auth0](https://auth0.com/) service for authentication. Please set it up according to the instructions in the video.
