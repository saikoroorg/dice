/* PICO Image module */

// Wait and flip canvas.
async function picoFlip(t=1000) {
	try {
		await pico.image.flip(t);
	} catch (error) {
		console.error(error);
	}
}

// Clear canvas.
async function picoClear() {
	try {
		await pico.image.clear();
	} catch (error) {
		console.error(error);
	}
}

// Set color pallete.
async function picoColor(colors=[0,0,0]) {
	try {
		pico.image.color(colors);
	} catch (error) {
		console.error(error);
	}
}

// Draw rects.
async function picoDraw(cells=[1,0,0], x=0, y=0, angle=0, scale=1) {
	try {
		await pico.image.draw(cells, x, y, angle, scale);
	} catch (error) {
		console.error(error);
	}
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Image class.
pico.Image = class {
	static width = 100; // Canvas width.
	static height = 100; // Canvas height.
	static unit = 4; // Unit size. (Requires multiple of 2 for center pixel)
	static lock = "picoImageLock"; // Lock object identifier;

	// Wait and flip canvas.
	flip(t=1000) {
		return new Promise(r => setTimeout(r, t)).then(() => {
			return navigator.locks.request(pico.Image.lock, async (lock) => {
				return this._flip();
			});
		});
	}

	// Clear canvas.
	clear() {
		return navigator.locks.request(pico.Image.lock, async (lock) => {
			return this._clear();
		});
	}

	// Set color pallete.
	color(colors=[0,0,0]) {
		return navigator.locks.request(pico.Image.lock, async (lock) => {
			this.colors = colors;
		});
	}

	// Draw rects to canvas.
	draw(cells=[1,0,0], x=0, y=0, angle=0, scale=1) {
		return navigator.locks.request(pico.Image.lock, async (lock) => {
			return this._ready().then(() => {
				return this._reset();
			}).then(() => {
				return this._move(x, y);
			}).then(() => {
				return this._rotate(angle);
			}).then(() => {
				return this._scale(scale);
			}).then(() => {
				return this._drawRect(cells);
			});
		});
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor() {
		this.canvas = []; // Canvas element.
		this.primary = 0; // Primary index.
		this.image = null; // Canvas 2d context.
		this.colors = [0,0,0, 238,238,238, 255,255,255]; // Color pallete. 

		// Setup after load event.
		window.addEventListener("load", () => {
			this._setup();
		});
	}

	// Setup image.
	_setup(parent=null) {
		return new Promise((resolve) => {

			// Create image.
			if (this.image == null) {
				console.log("Create image.");
				for (let i = 0; i < 2; i++) {
					this.canvas[i] = document.createElement("canvas");
					this.canvas[i].width = pico.Image.width;
					this.canvas[i].height = pico.Image.height;
					this.canvas[i].style.imageRendering = "pixelated";
					this.canvas[i].style.display = "none";
					if (parent) {
						parent.appendChild(this.canvas[i]);
					} else {
						document.body.appendChild(this.canvas[i]);
					}
				}
				this.image = this.canvas[this.primary].getContext("2d");
			}
			return Promise.resolve();
		}); // end of new Promise.
	}

	// Flip canvas.
	_flip() {
		return this._ready().then(() => {
			console.log("Flip.");
			return new Promise((resolve) => {
				for (let i = 0; i < 2; i++) {
					this.canvas[i].style.display = i == this.primary ? "flex" : "none";
				}
				this.primary = this.primary != 0 ? 0 : 1;
				this.image = this.canvas[this.primary].getContext("2d");
				resolve();
			}); // end of new Promise.
		});
	}

	// Clear canvas.
	_clear() {
		return this._ready().then(() => {
			console.log("Clear.");
			return new Promise((resolve) => {

				// Clear canvas.
				this.image.setTransform(1, 0, 0, 1, 0, 0);
				this.image.clearRect(0, 0, pico.Image.width, pico.Image.height);

				// Clip by canvas rect.
				this.image.rect(0, 0, pico.Image.width, pico.Image.height);
				this.image.clip();

				resolve();
			}); // end of new Promise.
		});
	}

	// Ready to start.
	_ready() {
		if (this.image == null) {
			console.log("No image.");
			return Promise.reject();
		}
		return Promise.resolve();
	}

	// Reset image transform (scale, rotate, move).
	_reset() {
		console.log("Reset transform matrix.");
		return new Promise((resolve) => {
			this.image.setTransform(1, 0, 0, 1, 0, 0);
			resolve();
		}); // end of new Promise.
	}

	// Scale image.
	_scale(scale=1) {
		console.log("Scale: " + scale);
		return new Promise((resolve) => {
			if (scale != 1) {
				this.image.scale(scale, scale);
			}
			resolve();
		}); // end of new Promise.
	}

	// Rotate image.
	_rotate(angle=0) {
		console.log("Rotate: " + angle);
		return new Promise((resolve) => {
			if (angle) {
				this.image.translate(pico.Image.width / 2, pico.Image.height / 2);
				this.image.rotate(angle * Math.PI / 180);
				this.image.translate(-pico.Image.width / 2, -pico.Image.height / 2);
			}
			resolve();
		}); // end of new Promise.
	}

	// Move image.
	_move(x, y) {
		console.log("Move: " + x + "," + y);
		return new Promise((resolve) => {
			if (x || y) {
				this.image.translate(x, y);
			}
			resolve();
		}); // end of new Promise.
	}

	// Draw rects.
	_drawRect(cells=[1,0,0]) {
		console.log("Draw: " + cells + " x " + cells.length);
		return new Promise((resolve) => {

			const ux = pico.Image.unit, uy = pico.Image.unit;
			const cx = pico.Image.width / 2 - ux / 2, cy = pico.Image.height / 2 - uy / 2;
			//console.log("Center: " + cx + "," + cy + " x " + ux + "," + uy);

			for (let i = 0; i < cells.length; i += 3) {
				let k = cells[i] >= 0 && cells[i] * 3 < this.colors.length ? cells[i] * 3 : 0;
				let r = this.colors[k], g = this.colors[k+1], b = this.colors[k+2];
				//console.log("Color: " + r + "," + g + "," + b);

				let x = cells[i+1] ? cells[i+1] * ux + cx : cx;
				let y = cells[i+2] ? cells[i+2] * uy + cy : cy;
				let w = ux, h = uy;
				if (cells[i+3] == 0) {
					w = cells[i+4] ? cells[i+4] * ux : ux;
					h = cells[i+5] ? cells[i+5] * uy : uy;
					i += 3;
					//console.log("Rect: " + x + "," + y + " x " + w + "," + h);
				}

				this.image.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
				this.image.fillRect(x, y, w, h);
			}
			resolve();
		}); // end of new Promise.
	}
};

// Master image.
pico.image = new pico.Image();
