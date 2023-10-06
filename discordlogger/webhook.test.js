const { DiscordLogger } = require("./webhook");
describe("DiscordLogger", () => {
	let logger;

	beforeEach(() => {
		logger = new DiscordLogger();
	});

	describe("bugReport", () => {
		it("should send a bug report message to Discord", () => {
			const mockSendMessage = jest.spyOn(logger, "sendMessage");
			const bug = "Test Bug";
			const bugmsg = "This is a test bug report";
			logger.bugReport(bug, bugmsg);
			expect(mockSendMessage).toHaveBeenCalledWith(bug, bugmsg, expect.any(String), "Bug");
		});
	});

	describe("logEvent", () => {
		it("should send a log event message to Discord", () => {
			const mockSendMessage = jest.spyOn(logger, "sendMessage");
			const event = "Test Event";
			const logmsg = "This is a test log event";
			logger.logEvent(event, logmsg);
			expect(mockSendMessage).toHaveBeenCalledWith(event, logmsg, expect.any(String), "Event");
		});
	});
});
