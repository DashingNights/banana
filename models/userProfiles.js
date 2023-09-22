const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
	user_nickname: {
		type: String,
	},
	user_description: {
		type: String,
	},
	user_image: {
		type: String,
	},
});

module.exports = mongoose.model("userProfiles", profileSchema);
