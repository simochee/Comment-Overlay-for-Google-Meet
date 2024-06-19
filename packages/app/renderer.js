const comments = [];

const lastCommentAt = [];

const addNewComment = async (text) => {
	await new Promise((resolve) => requestAnimationFrame(resolve));

	const canvas = document.getElementById("comments");
	const p = document.createElement("p");
	p.textContent = text;

	p.classList.add("comment");
	p.style.animationDuration = "8s";

	p.addEventListener("animationend", () => p.remove());

	let nextIndex = lastCommentAt.findIndex((time) => Date.now() - time > 6000);

	if (nextIndex === -1) {
		if (lastCommentAt.length === 0) {
			nextIndex = 0;
		} else if (lastCommentAt.length <= 4) {
			nextIndex = lastCommentAt.length;
		} else {
			nextIndex = lastCommentAt.indexOf(Math.min(...lastCommentAt));
		}
	}

	lastCommentAt[nextIndex] = Date.now();
	p.dataset.row = nextIndex + 1;

	canvas.appendChild(p);
};

const addReaction = async (src, left, size) => {
	console.log("add reaction", src, left);

	const canvas = document.getElementById("reactions");

	const img = document.createElement("img");
	img.src = src;
	img.classList.add("reaction");
	img.style.left = left;
	img.style.width = size;

	canvas.appendChild(img);

	img.addEventListener("animationend", () => img.remove());
};

window.events.on((values) => {
	switch (values.type) {
		case "comment": {
			addNewComment(values.text);
			break;
		}
		case "reaction": {
			addReaction(values.src, values.left, values.size);
			break;
		}
	}
});
