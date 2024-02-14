picoTitle("Pico", "Edit"); // Title.

// Data and settings.
var colors = [255,255,255, 159,255,247, 255,223,175, 191,191,191, 0,119,239, 231,0,95, 0,151,63, 143,0,119, 167,0,0, 0,63,23]; // Colors.

// Global variables.
var maxwidth = 20, maxheight = 20; // Canvas max size.
var width = 7, height = 7; // Canvas size.
var xoffset = picoDiv(maxwidth - width, 2); // Pixels x-index offset.
var yoffset = picoDiv(maxheight - height, 2); // Pixels y-index offset.
const maxanime = 20; // Buffer max size.
var anime = 1; // Buffer count.
var frame = 0; // Anime frame index.
var buffers = []; // Pixels buffers.
var animeflag = 0; // Anime editing flag.
var playing = 0; // Playing count.
var pixels = []; // Canvas pixels.
var depth = 10; // Color count.
const maxcolor = 10; // Color max size.
var colorflag = 0; // Color editing flag.

// Update icon image.
async function appUpdate(force = true) {

	// Update buffer.
	if (force || buffers[frame]) {
		console.log("Update" + frame + ": " + buffers[frame]);

		// Store canvas pixels to buffers.
		buffers[frame] = [0, width, height];
		for (let j = yoffset; j < yoffset + height; j++) {
			for (let i = xoffset; i < xoffset + width; i++) {
				if (pixels[j][i]) {
					let k = buffers[frame].length;
					buffers[frame][k] = pixels[j][i];
					buffers[frame][k+1] = i - xoffset;
					buffers[frame][k+2] = j - yoffset;
				}
			}
		}
		if (buffers[frame].length <= 3) {
			buffers[frame] = null;
		}
	}

	// Update icon image.
	if (buffers[frame]) {
		let data = await picoSpriteData(buffers[frame], colors);
		picoLabel("action", null, data);
	} else {
		picoLabel("action", "^");
	}

	// Update select button.
	if (animeflag) {
		picoLabel("select", "" + anime);
	} else {
		picoLabel("select", "x" + width);
	}
	picoLabel("minus", "-");
	picoLabel("plus", "+");
}

// Action button.
async function appAction() {
	picoResetParams();

	// Create num code to share url.
	let k = 0;
	for (let p = 0; p < anime; p++) {
		if (buffers[p]) {
			picoSetCode6(buffers[p], k);
			k++;
		}
	}
	if (k == 0) {
		picoSetCode6([0,7,7], k);
		k++
	}
	if (((colors[0] == 255 && colors[1] == 255 && colors[2] == 255) ||
		(colors[0] == 0 && colors[1] == 0 && colors[2] == 0))) {
		picoSetCode8(colors, k);
	}

	picoSwitch(); // Share or back.
}

// Select button.
function appSelect(x) {

	// Change menu mode.
	if (x == 0) {
		animeflag = animeflag ? 0 : 1;
	//	colorflag = 0;
		appUpdate(false);

	// Change color depth.
	//} else if (colorflag) {
	//	depth = depth + x < 1 ? 1 : depth + x >= maxcolor ? maxcolor : depth + x;

	// Change canvas frame.
	} else if (animeflag) {
		anime = anime + x < 1 ? 1 : anime + x >= maxanime ? maxanime : anime + x;
		appUpdate();

		// Remove reduced frame after update icons.
		if (frame > anime - 1) {
			frame = anime - 1;
			playing = -1; // Restart.
		}

	// Change canvas size.
	} else {
		width = width + x < 3 ? 3 : width + x > maxwidth ? maxwidth : width + x;
		height = height + x < 3 ? 3 : height + x > maxheight ? maxheight : height + x;
		xoffset = picoDiv(maxwidth - width, 2);
		yoffset = picoDiv(maxheight - height, 2);
		//console.log("Size: " + width + "x" + height + " + " + xoffset + "," + yoffset);
		//playing = -1; // Restart.
		appUpdate(false);
	}

	picoBeep(1.2, 0.1);	
	picoFlush();
}

