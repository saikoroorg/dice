picoTitle("Dice"); // Title.

// Data and settings.
const editjs = "app/edit.js"; // Editor script.
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
const kcents = [-1.0,
	-0.9,-0.7,-0.5, -0.4,-0.2, 0.0, 0.2, // 1:Do,2:Re,3:Mi, 4:Fa,5:So,6:La,7:Ti
	 0.3, 0.5, 0.7,  0.8, 1.0, 1.2, 1.4,
	 1.5, 1.7, 1.9,  2.0, 2.2];
var subcolors = [255,255,255, 223,223,223, 191,191,191, 127,127,127, 63,63,63, 0,0,0]; // Count colors.

// Global variables.
var colors = [255,255,255, 0,0,0]; // Original design colors.
var pixels = []; // Original design pixels.
var count = 1; // Count of dice.
const maxcount = 20; // Maximum count of dice
var maximum = 6; // Maximum of dice faces.
var maxmaximum = 20; // Maximum of numbered dice.
var custom = false; // Custom flag.
var playing = 0; // Rolling count.
var seed = 0; // Random seed.
var result = 0; // Result.

// Update buttons.
async function appUpdate() {
	if (custom) {
		picoLabel("action", "*");
	} else if (count > 0 && result > 0) {
		picoLabel("action", "^");
	} else {
		picoLabel("action");
	}
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
	picoLabel("minus", "-");
	picoLabel("plus", "+");
}

// Action button.
async function appAction() {

	// Enter to edit mode.
	if (custom) {
		picoResetParams();

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
		await picoSwitch(editjs); // Open editor.

	// Share screen.
	} else if (result > 0) {
		await picoShareScreen();
	}
}

// Select button.
async function appSelect(x) {
	if (x) {

		// Change count of dice.
		if ((x > 0 && count + x <= maxcount) || (x < 0 && count + x > 0)) {
			count = count + x;
			playing = -1; // Reroll.
			result = 0;
			picoBeep(1.2, 0.1);
		} else {
			picoBeep(-1.2, 0.1);
		}
		appUpdate();

	// Do nothing on customize dice.
	} else if (pixels.length > 0) {
		custom = true;
		picoBeep(-1.2, 0.1);
		appUpdate();

	// Change maximum of dice faces.
	} else {
		custom = true;
		maximum = maximum < 8 ? 8 : maximum < 10 ? 10 : 6;
		playing = -1; // Reroll.
		result = 0;
		picoBeep(1.2, 0.1);
		appUpdate();
	}
}

// Load.
async function appLoad() {
	//var count = 1; // Count of dice.
	//var maximum = 6; // Maximum of dice faces.
	//var playing = 0; // Rolling count.

	// Load query params.
	let keys = picoKeys();
	for (let k = 0; k < keys.length; k++) {
		let value = picoStrings(k);
		if (value) {
			console.log("Param" + k + ": " + keys[k] + " -> " + picoStrings(k));

			// Load colors.
			if ((value[0] == "0" && value[1] == "0" && value[2] == "0") ||
				(value[0] == "1" && value[1] == "1" && value[2] == "1")) {
				colors = picoCode8(keys[k]);

			// Load pixels.
			} else if (value[0] == "0" && value[1] != "0" && value[2] != "0" && value.length >= 6) {
				pixels[pixels.length] = picoCode6(keys[k]);
				maxmaximum = maximum = pixels.length;
				custom = true;

			// Load initial params.
			} else {
				let numbers = picoNumbers(keys[k]);
				count = numbers[0] < 1 ? 1 : numbers[0] < maxcount ? numbers[0] : maxcount;
				if (numbers[1] == 6 || numbers[1] == 10) {
					maximum = numbers[1] < maxmaximum ? numbers[1] : maxmaximum;
				} else {
					maximum = numbers[1] < maxmaximum ? numbers[1] : maxmaximum;
				}
				seed = numbers[2];
				picoRandom(0, seed);
			}
		}
	}

	// Initialize buttons.
	appUpdate();
}

var posx = [], posy = []; // Rolling position.
var angle = 0; // Rolling angle.
var scale = 0; // Rolling scale.
var randoms = []; // Result number.
var landscape = false; // landscape mode.

