const comments = [];

const lastCommentAt = [];

const addNewComment = async (text) => {
	await new Promise((resolve) => requestAnimationFrame(resolve));

	const canvas = document.getElementById("canvas");
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

window.events.on((values) => {
	switch (values.type) {
		case "comment": {
			addNewComment(values.text);
		}
	}
});
