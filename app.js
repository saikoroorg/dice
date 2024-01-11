picoLabel("title", "Dice"); // Title.

const dots = [ // Dotted design pixels.
	[0,7,7, 9,3,3],
	[0,7,7, 9,1,5, 9,5,1],
	[0,7,7, 9,3,3, 9,1,5, 9,5,1],
	[0,7,7, 9,1,1, 9,1,5, 9,5,1, 9,5,5],
	[0,7,7, 9,3,3, 9,1,1, 9,1,5, 9,5,1, 9,5,5],
	[0,7,7, 9,1,1, 9,1,3, 9,1,5, 9,5,1, 9,5,3, 9,5,5],
	[0,7,7, 9,3,3, 9,1,1, 9,1,3, 9,1,5, 9,5,1, 9,5,3, 9,5,5],
	[0,7,7, 9,1,1, 9,1,3, 9,3,1, 9,3,5, 9,1,5, 9,5,1, 9,5,3, 9,5,5],
	[0,7,7, 9,3,3, 9,1,1, 9,1,3, 9,3,1, 9,3,5, 9,1,5, 9,5,1, 9,5,3, 9,5,5],
];
const nums = [ // Numbered design pixels.
	[0,7,7, 9,2,1,0,1,0, 9,2,1,0,0,4, 9,4,1,0,0,4, 9,2,5,0,2,0], // 0
	[0,7,7, 9,3,1,0,0,4], // 1
	[0,7,7, 9,2,1,0,2,0, 9,4,1,0,0,2, 9,2,3,0,2,0, 9,2,3,0,0,2, 9,2,5,0,2,0], // 2
	[0,7,7, 9,2,1,0,2,0, 9,4,1,0,0,4, 9,2,3,0,2,0, 9,2,5,0,2,0], // 3
	[0,7,7, 9,2,1,0,0,2, 9,4,1,0,0,4, 9,2,3,0,2,0], // 4
	[0,7,7, 9,2,1,0,2,0, 9,2,1,0,0,2, 9,2,3,0,2,0, 9,4,3,0,0,2, 9,2,5,0,2,0], // 5
	[0,7,7, 9,2,1,0,2,0, 9,2,1,0,0,4, 9,2,3,0,2,0, 9,4,3,0,0,2, 9,2,5,0,2,0], // 6
	[0,7,7, 9,2,1,0,2,0, 9,4,1,0,0,4], // 7
	[0,7,7, 9,2,1,0,2,0, 9,2,1,0,0,4, 9,4,1,0,0,4, 9,2,3,0,2,0, 9,2,5,0,2,0], // 8
	[0,7,7, 9,2,1,0,2,0, 9,2,1,0,0,2, 9,4,1,0,0,4, 9,2,3,0,2,0, 9,2,5,0,2,0], // 9
	[0,7,7, 9,1,1,0,0,4, 9,3,1,0,1,0, 9,3,1,0,0,4, 9,5,1,0,0,4, 9,3,5,0,2,0], // 10
	[0,7,7, 9,1,1,0,0,4, 9,5,1,0,0,4], // 11
	[0,7,7, 9,1,1,0,0,4, 9,3,1,0,2,0, 9,5,1,0,0,2, 9,3,3,0,2,0, 9,3,3,0,0,2, 9,3,5,0,2,0], // 12
	[0,7,7, 9,1,1,0,0,4, 9,3,1,0,2,0, 9,5,1,0,0,4, 9,3,3,0,2,0, 9,3,5,0,2,0], // 13
	[0,7,7, 9,1,1,0,0,4, 9,3,1,0,0,2, 9,5,1,0,0,4, 9,3,3,0,2,0], // 14
	[0,7,7, 9,1,1,0,0,4, 9,3,1,0,2,0, 9,3,1,0,0,2, 9,3,3,0,2,0, 9,5,3,0,0,2, 9,3,5,0,2,0], // 15
	[0,7,7, 9,1,1,0,0,4, 9,3,1,0,2,0, 9,3,1,0,0,4, 9,3,3,0,2,0, 9,5,3,0,0,2, 9,3,5,0,2,0], // 16
	[0,7,7, 9,1,1,0,0,4, 9,3,1,0,2,0, 9,5,1,0,0,4], // 17
	[0,7,7, 9,1,1,0,0,4, 9,3,1,0,2,0, 9,3,1,0,0,4, 9,5,1,0,0,4, 9,3,3,0,2,0, 9,3,5,0,2,0], // 18
	[0,7,7, 9,1,1,0,0,4, 9,3,1,0,2,0, 9,3,1,0,0,2, 9,5,1,0,0,4, 9,3,3,0,2,0, 9,3,5,0,2,0], // 19
	[0,7,7, 9,0,1,0,2,0, 9,2,1,0,0,2, 9,0,3,0,2,0, 9,0,3,0,0,2, 9,0,5,0,2,0, 9,4,1,0,1,0, 9,4,1,0,0,4, 9,6,1,0,0,4, 9,4,5,0,2,0], // 20
];
var colors = [255,255,255, 0,0,0]; // Original design colors.
var pixels = []; // Original design pixels.
var count = 1; // Count of dice.
const maxcount = 20; // Maximum count of dice
var maximum = 6; // Maximum of dice faces.
var maxmaximum = 20; // Maximum of numbered dice.
var custom = false; // Custom flag.
var rolling = 0; // Rolling count.
var holding = 0; // Holding count.
var result = 0; // Result.

