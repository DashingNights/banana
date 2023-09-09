let auth0Client = null;
const fetchAuthConfig = () => fetch("/auth_config.json");
const configureClient = async () => {
	const response = await fetchAuthConfig();
	const config = await response.json();

	auth0Client = await auth0.createAuth0Client({
		domain: config.domain,
		clientId: config.clientId,
	});
};
// ..

window.onload = async () => {
	// .. code ommited for brevity

	updateUI();

	const isAuthenticated = await auth0Client.isAuthenticated();

	if (isAuthenticated) {
		// show the gated content
		return;
	}

	// NEW - check for the code and state parameters
	const query = window.location.search;
	if (query.includes("code=") && query.includes("state=")) {
		// Process the login state
		await auth0Client.handleRedirectCallback();

		updateUI();

		// Use replaceState to redirect the user away and remove the querystring parameters
		window.history.replaceState({}, document.title, "/");
	}
};

// NEW
const updateUI = async () => {
	const isAuthenticated = await auth0Client.isAuthenticated();

	document.getElementById("btn-logout").disabled = !isAuthenticated;
	document.getElementById("btn-login").disabled = isAuthenticated;

	// NEW - add logic to show/hide gated content after authentication
	if (isAuthenticated) {
		document.getElementById("gated-content").classList.remove("hidden");

		document.getElementById("ipt-access-token").innerHTML =
			await auth0Client.getTokenSilently();

		document.getElementById("ipt-user-profile").textContent =
			JSON.stringify(await auth0Client.getUser());
	} else {
		document.getElementById("gated-content").classList.add("hidden");
	}
};
const login = async () => {
	await auth0Client.loginWithRedirect({
		authorizationParams: {
			redirect_uri: window.location.origin,
		},
	});
};
const logout = () => {
	auth0Client.logout({
		logoutParams: {
			returnTo: window.location.origin,
		},
	});
};