// Touching flags and states.
var bgindex = 0; // Background color index.
var pixeltouching = 0; // -1:invalid, 0:untouched, 1:touching.
var colortouching = 0; // -1:invalid, 0:untouched, 1:touching.
var colorholding = 0; // 0:untouched, 1+:touching.
var colorselecting = depth - 1; // Touching color index.
//var colorselected = -1; // Previous touched color index.
var frametouching = 0; // -1:invalid, 0:untouched, 1:touching.
var frameselecting = -1; // Selecting frame index.

// Load.
async function appLoad() {

	// Initialize pixels on max size.
	for (let j = 0; j < maxheight; j++) {
		pixels[j] = [];
		for (let i = 0; i < maxwidth; i++) {
			pixels[j][i] = 0;
		}
	}

	// Load query params.
	let keys = picoKeys(), framecount = 0;
	for (let k = 0; k < keys.length; k++) {
		let value = picoStrings(k);
		if (value) {
			console.log("Param" + k + ": " + keys[k] + " -> " + picoStrings(k));

			// Load colors.
			if ((value[0] == "0" && value[1] == "0" && value[2] == "0") ||
				(value[0] == "1" && value[1] == "1" && value[2] == "1")) {
				colors = picoCode8(keys[k]);
				colors.length = colors.length < maxcolor * 3 ? colors.length : maxcolor * 3;
				depth = colors.length / 3;
				colorselecting = depth - 1;
				console.log("Load color: " + colors);

			// Load pixels.
			} else if (value[0] == "0" && value[1] != "0" && value[2] != "0" && value.length >= 6) {
				buffers[framecount] = picoCode6(keys[k]);
				frame = framecount;
				anime = framecount + 1;
				if (anime >= 2) {
					animeflag = 1;
				}
				console.log("Load buffer" + keys[k] + ": " + buffers[framecount]);
				framecount++;
			}
		}
	}
}

