function shareOnTwitter(title) {
	let postText = "<%= article.hashtags %>";
	var regexp = /#(\S)/g;
	tag = postText.replace(regexp, "$1");
	const encodedTitle = encodeURIComponent(title);
	const encodedUrl = encodeURIComponent(window.location.href);
	const hashtags = tag;
	const shareUrl = `https://twitter.com/intent/tweet?text=Check%20out%20this%20article:%20${encodedTitle}&url=${encodedUrl}&hashtags=${hashtags}`;
	window.open(shareUrl, "_blank");
	console.log(tag);
}
console.log("View Count: <%= article.viewCount %>");
const shareButton = document.getElementById("shareButton");
shareButton.addEventListener("click", async () => {
	try {
		if (navigator.share) {
			const shareData = {
				title: "<%= article.title %>",
				text: "<%= article.description %>",
				url: window.location.href,
			};
			await navigator.share(shareData);
		} else {
			const url = window.location.href;
			const dummy = document.createElement("textarea");
			dummy.value = url;
			dummy.setAttribute("readonly", "");
			dummy.style.position = "absolute";
			dummy.style.left = "-9999px";
			document.body.appendChild(dummy);
			dummy.select();
			document.execCommand("copy");
			document.body.removeChild(dummy);
			alert(`Link copied to clipboard :) \n also check if you are using HTTPS.`);
		}
	} catch (err) {
		if (err.name === "AbortError") {
			return;
		} else {
			console.log(err);
			alert(`Oops, something broke. Please report this bug!`);
			const url = "/bugreport";
			const data = {
				title: "error sharing",
				issue: `${err}`,
			};
			fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
		}
	}
});
