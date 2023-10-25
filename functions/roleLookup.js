const config = require("../config");
const { auth, requiresAuth } = require("express-openid-connect");
const ManagementClient = require("auth0").ManagementClient;
const auth0 = new ManagementClient(config.auth0.management);
const auth0config = config.auth0.config;

function requiresRole(role) {
	return async function (req, res, next) {
		try {
			const user = req.oidc.user;
			const roles = await auth0.getUserRoles({ id: user.sub });
			if (roles && roles.some((r) => r.name === role)) {
				next();
			} else {
				res.redirect("/noperm");
			}
		} catch (err) {
			console.error(err);
			res.redirect("/oopsies");
		}
	};
}
//goofy
module.exports = requiresRole;