// Main.
async function appMain() {

	// Initialize.
	if (playing <= 0) {

		// Load pixels to canvas.
		if (frameselecting != frame) {
			frameselecting = frame;
			if (frameselecting >= 0 && buffers[frame]) {
				for (let j = 0; j < maxheight; j++) {
					pixels[j] = [];
				}
				if (buffers[frame][0] == 0) {
					width = buffers[frame][0 + 1] >= 0 && buffers[frame][0 + 1] <= maxwidth ? buffers[frame][0 + 1] : 7;
					height = buffers[frame][0 + 2] >= 0 && buffers[frame][0 + 2] <= maxheight ? buffers[frame][0 + 2] : 7;
					xoffset = picoDiv(maxwidth - width, 2);
					yoffset = picoDiv(maxheight - height, 2);
				}
				for (let n = 3; n < buffers[frame].length; n += 3) {
					if (buffers[frame][n + 3] == 0) {
						let imax = buffers[frame][n + 1] + buffers[frame][n + 4] + xoffset;
						let jmax = buffers[frame][n + 2] + buffers[frame][n + 5] + yoffset;
						//console.log("Put pixel: " + "->" + imax + "," + jmax);
						for (let i = buffers[frame][n + 1] + xoffset; i <= imax; i++) {
							for (let j = buffers[frame][n + 2] + yoffset; j <= jmax; j++) {
								//console.log("Put pixel: " + i + "," + j);
								if (i >= xoffset && i < xoffset + width && j >= yoffset && j < yoffset + height) {
									pixels[j][i] = buffers[frame][n];
								}
							}
						}
						n += 3;
					} else {
						let i = buffers[frame][n + 1] + xoffset;
						let j = buffers[frame][n + 2] + yoffset;
						if (i >= xoffset && i < xoffset + width && j >= yoffset && j < yoffset + height) {
							pixels[j][i] = buffers[frame][n];
						}
					}
				}
			} else {
				for (let j = 0; j < maxheight; j++) {
					pixels[j] = [];
					for (let i = 0; i < maxwidth; i++) {
						pixels[j][i] = 0;
					}
				}
			}
			console.log("Load pixel: " + pixels);
		}
		appUpdate();

		// Reset playing count.
		playing = 1;
	}

	// Set touching state to avoid touching another area continuously.
	if (picoAction()) {
		console.log("Reset touching state.");
		pixeltouching = 0;
		colortouching = 0;
		frametouching = 0;
		appUpdate();
	}

	// Positions.
	let pixelswidth = 168; // Size of pixels.
	let pixelsposx = !animeflag ? 0 : 14; // Position x of pixels.
	let pixelsposy = -14; // Position y of pixels.
	let colorsposx = 0; // Position x of colors/coloreditor.
	let colorsposy = pico.Image.height/2 - 16; // Position y of colors/coloreditor.
	let fgcolorsposx = 0; // Position x of bgcolors/coloreditor.
	let bgcolorsposx = -pico.Image.width/2 + 28; // Position x of bgcolors/coloreditor.
	let framesposx = -pico.Image.width/2 + 14; // Offset of buffer.

	// Draw background.
	picoColor();
	picoRect(1, 0, pixelsposy, pixelswidth, pixelswidth);

	// Touching background.
	{
		let w0 = 165, h0 = 25; // Foreground color selector width and height.
		let w1 = 12, h1 = 12; // Background color selector width and height.
		let w2 = 10, h2 = 10; // Background color selector width and height for touching.

		// Release touching background.
		if (colortouching >= 0 && picoAction(bgcolorsposx, colorsposy, w1, h1)) {
			console.log("Release touching background.");
			colortouching = 0;

			// Double touched background.
			/*if (colorselected == 0) {
				console.log("Double touched background.");
				colorselected = -1;

				// Change background color.
				//let c = colors[0];
				//colors[0] = colors[1] = colors[2] = c > 0 ? 0 : 255;
				//bgindex = colors[0] != 0 ? 0 : -1;
				//picoBeep(1.2, 0.1);

			// Single touched background.
			} else if (colorselected == -1) {
				console.log("Single touched background.");*/

				if (colorflag <= 0) {
					//colorselected = colorselecting;
					picoBeep(0, 0.1);

				// Back to pixel mode.
				} else {
					console.log("Back to pixel mode.");
					colorflag = 0;
					colorselected = -1;
					picoFlush(); // Update after action event.
					picoBeep(1.2, 0.1);
				}

			// Touched background after hovering.
			/*} else {
				console.log("Touched color after hovering:" + colorselected);
				colorselected = -1;
				picoBeep(0, 0.1);
			}*/

			// Touching.
			w1 = w2, h1 = h2;

		// Touching background.
		} else if (colortouching >= 0 && picoMotion(bgcolorsposx, colorsposy, w1, h1)) {
			frametouching = -1;
			pixeltouching = -1;
			colortouching = 1;

			if (colorflag <= 0) {
				// Start to touching background.
				if (colortouching == 0) {
					console.log("Touching background.");
					colorselecting = 0;
					colorholding = 0;

				// Hovering from another color.
				} else if (colorselecting != 0) {
					console.log("Touching another background.");
					colorselecting = 0;
					colorholding = 0;
					//colorselected = -2;

				// Continue touching background.
				} else {
					console.log("Continue touching background.");//:" + colorselected);
					colorholding++;

					// Change background color.
					if (colorholding >= 30) {
						console.log("Change background color.");
						let c = colors[0];
						colors[0] = colors[1] = colors[2] = c > 0 ? 0 : 255;
						bgindex = colors[0] != 0 ? 0 : -1;
						picoBeep(1.2, 0.1);
						colortouching = -1;
						colorholding = 0;
					}
				}
			}

			// Touching.
			w1 = w2, h1 = h2;
		}

		// Draw foreground color selector.
		picoRect(bgindex ? 3 : 1, colorsposx, colorsposy, w0, h0);

		// Set colors data.
		picoColor(colors);

		// Draw background color selector.
		picoRect(colorselecting, bgcolorsposx, colorsposy, w1, h1);
	}

	// Draw pixels.
	{
		let size = width < height ? width : height;
		let grid = pixelswidth / size;
		let margin = size <= 9 ? 2 : 1;
		let w1 = (grid - margin) - 1; // Width.
		let w2 = grid - 1; // Width for touching.
		for (let j = yoffset; j < yoffset + height; j++) {
			let y = (j - yoffset - (height - 1) / 2) * grid + pixelsposy;
			for (let i = xoffset; i < xoffset + width; i++) {
				let x = (i - xoffset - (width - 1) / 2) * grid + pixelsposx;
				if (pixeltouching >= 0 && picoMotion(x, y, grid/2)) {
					console.log("Touch pixels.");
					pixeltouching = 1; // Touch pixels.
					frametouching = -1;
					colortouching = -1;

					// Put pixel.
					if (pixels[j][i] != colorselecting) {
						pixels[j][i] = colorselecting;
					}

					// Cancel color editing.
					if (colorflag) {
						console.log("Cancel color editing.");
						colorflag = 0;
						//colorselected = -1;
						picoFlush();
					}
					picoRect(pixels[j][i], x, y, w2, w2);
				} else {
					picoRect(pixels[j][i], x, y, w1, w1);
				}
			}
		}
	}

	// Draw anime editor.
	if (animeflag >= 1) {
		let size = anime > 7 ? anime : 7;
		let grid = pixelswidth / size;
		let margin = size <= 9 ? 2 : 1;
		let w1 = grid - margin - 1; // Width.
		let w2 = grid - 1; // Width for selecting.
		let w3 = grid + margin; // Width for holding.
		let w4 = grid - margin*2; // Width for copyed.
		for (let i = 0; i < anime; i++) {
			let y = pixelsposy + (i - (anime - 1) / 2) * grid;
			let sprite = buffers[i] ? buffers[i] : [0, 7, 7];
			let w0 = grid/2;// * 7 / picoSpriteSize(sprite); // Width for toucharea.

			// Release touching frame.
			if (frametouching >= 0 && picoAction(framesposx, y, w0, w0)) {
				console.log("Release touching frame.");
				frametouching = 0;

				// Paste and release.
				if (frame != i) {
					console.log("Paste and release.");
					if (buffers[frame]) {
						sprite = buffers[frame];
					}
					frameselecting = frame = i;
					appUpdate(); // Paste pixels to buffers.
					picoBeep(1.2, 0.1);
				}

				// Release holding frame.
				picoSprite(sprite, 0, framesposx, y, 0, w2 / picoSpriteSize(sprite)); // Selecting frame.

			// Touching frame.
			} else if (frametouching >= 0 && picoMotion(framesposx, y, w0, w0)) {
				pixeltouching = -1;
				colortouching = -1;

				// Start to touching frame.
				if (frametouching == 0) {
					console.log("Touching frame.");
					frametouching = 1;
					frame = i;
					playing = -1;
					
				// Hovering to another frame.
				} else if (frameselecting != i) {
					console.log("Touching another frame.");
					if (buffers[frame]) {
						sprite = buffers[frame];
					}
				}

				// Cancel color editing.
				if (colorflag) {
					console.log("Cancel color editing.");
					colorflag = 0;
					//colorselected = -1;
				}

				// Touch holding frame.
				picoSprite(sprite, 0, framesposx, y, 0, w3 / picoSpriteSize(sprite)); // Touching frame.

			// Not touching but selecting color.
			} else if (frameselecting == i) {

				// Touch holding frame.
				if (frametouching >= 1) {
					picoSprite(sprite, 0, framesposx, y, 0, w4 / picoSpriteSize(sprite)); // Copyed frame.
				} else if (anime >= 2) {
					picoSprite(sprite, 0, framesposx, y, 0, w2 / picoSpriteSize(sprite)); // Selecting frame.
				} else {
					picoSprite(sprite, 0, framesposx, y, 0, w1 / picoSpriteSize(sprite)); // Only one frame.
				}

			// Other frames.
			} else {
				picoSprite(sprite, 0, framesposx, y, 0, w1 / picoSpriteSize(sprite)); // Unselecting frames.
			}
		}
	}

	// Draw colors.
	if (colorflag <= 0) {
		let grid = 16;

		for (let i = 1; i < depth; i++) {
			let x = fgcolorsposx + (i - (depth - 1) / 2) * grid; // Margins for each color.

			// Release touching color.
			if (colortouching >= 0 && picoAction(x, colorsposy, 8, 12)) {
				console.log("Release touching color.");
				colortouching = 0;

				// Double touched color.
				/*if (colorselected == i) {
					console.log("Double touched color.");
					colorselected = -1;

					// Enter color edit mode.
					//colorflag = 1;
					//picoFlush(); // Update after action event.
					//picoBeep(1.2, 0.1);

				// Single touched color.
				} else if (colorselected == -1) {*/
					console.log("Single touched color.");
					//colorselected = colorselecting;
					picoBeep(0, 0.1);

				// Touched color after hovering.
				/*} else {
					console.log("Touched color after hovering:" + colorselected);
					colorselected = -1;
					picoBeep(0, 0.1);
				}*/
				picoChar("+", i, x, colorsposy, 0, 4);

			// Touching color.
			} else if (colortouching >= 0 && picoMotion(x, colorsposy, 8, 12)) {
				frametouching = -1;
				pixeltouching = -1;

				// Start to touching color.
				/*if (colortouching == 0 && colorselected == colorselecting) {
					console.log("Retouching color.");
					colortouching = 1;
					colorholding = 0;
					colorselecting = i;

				// Start to touching another color.
				} else*/ if (colortouching == 0) {
					console.log("Touching color.");
					colortouching = 1;
					colorholding = 0;
					colorselecting = i;

				// Hovering to another color.
				} else if (colorselecting != i) {
					console.log("Touching another color.");
					colorselecting = i;
					colorholding = 0;
					//colorselected = -2;

				// Continue touching color.
				} else {
					console.log("Continue touching color.");//:" + colorselected);
					colorholding++;

					// Enter color edit mode.
					if (colorholding >= 30) {
						console.log("Enter color edit mode.");//:" + colorselected);
						colorflag = 1;
						picoBeep(1.2, 0.1);
						colortouching = -1;
						colorholding = 0;
					}
				}
				picoChar("+", i, x, colorsposy, 0, 3.5);

			} else {
				let s = 4;

				// Not touching but selecting color.
				if (colorselecting == i) {
					picoChar("+", i, x, colorsposy, 0, s);

				// Other colors.
				} else {
					picoChar("-", i, x, colorsposy, 0, s);
				}
			}
		}

	// Draw color editor.
	} else {
		const compression = 2, maxcompresed = (1 << (8 - compression));
		let grid = 16;

		// Draw buttons and color numbers.
		if (colorselecting > 0) {
			for (let i = 0; i < 3; i++) {
				let c = colors[colorselecting * 3 + i];

				// Decrease color number.
				if (c > 0) {
					let x = fgcolorsposx + (i*3+1 - 9 / 2) * grid; // Margins for each color number.
					let s = 4;
					if (colortouching >= 0 && picoAction(x, colorsposy+6, 8, 6)) {
						c = (c + 1) >> compression; // Bit shift for compressed decrease.
						c = c - 1 > 0 ? c - 1 : 0; // Decrease.
						c = (c << compression) - 1; // Bit unshift.
						c = c > 0 ? c : 0;
					} else if (colortouching >= 0 && picoMotion(x, colorsposy+6, 8, 6)) {
						s = 3.5;
					}

					// Draw decrease button.
					picoChar("_", colorselecting, x, colorsposy, 0, s);
				}

				// Increase color number.
				if (c < 255) {
					let x = fgcolorsposx + (i*3+1 - 9 / 2) * grid; // Margins for each color number.
					let s = 4;
					if (colortouching >= 0 && picoAction(x, colorsposy-6, 8, 6)) {
						c = (c + 1) >> compression; // Bit shift for compressed increase.
						c = c + 1 < maxcompresed ? c + 1 : maxcompresed; // Increase.
						c = (c << compression) - 1; // Bit unshift.
					} else if (colortouching >= 0 && picoMotion(x, colorsposy-6, 8, 6)) {
						s = 3.5;
					}
					colors[colorselecting * 3 + i] = c;

					// Draw increase button.
					picoChar("^", colorselecting, x, colorsposy, 0, s);
				}

				// Convert range 0-255 to 0-100.
				let c99 = picoDiv(colors[colorselecting * 3 + i] * 99, 255);
				let c00 = c99 >= 99 ? "100" : c99 >= 9 ? " " + (c99 + 1) : c99 >= 1 ? " 0" + (c99 + 1) : " 00";

				// Draw color numbers.
				let x = fgcolorsposx + (i*3+2 - 9 / 2) * grid; // Margins for each color number.
				let s = 4;
				picoChar(c00, colorselecting, x, colorsposy, 0, s);
			}
		}
	}

	// Increment playing count.
	playing++;
}
