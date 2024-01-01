/* PICO Image module */

// Mod.
function picoMod(a, b) {
	if (a >= 0 && b >= 0 || a <= 0 && b <= 0) {
		return Math.floor(a % b);
	} else {
		return Math.ceil(a % b);
	}
}

// Div.
function picoDiv(a, b) {
	if (a >= 0 && b >= 0 || a <= 0 && b <= 0) {
		return Math.floor(a / b);
	} else {
		return Math.ceil(a / b);
	}
}

// Square root.
function picoSqrt(x) {
	return Math.floor(Math.sqrt(x));
}

// Wait and flip image.
async function picoFlip(t=10) {
	try {
		await pico.image.flip(t);
	} catch (error) {
		console.error(error);
	}
}

// Clear image.
async function picoClear() {
	try {
		await pico.image.clear();
	} catch (error) {
		console.error(error);
	}
}

// Set image color pallete.
async function picoColor(palls=[0,0,0]) {
	try {
		pico.image.color(palls);
	} catch (error) {
		console.error(error);
	}
}

// Draw pixel.
async function picoPixel(c=0, x=0, y=0, w=0, h=0) {
	try {
		await pico.image.pixel(c, x, y, w, h);
	} catch (error) {
		console.error(error);
	}
}

// Draw rect.
async function picoRect(rects=[0,0,0,0], c=0, x=0, y=0, angle=0, scale=1) {
	try {
		await pico.image.drawRect(rects, c, x, y, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Draw char as string or number.
async function picoChar(char, c=0, x=0, y=0, angle=0, scale=1) {
	try {
		await pico.image.drawChar("" + char, c, x, y, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Draw multiple lines of text.
async function picoText(text, area=null, c=0, x=0, y=0, angle=0, scale=1) {
	try {
		await pico.image.drawText("" + text, area, c, x, y, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Draw sprite.
async function picoSprite(cells=[0,9,9,1,0,0], c=-1, x=0, y=0, angle=0, scale=1) {
	try {
		await pico.image.drawSprite(cells, c, x, y, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Get sprite size.
function picoSpriteSize(cells=[0,9,9,1,0,0]) {
	try {
		return pico.image._spriteSize(cells);
	} catch (error) {
		console.error(error);
	}
}

// Get sprite data.
async function picoSpriteData(cells=[0,9,9,1,0,0], colors=null, scale=10) {
	try {
		return await pico.image.spriteData(cells, colors, scale);
	} catch (error) {
		console.error(error);
	}
}

// Load image file.
async function picoLoad(url) {
	try {
		return await pico.image.loadImage(url);
	} catch (error) {
		console.error(error);
	}
}

// Draw image data.
async function picoImage(image, x=0, y=0, angle=0, scale=1, frame=0, width=0, height=0) {
	try {
		await pico.image.drawImage(image, x, y, angle, scale, frame, width, height);
	} catch (error) {
		console.error(error);
	}
}

// Get image size.
function picoImageSize(image) {
	try {
		return image._size();
	} catch (error) {
		console.error(error);
	}
}

// Get image file.
function picoImageFile(image) {
	try {
		return image._file();
	} catch (error) {
		console.error(error);
	}
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Image class.
pico.Image = class {
	static debug = false; // Debug print.
	static width = 200; // Image width. (-width/2 .. width/2)
	static height = 200; // Image height. (-height/2 .. height/2)
	static ratio = 4; // Pixel ratio.
	static parent = "picoImage"; // Parent element id.

	static charWidth = 4;
	static charHeight = 6;

	static numberShapes = [
		[-1,-2,1,0, -1,-2,0,4, 1,-2,0,4, -1,2,2,0], // 0
		[0,-2,0,4], // 1
		[-1,-2,2,0, 1,-2,0,2, -1,0,2,0, -1,0,0,2, -1,2,2,0], // 2
		[-1,-2,2,0, 1,-2,0,4, -1,0,2,0, -1,2,2,0], // 3
		[-1,-2,0,2, 1,-2,0,4, -1,0,2,0], // 4
		[-1,-2,2,0, -1,-2,0,2, -1,0,2,0, 1,0,0,2, -1,2,2,0], // 5
		[-1,-2,2,0, -1,-2,0,4, -1,0,2,0, 1,0,0,2, -1,2,2,0], // 6
		[-1,-2,2,0, 1,-2,0,4], // 7
		[-1,-2,2,0, -1,-2,0,4, 1,-2,0,4, -1,0,2,0, -1,2,2,0], // 8
		[-1,-2,2,0, -1,-2,0,2, 1,-2,0,4, -1,0,2,0, -1,2,2,0]]; // 9

	static alphabetShapes = [
		[-1,-2,2,0, -1,-2,0,4, 1,-2,0,4, -1,0,2,0], // A
		[-1,-2,2,0, -1,-2,0,4, 1,-2,0,1, -1,0,1,0, 1,1,0,1, -1,2,2,0], // B
		[-1,-2,2,0, -1,-2,0,4, -1,2,2,0], // C
		[-1,-2,1,0, -1,-2,0,4, 1,-1,0,2, -1,2,1,0], // D
		[-1,-2,2,0, -1,-2,0,4, -1,0,2,0, -1,2,2,0], // E
		[-1,-2,2,0, -1,-2,0,4, -1,0,2,0], // F
		[-1,-2,2,0, -1,-2,0,4, -1,2,2,0, 1,0,0,1], // G
		[-1,-2,0,4, 1,-2,0,4, -1,0,2,0], // H
		[-1,-2,2,0, 0,-2,0,4, -1,2,2,0], // I
		[-1,1,0,1, 1,-2,0,4, -1,2,2,0], // J
		[-1,-2,0,4, -1,0,1,0, 1,-2,0,1, 1,1,0,1], // K
		[-1,-2,0,4, -1,2,2,0], // L
		[-1,-2,0,4, 0,-1,0,1, 1,-2,0,4], // M
		[-1,-2,0,4, -1,-2,2,0, 1,-2,0,4], // N
		[-1,-2,2,1, -1,-1,0,3, 1,-1,0,3, -1,2,2,0], // O
		[-1,-2,2,0, -1,-2,0,4, 1,-2,0,2, -1,0,2,0], // P
		[-1,-2,2,0, -1,-2,0,3, 1,-2,0,2, -1,1,1,0, 1,2,0,0], // Q
		[-1,-2,2,0, -1,-2,0,4, 1,-2,0,1, -1,0,1,0, 1,1,0,1], // R
		[-1,-2,2,0, -1,-2,0,1, 0,0,0,0, 1,1,0,1, -1,2,2,0], // S
		[-1,-2,2,0, 0,-2,0,4], // T
		[-1,-2,0,4, 1,-2,0,4, -1,2,2,0], // U
		[-1,-2,0,3, 1,-2,0,3, 0,2,0,0], // V
		[-1,-2,0,4, 0,0,0,1, 1,-2,0,4], // W
		[-1,-2,0,1, -1,1,0,1, 0,0,0,0, 1,-2,0,1, 1,1,0,1], // X
		[-1,-2,0,1, 0,0,0,2, 1,-2,0,1], // Y
		[-1,-2,2,0, 1,-2,0,1, 0,0,0,0, -1,1,0,1, -1,2,2,0]]; // Z

	static markChars = "./?:-+=<>_^*";
	static markShapes = [
		[0,2,0,0], // .
		[-1,2,0,0, 0,-1,0,2, 1,-2,0,0], // /
		[-1,-2,2,0, 1,-2,0,1, 0,0,0,0, 0,2,0,0], // ?
		[0,-1,0,0, 0,1,0,0], // :
		[-1,0,2,0], // -
		[-1,0,2,0, 0,-1,0,2], // +
		[-1,-1,2,0, -1,1,2,0], // =
		[-1,0,0,0, 0,-1,0,0, 0,1,0,0, 1,-2,0,0, 1,2,0,0], // <
		[-1,-2,0,0, -1,2,0,0, 0,-1,0,0, 0,1,0,0, 1,0,0,0], // >
		[-1,1,0,0, 0,2,0,0, 1,1,0,0], // _
		[-1,-1,0,0, 0,-2,0,0, 1,-1,0,0], // ^
		[-1,-1,0,0, -1,1,0,0, 0,0,0,0, 1,-1,0,0, 1,1,0,0]]; // *

	static colors = [
		 255,255,255, 171,231,255, 199,215,255, 215,203,255, // 30-33
		 255,199,255, 255,199,219, 255,191,179, 255,219,171, // 34-37
		 255,231,163, 227,255,163, 171,243,191, 179,255,207, // 38-3b
		 159,255,243, 188,188,188,   0,  0,  0,   0,  0,  0, // 3c-3f
		 255,255,255,  63,191,255,  95,115,255, 167,139,253, // 20-23
		 247,123,255, 255,119,183, 255,119, 99, 255,155, 59, // 24-27
		 243,191, 63, 131,211, 19,  79,223, 75,  88,248,152, // 28-2b
		   0,235,219, 117,117,117,   0,  0,  0,   0,  0,  0, // 2c-2f
		 188,188,188,   0,115,239,  35, 59,239, 131,  0,243, // 10-13
		 191,  0,191, 231,  0, 91, 219, 43,  0, 203, 79, 15, // 14-17
		 139,115,  0,   0,151,  0,   0,171,  0,   0,147, 59, // 18-1b
		   0,131,139,   0,  0,  0,   0,  0,  0,   0,  0,  0, // 1c-1f
		 117,117,117,  39, 27,143,   0,  0,171,  71,  0,159, // 00-03
		 143,  0,119, 171,  0, 19, 167,  0,  0, 127, 11,  0, // 04-07
		  67, 47,  0,   0, 71,  0,   0, 81,  0,   0, 63, 23, // 08-0b
		  27, 63, 95,   0,  0,  0,   0,  0,  0,   0,  0,  0, // 0c-0f
		]; // Master image color. (8bit original parameter)

	static colors8 = [255,255,255, 159,255,243, 255,219,171, 188,188,188, 0,115,239, 231,0,91, 0,147,59, 143,0,119, 167,0,0, 0,63,23]; // 10 colors from the original 8 bits.
	static colors6 = [255,255,255, 159,255,247, 255,223,175, 191,191,191, 0,119,239, 231,0,95, 0,151,63, 143,0,119, 167,0,0, 0,63,23]; // 10 colors from the 6 bits.
	static colors5 = [255,255,255, 159,255,247, 255,223,175, 191,191,191, 0,119,239, 231,0,95, 0,151,63, 143,0,119, 167,0,0, 0,63,23]; // 10 colors from the 5 bits.
	static colors0 = [255,255,255, 223,223,223, 191,191,191, 127,127,127, 63,63,63, 0,0,0]; // 5 gray scale colors: ffffff dfdfdf bfbfbf 7f7f7f 3f3f3f 000000

	// Wait and flip image.
	flip(t=10) {
		return new Promise(r => setTimeout(r, t)).then(() => {
			return navigator.locks.request(this.lock, async (lock) => {
				return this._flip();
			}); // end of lock.
		});
	}

	// Clear image.
	clear() {
		return navigator.locks.request(this.lock, async (lock) => {
			return this._clear();
		}); // end of lock.
	}

	// Set image color pallete.
	color(palls=null) {
		return navigator.locks.request(this.lock, async (lock) => {
			this._color(palls);
		}); // end of lock.
	}

	// Draw pixel to image.
	pixel(c=0, x=0, y=0, dx=0, dy=0) {
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(x, y);
				await this._draw(c, -dx, -dy, dx*2, dy*2);
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}
	
	// Draw rect to image.
	drawRect(rects=[0,0,0,0], c=0, x=0, y=0, angle=0, scale=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(x, y, angle, scale);
				await this._rect(rects, c);
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw char as string or number to image.
	drawChar(char, c=0, x=0, y=0, angle=0, scale=1) {
		const w = pico.Image.charWidth;
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(x, y, angle, scale);
				let length = char.length;
				if (length >= 2) {
					await this._move(-(length-1)/2 * w, 0);
				}
				for (let i = 0; i < length; i++) {
					await this._char(char.charCodeAt(i), c);
					await this._move(w, 0);
				}
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw multiple lines of text to image.
	drawText(text, area=null, c=0, x=0, y=0, angle=0, scale=1) {
		const ux = pico.Image.charWidth, uy = pico.Image.charHeight;
		let ox = -(this.canvas[0].width - ux) / 2, oy = -(this.canvas[0].height - uy) / 2;
		let mx = this.canvas[0].width / ux, my = this.canvas[0].height / uy;

		if (area) {
			ox = (area[0] + area[2] / 2);
			oy = (area[1] + area[3] / 2);
			mx = (area[2]) / ux;
			my = (area[3]) / uy;
		}

		this._debug("Textarea: " + ox + "," + oy + " x " + mx + "," + my + " / " + ux + "," + uy);
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(ox + x, oy + y, angle, scale);
				await this._move((-ux * (mx - 1)) / 2 , (-uy * (my - 1)) / 2);
				for (let i = 0, ix = 0, iy = 0; i < text.length && iy < my; i++) {
					let char = text.charCodeAt(i);
					this._debug("char="+char + " ix="+ix + "/"+mx + " iy="+iy + "/"+my);
					if (char == "\r".charCodeAt(0) || char == "\n".charCodeAt(0)) {
						await this._move(-ux * ix, uy);
						ix = 0;
						iy++;
					} else if (ix < mx) {
						await this._char(char, c);
						await this._move(ux, 0);
						ix++;
					}
				}
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw sprite to image.
	drawSprite(cells=[0,9,9,1,0,0], c=-1, x=0, y=0, angle=0, scale=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(x, y, angle, scale);
				await this._sprite(cells, c);
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw offscreen and get sprite data.
	spriteData(cells=[0,9,9,1,0,0], colors=null, scale=10) {
		return navigator.locks.request(pico.image.offscreen.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await pico.image.offscreen._color(colors);
				let size = pico.image.offscreen._spriteSize(cells);
				await pico.image.offscreen._resize(size * scale, size * scale);
				await pico.image.offscreen._ready();
				await pico.image.offscreen._reset(0, 0, 0, scale);
				await pico.image.offscreen._sprite(cells, 0);
				resolve(pico.image.offscreen._data());
			}); // end of new Promise.
		}); // end of lock.
	}

	// Load image file and get image.
	loadImage(url) {
		return navigator.locks.request(pico.image.offscreen.lock, async (lock) => {
			return new Promise(async (resolve) => {
				resolve(pico.image.offscreen._load(url));
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw other image to this image.
	drawImage(image, x=0, y=0, angle=0, scale=1, frame=0, width=0, height=0) {
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(x, y, angle, scale);
				await this._image(image, frame, width, height);
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor(parent=null, width=0, height=0) {
		this.lock = "picoImageLock" + Date.now(); // Lock object identifier.
		this.canvas = []; // Double buffered canvas elements.
		this.primary = 0; // Primary canvas index.
		this.context = null; // Canvas 2d context.
		this.palls = pico.Image.colors; // Master image color. 

		// Setup canvas.
		this._setup(parent, width, height);
	}

	// Debug print.
	_debug(text) {
		if (pico.Image.debug) {
			console.log(text);
		}
	}

	// Resize canvas.
	_resize(width=0, height=0) {
		return this._ready().then(() => {
			this._debug("Flip.");
			return new Promise((resolve) => {
				for (let i = 0; i < 2; i++) {
					this.canvas[i].width = (width ? width : pico.Image.width) * pico.Image.ratio;
					this.canvas[i].height = (width ? height : pico.Image.height) * pico.Image.ratio;
				}
				resolve();
			}); // end of new Promise.
		});
	}

	// Setup canvas.
	_setup(parent=null, width=0, height=0) {
		return new Promise((resolve) => {

			// Create canvas.
			if (this.context == null) {
				this._debug("Create canvas.");
				for (let i = 0; i < 2; i++) {
					this.canvas[i] = document.createElement("canvas");
					this.canvas[i].width = (width ? width : pico.Image.width) * pico.Image.ratio;
					this.canvas[i].height = (width ? height : pico.Image.height) * pico.Image.ratio;
					this.canvas[i].style.width = "100%";
					// Fix to square canvas. // this.canvas[i].style.height = "100%";
					this.canvas[i].style.imageRendering = "pixelated";
					this.canvas[i].style.display = i == this.primary ? "flex" : "none";
					if (parent) {
						if (document.getElementsByClassName(parent)[0]) {
							document.getElementsByClassName(parent)[0].appendChild(this.canvas[i]);
						} else {
							document.body.appendChild(this.canvas[i]);
						}
					}
				}
				this.context = this.canvas[this.primary].getContext("2d");
			}
			return resolve();
		}); // end of new Promise.
	}

	// Flip image.
	_flip() {
		return this._ready().then(() => {
			this._debug("Flip.");
			return new Promise((resolve) => {
				for (let i = 0; i < 2; i++) {
					this.canvas[i].style.display = i == this.primary ? "flex" : "none";
				}
				this.primary = this.primary != 0 ? 0 : 1;
				this.context = this.canvas[this.primary].getContext("2d");
				resolve();
			}); // end of new Promise.
		});
	}

	// Clear image.
	_clear() {
		return this._ready().then(() => {
			this._debug("Clear.");
			return new Promise((resolve) => {

				// Clear image.
				this.context.setTransform(1, 0, 0, 1, 0, 0);
				this.context.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);

				// Clip by canvas rect.
				//this.context.rect(0, 0, pico.Image.width, pico.Image.height);
				//this.context.clip();

				resolve();
			}); // end of new Promise.
		});
	}

	// Ready to draw.
	_ready() {
		if (this.context == null) {
			this._debug("No context.");
			return Promise.reject();
		}
		return Promise.resolve();
	}

	// Reset image transform (scale, rotate, move).
	_reset(x=0, y=0, angle=0, scale=1) {
		this._debug("Reset transform matrix.");
		return new Promise(async (resolve) => {
			this.context.setTransform(1, 0, 0, 1, 0, 0);
			await this._move(x, y);
			await this._rotate(angle);
			await this._scale(scale);
			resolve();
		}); // end of new Promise.
	}

	// Scale image.
	_scale(scale=1) {
		this._debug("Scale: " + scale);
		return new Promise((resolve) => {
			if (scale != 1) {
				this.context.translate(this.canvas[0].width / 2, this.canvas[0].height / 2);
				this.context.scale(scale, scale);
				this.context.translate(-this.canvas[0].width / 2, -this.canvas[0].height / 2);
			}
			resolve();
		}); // end of new Promise.
	}

	// Rotate image.
	_rotate(angle=0) {
		this._debug("Rotate: " + angle);
		return new Promise((resolve) => {
			if (angle) {
				this.context.translate(this.canvas[0].width / 2, this.canvas[0].height / 2);
				this.context.rotate(angle * Math.PI / 180);
				this.context.translate(-this.canvas[0].width / 2, -this.canvas[0].height / 2);
			}
			resolve();
		}); // end of new Promise.
	}

	// Move image.
	_move(x, y) {
		this._debug("Move: " + x + "," + y);
		return new Promise((resolve) => {
			if (x || y) {
				this.context.translate(pico.Image.ratio * x, pico.Image.ratio * y);
			}
			resolve();
		}); // end of new Promise.
	}

	// Set image color pallete.
	_color(palls=null) {
		this.palls = palls && palls.length > 0 ? palls : pico.Image.colors;
	}

	// Draw pixel to image.
	_draw(c=0, x=0, y=0, w=0, h=0) {
		this._debug("Draw: " + c + "," + x + "+" + w + "," + y + "+" + h);
		const u = pico.Image.ratio, cx = (this.canvas[0].width - u) / 2, cy = (this.canvas[0].height - u) / 2;
		this._debug("Center: " + cx + "," + cy + " / " + u);
		return new Promise((resolve) => {
			let k = c >= 0 && c < this.palls.length/3 ? c : this.palls.length/3 - 1;
			let r = this.palls[k*3], g = this.palls[k*3+1], b = this.palls[k*3+2];
			this._debug("Color: " + r + "," + g + "," + b);
			this.context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
			this.context.fillRect(cx + u * x, cy + u * y, u * (w + 1), u * (h + 1));
			resolve();
		}); // end of new Promise.
	}

	// Draw rects to image.
	_rect(rects, c=0) {
		return new Promise(async (resolve) => {
			for (let i = 0; i < rects.length; i += 4) {
				await this._draw(c, rects[i], rects[i+1], rects[i+2], rects[i+3]);
			}
			resolve();
		}); // end of new Promise.
	}

	// Draw char as string or number to image.
	_char(char, c=0) {
		let rects = [];
		if (char >= "0".charCodeAt(0) && char <= "9".charCodeAt(0)) {
			let a = char - "0".charCodeAt(0);
			rects = pico.Image.numberShapes[a];
		} else if (char >= "a".charCodeAt(0) && char <= "z".charCodeAt(0)) {
			let a = char - "a".charCodeAt(0);
			rects = pico.Image.alphabetShapes[a];
		} else if (char >= "A".charCodeAt(0) && char <= "Z".charCodeAt(0)) {
			let a = char - "A".charCodeAt(0);
			rects = pico.Image.alphabetShapes[a];
		} else {
			let a = pico.Image.markChars.indexOf(String.fromCharCode(char));
			if (a >= 0 && a < pico.Image.markShapes.length) {
				rects = pico.Image.markShapes[a];
			}
		}
		return this._rect(rects, c);
	}

	// Draw sprite to image.
	_sprite(cells=[0,9,9,1,0,0], c=-1) {
		return new Promise(async (resolve) => {
			let x0 = 0, y0 = 0;
			if (cells[0] == 0 && cells[1] > 0 && cells[2] > 0) {
				x0 = -(cells[1] - 1) / 2;
				y0 = -(cells[2] - 1) / 2;
			}
			if (c >= 0 && x0 < 0 && y0 < 0) {
				this._rect([x0, y0, x0*-2, y0*-2], c);
			}
			for (let i = 3; i < cells.length; i += 3) {
				if (cells[i+3] == 0) {
					await this._draw(cells[i], cells[i+1] + x0, cells[i+2] + y0, cells[i+4], cells[i+5]);
					i += 3;
				} else {
					await this._draw(cells[i], cells[i+1] + x0, cells[i+2] + y0);
				}
			}
			resolve();
		}); // end of new Promise.
	}

	// Get sprite size.
	_spriteSize(cells=[0,9,9,1,0,0]) {
		if (cells[0] == 0 && cells[1] > 0 && cells[2] > 0) {
			return (cells[1] > cells[2] ? cells[1] : cells[2]);
		}
		return 1;
	}

	// Load image from data url.
	_load(url) {
		return new Promise(async (resolve) => {
			let image = new Image();
			//image.crossOrigin = "anonymous";
			image.onload = () => {
				for (let i = 0; i < 2; i++) {
					this.canvas[i].width = image.width;// * pico.Image.ratio;
					this.canvas[i].height = image.height;// * pico.Image.ratio;
				}
			  this.context.drawImage(image, 0,0);/*
			  	0, 0, image.width, image.height,
			  	0, 0, this.canvas[0].width, this.canvas[0].height);*/
			  //image.style.display = "none";
			  //document.body.appendChild(image);
				resolve(this);
			};
			image.src = url; // To avoid onload hook timing bug.
		});
	}

	// Draw other image to this image.
	_image(image, frame=0, width=0, height=0) {
		const u = 0;//pico.Image.ratio * 4;
		const cx = (this.canvas[0].width - u) / 2, cy = (this.canvas[0].height - u) / 2;
		this._debug("Center: " + cx + "," + cy);
		return new Promise((resolve) => {
			if (width > 0) {
				height = (height > 0 ? height : width);
				let cx = (this.canvas[0].width - width) / 2;
				let cy = (this.canvas[0].height - height) / 2;
				let nx = image.canvas[0].width / width;
				let x = Math.floor(frame % nx) * width;
				let y = Math.floor(frame / nx) * height;
				this._debug("DrawImage: " + cx + "," + cy + " " + x + "," + y + " " + width + "," + height);
				this.context.drawImage(image.canvas[0], x, y, width, height, cx, cy, width, height);
			} else {
				let cx = (this.canvas[0].width - image.canvas[0].width) / 2;
				let cy = (this.canvas[0].height - image.canvas[0].height) / 2;
				this._debug("DrawImage: " + cx + "," + cy + " " + image.canvas[0].width + "," + image.canvas[0].height);
				this.context.drawImage(image.canvas[0], cx, cy);
			}
			resolve();
		}); // end of new Promise.
	}

	// Get image size.
	_size() {
		if (this.canvas[0].width > 0 && this.canvas[0].height > 0) {
			if (this.canvas[0].width > this.canvas[0].height) {
				return this.canvas[0].width;
			} else {
				return this.canvas[0].height;
			}
		}
		return 0;
	}

	// Get image data url.
	_data() {
		return this.canvas[this.primary].toDataURL("image/png");
	}

	// Get image data file.
	_file() {
		const decoded = atob(this.canvas[this.primary].toDataURL("image/png").replace(/^.*,/, ""));
		const buffers = new Uint8Array(decoded.length);
		for (let i = 0; i < decoded.length; i++) {
			buffers[i] = decoded.charCodeAt(i);
		}
		try {
			const blob = new Blob([buffers.buffer], {type: "image/png"});
			const imageFile = new File([blob], "image.png", {type: "image/png"});
			this._debug("Image data: " + imageFile.size);
			return imageFile;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
};

// Master image.
pico.image = new pico.Image(pico.Image.parent);

// Create offscreen image class.
pico.image.offscreen = new pico.Image("");
