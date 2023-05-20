const { DiscordLogger } = require("../discordlogger/webhook");

const logger = new DiscordLogger();

// Send a bug report to the first Discord channel
logger.bugReport("Bug Title", "Bug Description");

// Send a log event to the second Discord channel
logger.logEvent("Event Title", "Event Description");
