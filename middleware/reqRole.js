function getRole(role) {
	return async function (req, res, next) {
		try {
			const user = req.oidc.user;
			const roles = await auth0.getUserRoles({ id: user.sub });
			if (roles && roles.some((r) => r.name === role)) {
				next();
			} else {
				res.redirect("/");
			}
		} catch (err) {
			console.error(err);
			res.redirect("/");
		}
	};
}