// Update buttons.
async function appUpdate() {
	if (custom) {
		picoLabel("action", "*");
		//picoLabel("minus", maximum > 1 ? "<" : " ");
		//picoLabel("plus", maximum < maxmaximum ? ">" : " ");
	} else if (count > 0 && result > 0) {
		picoLabel("action", "^");
	} else {
		picoLabel("action");
	}
	//picoLabel("minus", count > 1 ? "-" : " ");
	//picoLabel("plus", count < maxcount ? "+" : " ");
	if (pixels.length > 0) {
		let data = await picoSpriteData(pixels[maximum - 1], colors);
		picoLabel("select", null, data);
	} else if (maximum <= 9) {
		let data = await picoSpriteData(dots[maximum - 1], colors);
		picoLabel("select", null, data);
	} else if (maximum <= maxmaximum) {
		let data = await picoSpriteData(nums[maximum], colors);
		picoLabel("select", null, data);
	} else {
		picoLabel("select", "?");
	}
}

// Action button.
async function appAction() {
	picoResetParams();
	if (custom) {

		// Enter to edit mode with custom design.
		if (pixels.length > 0) {
			let key = 0;
			for (; key < pixels.length; key++) {
				if (pixels[key].length > 0) {
					picoSetCode6(pixels[key], key);
				}
			}
			picoSetCode8(colors, key);

		// Enter to edit mode with dotted dice.
		} else if (maximum <= 9) {
			for (let i = 0; i < maximum; i++) {
				picoSetCode6(dots[i], i);
			}

		// Enter to edit mode with numbered dice.
		} else if (maximum <= maxmaximum) {
			for (let i = 0; i < maximum; i++) {
				picoSetCode6(nums[i], i);
			}
		}

		// Enter to edit mode.
		return -1; // Return -1 to edit.

	// Start sharing.
	} else if (result > 0) {
		picoSetStrings("" + count + "d" + maximum + "@" + result, 0);
		let key = 0;
		for (; key < pixels.length; key++) {
			if (pixels[key].length > 0) {
				picoSetCode6(pixels[key], key + 1);
			}
		}
		picoSetCode8(colors, key + 1);

		// Start sharing.
		return 1; // Return 1 to share.
	}

	return 0; // Do nothing.
}

// Select button.
async function appSelect(x) {
	if (x) {

		// Change Maximum of dice faces.
		/*if (custom) {
			if ((x > 0 && maximum + x <= maxmaximum) || (x < 0 && maximum + x > 0)) {
				maximum = maximum + x;
				result = 0;
				picoBeep(1.2, 0.1);
			} else {
				picoBeep(-1.2, 0.1);
			}
			appUpdate();

		// Change count of dice.
		} else {*/
			if ((x > 0 && count + x <= maxcount) || (x < 0 && count + x > 0)) {
				count = count + x;
				rolling = -1; // Reroll.
				result = 0;
				picoBeep(1.2, 0.1);
			} else {
				picoBeep(-1.2, 0.1);
			}
			appUpdate();
		//}

	// Do nothing on customize dice.
	} else if (pixels.length > 0) {
		custom = true;
		picoBeep(-1.2, 0.1);
		appUpdate();

	// Change maximum of dice faces.
	} else {
		custom = true;
		maximum = maximum < 8 ? 8 : maximum < 10 ? 10 : 6;
		rolling = -1; // Reroll.
		result = 0;
		picoBeep(1.2, 0.1);
		appUpdate();
	}

	return 0; // Do nothing.
}