// Resize.
async function appResize() {
	landscape = picoWidescreen();

	// Set sprite positions and scale for landscape mode.
	if (landscape) {

		// Parameters for landscape mode.
		const width = 180, height = 90, colMax = 8;

		// Set sprite positions for landscape mode.
		let row = picoDiv(count - 1, colMax) + 1; // Row count.
		let col = picoDiv(count - 1, row) + 1; // Column count.
		let colMod = picoMod(count - 1, col) + 1; // Extra column count.
		for (let i = 0; i < count; i++) {
			let x = picoMod(i, col) + 1, y = picoDiv(i, col) + 1;
			if (y < row) {
				posx[i] = (x / (col + 1) - 0.5) * width;
				posy[i] = (y / (row + 1) - 0.5) * height;
			} else {
				posx[i] = (x / (colMod + 1) - 0.5) * width;
				posy[i] = (y / (row + 1) - 0.5) * height;
			}
		}

		// Set sprite scale for landscape mode.
		let c = count < col ? count : col;
		scale = 18 / (c + 1);

	// Set sprite positions and scale for portrait mode.
	} else {

		// Parameters for portrait mode.
		const width = 150, height = 150, rowMax = 5;

		// Set sprite positions for portrait mode.
		let col = picoDiv(count - 1, rowMax) + 1; // Column count.
		let row = picoDiv(count - 1, col) + 1; // Row count.
		let rowMod = picoMod(count - 1, row) + 1; // Extra row count.
		for (let i = 0; i < count; i++) {
			let y = picoMod(i, row) + 1, x = picoDiv(i, row) + 1;
			if (x < col) {
				posx[i] = (x / (col + 1) - 0.5) * width;
				posy[i] = (y / (row + 1) - 0.5) * height;
			} else {
				posx[i] = (x / (col + 1) - 0.5) * width;
				posy[i] = (y / (rowMod + 1) - 0.5) * height;
			}
		}

		// Set sprite scale for portrait mode.
		let c = count < row ? count : row;
		scale = 18 / (c + 1);
	}

	picoFlush();
}

// Main.
async function appMain() {

	// Initialize.
	if (playing <= 0) {
		appResize();

		// Rolling dice.
		seed = picoDate();
		picoRandom(0, seed);
		result = 0;

		// Reset playing count.
		playing = 1;
	}

	// Update rolling dice.
	if (!custom) {
		if (result > 0) {

			// Restart to roll dice.
			if (picoMotion()) {
				seed = picoDate();
				picoRandom(0, seed);
				result = 0;

				// Reset playing count.
				playing = -1;
				//appUpdate();
			}

		} else {

			// Hold to playing dice.
			if (picoMotion()) {
				playing = 1;

			// Timeout and show result.
			} else if (playing > 60) {
				for (let i = 0; i < count; i++) {
					randoms[i] = picoRandom(maximum);
					result += randoms[i] + 1;
				}
				angle = 0;
				playing = 1;
				appUpdate();

				// Number matched beeps on show result.
				let timing = count <= 2 ? 0.2 : 0.5/count;
				for (let i = 0; i < count; i++) {
					let k = randoms[i] < 10 ? randoms[i] : randoms[i] - 10;
					let j = k >= 0 && k < kcents.length ? k : 0;
					picoBeep(kcents[j], timing/2, timing * i);
				}
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
		picoColor(subcolors);
		picoChar("*" + count, c0, x0, y0, 0, s0);

		// Draw icon.
		let x1 = 0, y1 = 0, s1 = 10, w1 = 32;
		if (picoAction(x1, y1, w1, w1)) {
			custom = 0;
			playing = -1;
			picoBeep(1.2, 0.1);
			appUpdate();
		} else if (picoMotion(x1, y1, w1, w1)) {
			s1 = 8;
		}

		// Draw original design sprite.
		picoColor(colors);
		if (pixels.length > 0) {
			s1 = s1 * 7 / picoSpriteSize(pixels[maximum - 1]);
			picoSprite(pixels[maximum - 1], 0, x1, y1, 0, s1);

		// Draw dotted design sprite.	
		} else if (maximum <= 9) {
			picoSprite(dots[maximum - 1], 0, x1, y1, 0, s1);
		} else if (maximum <= maxmaximum) {
			picoSprite(nums[maximum], 0, x1, y1, 0, s1);
		}

	// Draw rolling dice.
	} else {

		// Draw seed count.
		if (result > 0) {
			picoColor(subcolors);
			picoChar(result, -1, 0,landscape?-50:-85, 0,2);
			picoChar(seed, 2, 0,landscape?-40:-75, 0,1);
		}

		// Set color for sprite.
		picoColor(colors);

		// Scale for sprite.
		let s = playing < 5 ? scale * (0.8 + 0.04 * playing) : scale;

		// Draw original design sprite.
		if (pixels.length > 0) {
			for (let i = 0; i < count; i++) {
				let s1 = s * 7 / picoSpriteSize(pixels[randoms[i]]);
				picoSprite(pixels[randoms[i]], 0, posx[i], posy[i], angle, s1);
			}

		// Draw dotted design sprite.
		} else if (maximum <= 9) {
			for (let i = 0; i < count; i++) {
				picoSprite(dots[randoms[i]], 0, posx[i], posy[i], angle, s);
			}

		// Draw numbered design sprite.
		} else if (maximum <= maxmaximum) {
			for (let i = 0; i < count; i++) {
				picoSprite(nums[randoms[i]], 0, posx[i], posy[i], angle, s);
			}
		}
	}

	// Update animation if rolling.
	if (result == 0 || playing < 5) {
		picoFlush();
	}

	// Increment playing count.
	playing++;
};
