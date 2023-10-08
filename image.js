/* PICO Image module */

// Random.
function picoRandom(max) {
	return pico.image.random(max);
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
async function picoPixel(c=1, x=0, y=0, dx=0, dy=0) {
	try {
		await pico.image.pixel(c, x, y, dx, dy);
	} catch (error) {
		console.error(error);
	}
}

// Draw rect.
async function picoRect(rects=[0,0,0,0], c=1, x=0, y=0, angle=0, scale=1) {
	try {
		await pico.image.drawRect(rects, c, x, y, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Draw char as string or number.
async function picoChar(char, c=1, x=0, y=0, angle=0, scale=1) {
	try {
		await pico.image.drawChar("" + char, c, x, y, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Draw multiple lines of text.
async function picoText(text, area=null, c=1, x=0, y=0, angle=0, scale=1) {
	try {
		await pico.image.drawText("" + text, area, c, x, y, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

// Draw sprite.
async function picoSprite(cells=[1,0,0], x=0, y=0, angle=0, scale=1) {
	try {
		await pico.image.drawSprite(cells, x, y, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Image class.
pico.Image = class {
	static width = 200; // Image width.
	static height = 200; // Image height.
	static unit = 4; // Unit size. (Requires multiple of 2 for center pixel)
	static parent = "picoImage"; // Parent element id.

	static charWidth = 4 * 4;
	static charHeight = 4 * 6;

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

	static markChars = ".?!:-+";
	static markShapes = [
		[0,2,0,0], // .
		[-1,-2,2,0, 1,-2,0,1, 0,0,0,0, 0,2,0,0], // ?
		[0,-2,0,2, 0,2,0,0], // !
		[0,-1,0,0, 0,1,0,0], // :
		[-1,0,2,0], // -
		[-1,0,2,0, 0,-1,0,2], // +
		[]];

	static colors = [0,0,0,
		0,63,23, 167,0,0, 143,0,119,
		0,147,59, 231,0,91, 0,115,239,
		188,188,188, 255,219,171, 159,255,243, // 9 colors selected from 8bit original 52 colors.
		51,51,51, 102,102,102, 232,232,232, 255,255,255]; // Master image color. 

	// Get random count.
	random(max) {

		// Xorshift algorythm.
		this.seed = this.seed ^ (this.seed << 13);
		this.seed = this.seed ^ (this.seed >>> 17);
		this.seed = this.seed ^ (this.seed << 15);
		return Math.abs(this.seed % max);

		// LCG algorythm.
		// this.seed = (this.seed * 9301 + 49297) % 233280;
		// let rand = this.seed / 233280;
		// return Math.round(rand * max);
	}

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
	color(palls=[0,0,0]) {
		return navigator.locks.request(this.lock, async (lock) => {
			this.palls = palls;
		}); // end of lock.
	}

	// Draw pixel to image.
	pixel(c=1, x=0, y=0, dx=0, dy=0) {
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset();
				await this._draw(c, x, y, dx, dy);
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}
	
	// Draw rect to image.
	drawRect(rects=[0,0,0,0], c=1, x=0, y=0, angle=0, scale=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(x, y, angle, scale);
				await this._rect(rects, c);
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw sprite to image.
	drawSprite(cells=[1,0,0], x=0, y=0, angle=0, scale=1) {
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(x, y, angle, scale);
				for (let i = 0; i < cells.length; i += 3) {
					if (cells[i+3] == 0) {
						await this._draw(cells[i], cells[i+1], cells[i+2], cells[i+4], cells[i+5]);
						i += 3;
					} else {
						await this._draw(cells[i], cells[i+1], cells[i+2]);
					}
				}
				resolve();
			}); // end of new Promise.
		}); // end of lock.
	}

	// Draw char as string or number to image.
	drawChar(char, c=1, x=0, y=0, angle=0, scale=1) {
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
	drawText(text, area=null, c=1, x=0, y=0, angle=0, scale=1) {
		const u = pico.Image.unit, ux = pico.Image.charWidth, uy = pico.Image.charHeight;
		let ox = -(pico.Image.width - ux) / 2, oy = -(pico.Image.height - uy) / 2;
		let mx = pico.Image.width / ux, my = pico.Image.height / uy;

		if (area) {
			ox = (area[0] + area[2] / 2) * u;
			oy = (area[1] + area[3] / 2) * u;
			mx = (area[2] + 1) * u / ux;
			my = (area[3] + 1) * u / uy;
		}

		console.log("Textarea: " + ox + "," + oy + " x " + mx + "," + my + " / " + ux + "," + uy);
		return navigator.locks.request(this.lock, async (lock) => {
			return new Promise(async (resolve) => {
				await this._ready();
				await this._reset(ox + x, oy + y, angle, scale);
				await this._move((-ux * (mx - 1) + u) / 2 , (-uy * (my - 1) + u) / 2);
				for (let i = 0, ix = 0, iy = 0; i < text.length && iy < my; i++) {
					let char = text.charCodeAt(i);
					//console.log("char="+char + " ix="+ix + "/"+mx + " iy="+iy + "/"+my);
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

	//*----------------------------------------------------------*/

	// constructor.
	constructor(parent=null) {
		this.lock = "picoImageLock" + Date.now(); // Lock object identifier.
		this.canvas = []; // Double buffered canvas elements.
		this.primary = 0; // Primary canvas index.
		this.context = null; // Canvas 2d context.
		this.palls = pico.Image.colors; // Master image color. 
		this.seed = Date.now(); // Random seed.

		// Setup now.
		if (parent) {
			this._setup(parent);

		// Setup after load event.
		} else {
			window.addEventListener("load", () => {
				this._setup(pico.Image.parent);
			});
		}
	}

	// Setup canvas.
	_setup(parent=null) {
		return new Promise((resolve) => {

			// Create canvas.
			if (this.context == null) {
				console.log("Create canvas.");
				for (let i = 0; i < 2; i++) {
					this.canvas[i] = document.createElement("canvas");
					this.canvas[i].width = pico.Image.width;
					this.canvas[i].height = pico.Image.height;
					this.canvas[i].style.imageRendering = "pixelated";
					this.canvas[i].style.display = i == this.primary ? "flex" : "none";
					if (parent && document.getElementById(parent)) {
						document.getElementById(parent).appendChild(this.canvas[i]);
					} else {
						document.body.appendChild(this.canvas[i]);
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
			//console.log("Flip.");
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
			//console.log("Clear.");
			return new Promise((resolve) => {

				// Clear image.
				this.context.setTransform(1, 0, 0, 1, 0, 0);
				this.context.clearRect(0, 0, pico.Image.width, pico.Image.height);

				// Clip by canvas rect.
				this.context.rect(0, 0, pico.Image.width, pico.Image.height);
				this.context.clip();

				resolve();
			}); // end of new Promise.
		});
	}

	// Ready to draw.
	_ready() {
		if (this.context == null) {
			console.log("No context.");
			return Promise.reject();
		}
		return Promise.resolve();
	}

	// Reset image transform (scale, rotate, move).
	_reset(x=0, y=0, angle=0, scale=1) {
		//console.log("Reset transform matrix.");
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
		//console.log("Scale: " + scale);
		return new Promise((resolve) => {
			if (scale != 1) {
				this.context.translate(pico.Image.width / 2, pico.Image.height / 2);
				this.context.scale(scale, scale);
				this.context.translate(-pico.Image.width / 2, -pico.Image.height / 2);
			}
			resolve();
		}); // end of new Promise.
	}

	// Rotate image.
	_rotate(angle=0) {
		//console.log("Rotate: " + angle);
		return new Promise((resolve) => {
			if (angle) {
				this.context.translate(pico.Image.width / 2, pico.Image.height / 2);
				this.context.rotate(angle * Math.PI / 180);
				this.context.translate(-pico.Image.width / 2, -pico.Image.height / 2);
			}
			resolve();
		}); // end of new Promise.
	}

	// Move image.
	_move(x, y) {
		//console.log("Move: " + x + "," + y);
		return new Promise((resolve) => {
			if (x || y) {
				this.context.translate(x, y);
			}
			resolve();
		}); // end of new Promise.
	}

	// Draw rect to image.
	_draw(c=1, x=0, y=0, dx=0, dy=0) {
		//console.log("Draw: " + c + "," + x + "+" + dx + "," + y + "+" + dy);
		const u = pico.Image.unit, cx = (pico.Image.width - u) / 2, cy = (pico.Image.height - u) / 2;
		//console.log("Center: " + cx + "," + cy + " / " + u);
		return new Promise((resolve) => {
			let k = c < 0 ? this.palls.length/3 - 1 : c >= this.palls.length/3 ? 0 : c;
			let r = this.palls[k*3], g = this.palls[k*3+1], b = this.palls[k*3+2];
			//console.log("Color: " + r + "," + g + "," + b);
			this.context.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
			this.context.fillRect(cx + u * x, cy + u * y, u * (dx + 1), u * (dy + 1));
			resolve();
		}); // end of new Promise.
	}

	// Draw rect to image.
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
};

// Master image.
pico.image = new pico.Image();