// Main.
async function appMain() {
	//var count = 1; // Count of dice.
	//var maximum = 6; // Maximum of dice faces.
	//var rolling = 0; // Rolling count.
	//var holding = 0; // Holding count.

	// Load query params.
	let keys = picoKeys();
	for (let k = 0; k < keys.length; k++) {
		console.log("Param" + k + ": " + keys[k] + " -> " + picoStrings(keys[k]));
		let value = picoStrings(keys[k]);

		// Load colors.
		if ((value[0] == "0" && value[1] == "0" && value[2] == "0") ||
			(value[0] == "1" && value[1] == "1" && value[2] == "1")) {
			colors = picoCode8(keys[k]);

		// Load pixels.
		} else if (value[0] == "0" && value[1] != "0" && value[2] != "0") {
			if (value.length >= 6) {
				pixels[pixels.length] = picoCode6(keys[k]);
				maxmaximum = maximum = pixels.length;
				custom = true;
			}

		// Load initial params.
		} else {
			let numbers = picoNumbers(keys[k]);
			count = numbers[0] < 1 ? 1 : numbers[0] < maxcount ? numbers[0] : maxcount;
			if (numbers[1] == 6 || numbers[1] == 10) {
				maximum = numbers[1] < maxmaximum ? numbers[1] : maxmaximum;
			} else {
				maximum = numbers[1] < maxmaximum ? numbers[1] : maxmaximum;
			}
			picoRandom(0, numbers[2]);
		}
	}

	// Initialize buttons.
	appUpdate();

	// Main loop.
	var number = 0; // Rolled number.
	while (true) {

		// Sprite lines and rows.
		const colMax = 5;//picoSqrt(count - 1) + 1;
		let row = picoDiv(count - 1, colMax) + 1; // Row count.
		let col = picoDiv(count - 1, row) + 1; // Column count.
		let colMod = picoMod(count - 1, col) + 1; // Extra column count.

		const size = 200;
		let posx = [], posy = [];
		for (let i = 0; i < count; i++) {
			let x = picoMod(i, col) + 1, y = picoDiv(i, col) + 1;
			if (y < row) {
				posx[i] = (x / (col + 1) - 0.5) * size;
				posy[i] = (y / (row + 1) - 0.5) * size;
			} else {
				posx[i] = (x / (colMod + 1) - 0.5) * size;
				posy[i] = (y / (row + 1) - 0.5) * size;
			}
			//console.log("" + x + "," + y + " -> " + posx[i] + "," + posy[i]);
		}

		// Sprite scale.
		let c0 = count < 1 ? 1 : count < col ? count : row >= col ? row : col;
		let scale = 20 / (c0 + 1);

		// Rolling dice.
		let angle = 0;
		let randoms = [];
		result = 0;
		for (rolling = 1; rolling >= 1; rolling++) {

			if (!custom) {
				if (result > 0) {

					// Restart to roll dice.
					if (picoMotion()) {
						result = 0;
						rolling = -1;
						holding = 0;
						appUpdate();
					}

				} else {

					// Hold to rolling dice.
					if (picoMotion()) {
						rolling = 1;
						//holding++;

						// Holding to enter custom mode.
						/*if (holding > 60) {
							custom = true;
							rolling = -1;
							appUpdate();
						}*/

					// Timeout and show result.
					} else if (rolling > 60) {
						result = picoSeed(); // Set result seed.
						for (let i = 0; i < count; i++) {
							randoms[i] = picoRandom(maximum);
						}
						angle = 0;
						rolling = 1;
						number++;
						appUpdate();

						// Number matched beeps on show result.
						const kcents = [-1.0,
							-0.9,-0.7,-0.5, -0.4,-0.2, 0.0, 0.2, // 1:Do,2:Re,3:Mi, 4:Fa,5:So,6:La,7:Ti
							 0.3, 0.5, 0.7,  0.8, 1.0, 1.2, 1.4,
							 1.5, 1.7, 1.9,  2.0, 2.2];
						const timing = count <= 2 ? 0.2 : 0.5/count;
						for (let i = 0; i < count; i++) {
							let k = randoms[i] < 10 ? randoms[i] : randoms[i] - 10;
							let j = k >= 0 && k < kcents.length ? k : 0;
							picoBeep(kcents[j], timing/2, timing * i);
						}

					// Continue rolling.
					} else {
						//holding = 0;						
					}
				}

				// Update angle.
				if (result <= 0) {
					angle = picoMod(angle + 20, 360);
					for (let i = 0; i < count; i++) {
						randoms[i] = picoMod(picoTime(), maximum);
					}
				}
			}

			// Clear screen.
			picoClear();

			// Draw customizing dice.
			if (custom) {

				// Draw maximum count.
				let x0 = 0, y0 = 50, c0 = -1, s0 = 2;
				/*if (!holding) { // Ignore after holding.
					if (picoAction(x0-30, y0, 30, 20)) {
						maximum = maximum - 1 >= 1 ? maximum - 1 : 1;
						appUpdate();
					} else if (picoMotion(x0-30, y0, 30, 20)) {
						s0 = 1.2;
						picoChar("-", -1, x0-44, y0, 0, s0);
					} else if (picoAction(x0+30, y0, 30, 20)) {
						maximum = maximum + 1 <= maxmaximum ? maximum + 1 : maxmaximum;
						appUpdate();
					} else if (picoMotion(x0+30, y0, 30, 20)) {
						s0 = 1.2;
						picoChar("+", -1, x0+44, y0, 0, s0);
					}
				}*/
				//picoChar(maximum + "/" + maxmaximum, c0, x0, y0, 0, s0);
				picoChar("*" + count, c0, x0, y0, 0, s0);

				// Draw icon.
				let x1 = 0, y1 = 0, s1 = 10, w1 = 32;
				if (!holding) { // Ignore after holding.
					if (picoAction(x1, y1, w1, w1)) {
						custom = 0;
						rolling = -1;
						picoBeep(1.2, 0.1);
						appUpdate();
					} else if (picoMotion(x1, y1, w1, w1)) {
						s1 = 8;
					}
				}
				if (pixels.length > 0) {
					picoColor(colors);
					s1 = s1 * 7 / picoSpriteSize(pixels[maximum - 1]);
					picoSprite(pixels[maximum - 1], 0, x1, y1, 0, s1);
				} else if (maximum <= 9) {
					picoSprite(dots[maximum - 1], 0, x1, y1, 0, s1);
				} else if (maximum <= maxmaximum) {
					picoSprite(nums[maximum], 0, x1, y1, 0, s1);
				}

				// Ignore action after holding.
				if (holding && picoAction()) {
					holding = 0;
				}

			// Draw rolling dice.
			} else {

				// Draw number sprite.
				let n = result <= 0 ? number : number - 1;
				picoChar(n, 0, 0, -80);

				let s = rolling < 5 ? scale * (0.8 + 0.04 * rolling) : scale;

				// Draw original design sprite.
				if (pixels.length > 0) {
					picoColor(colors);
					for (let i = 0; i < count; i++) {
						let s1 = s * 7 / picoSpriteSize(pixels[randoms[i]]);
						picoSprite(pixels[randoms[i]], 0, posx[i], posy[i], angle, s1);
					}

				// Draw dotted design sprite.
				} else if (maximum <= 9) {
					picoColor(colors);
					for (let i = 0; i < count; i++) {
						picoSprite(dots[randoms[i]], 0, posx[i], posy[i], angle, s);
					}

				// Draw numbered design sprite.
				} else if (maximum <= maxmaximum) {
					picoColor(colors);
					for (let i = 0; i < count; i++) {
						picoSprite(nums[randoms[i]], 0, posx[i], posy[i], angle, s);
					}
				}
			}

			await picoFlip();
			await picoRead(result > 0 && rolling >= 5 ? -1 : 0);
		} // End of playing loop.
	} // End of main loop.
};
