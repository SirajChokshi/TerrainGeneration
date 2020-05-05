document.addEventListener('keydown', (e) => {
	if (e.target.tagName != "INPUT") {
		switch (e.key) {
			case "w":
				move([0,-2])
				break;
			case "s":
				move([0,2])
				break;
			case "a":
				move([-2,0])
				break;
			case "d":
				move([2,0])
				break;
			default:
				break;
}}})