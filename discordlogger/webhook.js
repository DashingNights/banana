const axios = require("axios");
const config = require("../config");

class DiscordLogger {
	bugReport(bug, bugmsg) {
		let hook = config.Discord.webhook;
		let PASSTYPE = "Bug";
		this.sendMessage(bug, bugmsg, hook, PASSTYPE);
	}
	logEvent(Event, logmsg) {
		let hook = config.Discord.webhook2;
		let PASSTYPE = "Event";
		let extraparam = null;
		this.sendMessage(Event, logmsg, hook, PASSTYPE);
	}

	sendMessage(TITLE, CONTENT, hook, PASSTYPE) {
		//date for Hong Kong time
		var date = new Date().toLocaleDateString("en-US", {
			timeZone: "Asia/Hong_Kong",
		});
		var DA_CALA;
		if (PASSTYPE == "Bug") {
			DA_CALA = 16728192;
			var extraparam = " ";
			// console.log('bug');
			// console.log(DA_CALA)
		} else if (PASSTYPE == "Event") {
			DA_CALA = 65280;
			var extraparam = " ";
			// console.log('log');
			// console.log(DA_CALA)
		}
		let embeds = [
			{
				title: TITLE,
				color: DA_CALA,
				footer: {
					text: `📅 ${date}`,
				},
				fields: [
					{
						name: "⠀",
						value: `${CONTENT} , ${extraparam}`,
					},
				],
			},
		];
		let data = JSON.stringify({ embeds });
		// Send the bug report to a Discord channel using a webhook
		try {
			var axiosconfig = {
				method: "POST",
				url: hook,
				headers: { "Content-Type": "application/json" },
				data: data,
			};
			axios(axiosconfig)
				.then((response) => {
					return response;
				})
				.catch((error) => {
					// console.log(error);
					return error;
				});
		} catch (error) {
			// console.error("Error sending Discord message:", error.response);
		}
	}
}

exports.DiscordLogger = DiscordLogger;
