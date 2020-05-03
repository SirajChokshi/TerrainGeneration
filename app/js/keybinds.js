document.addEventListener('keydown', (e) => {
	switch (e.key) {
		case "w":
			move([0,-2])
		case "s":
			move([0,2])
		case "a":
			move([-2,0])
		case "d":
			move([2,0])
		default:
			break;
}})