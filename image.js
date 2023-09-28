/* PICO Image module */

// Wait.
async function picoWait(t=1000) {
	try {
		await pico.image.wait(t);
	} catch (error) {
		console.error(error);
	}
}

// Clear.
async function picoClear() {
	try {
		await pico.image.clear();
	} catch (error) {
		console.error(error);
	}
}

// Draw.
async function picoDraw(cells=[[0,0]], palls=[[0,0,0]], scale=1, angle=0) {
	try {
		await pico.image.draw(cells, palls, scale, angle);
	} catch (error) {
		console.error(error);
	}
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Image class.
pico.Image = class {
	static width = 120; // Canvas width.
	static height = 120; // Canvas height.
	static unit = 4; // Unit size. (Requires multiple of 2 for center pixel)

	// Wait.
	wait(t=1000) {
		return new Promise(r => setTimeout(r, t));
	}

	// Clear canvas.
	clear() {
		return this._clear();
	}

	// Draw rects to canvas.
	draw(cells=[[0,0]], palls=[[0,0,0]], scale=1, angle=0) {
		return this._draw(null, cells, palls, scale, angle);
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor() {
		this.canvas = null; // Canvas element.
		this.image = null; // Canvas 2d context.
		this.scale = 1; // Canvas scale.
		this.angle = 0; // Canvas angle.

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
				this.canvas = document.createElement("canvas");
				this.canvas.width = pico.Image.width;
				this.canvas.height = pico.Image.height;
				this.canvas.style.imageRendering = "pixelated";

				let cx = this.canvas.width / 2 * this.scale;
				let cy = this.canvas.height / 2 * this.scale;
				this.canvas.style.transform =
					"scale(" + this.scale + ")" +
					"rotate(" + this.angle + "deg)";
				this.image = this.canvas.getContext("2d");
				if (parent) {
					parent.appendChild(this.canvas);
				} else {
					document.body.appendChild(this.canvas);
				}
			}

			return Promise.resolve();
		}); // end of new Promise.
	}

	// Clear image.
	_clear() {
		this._setup();
		if (this.image == null) {
			console.log("No image.");
			return Promise.reject();
		}

		console.log("Clear.");
		return new Promise((resolve) => {

			this.image.clearRect(0, 0, this.canvas.width, this.canvas.height);
			resolve();
		}); // end of new Promise.
	}

	// Ready to start image.
	_ready() {
		return Promise.resolve();
	}

	// Draw rects.
	_draw(type=null, cells=[[0,0, 1,1, 0]], palls=[[0,0,0]], scale=1, angle=0) {
		this._setup();
		if (this.image == null) {
			console.log("No image.");
			return Promise.reject();
		}

		// Wait for ready to start.
		return this._ready().then(() => {

			console.log("Draw: " + cells + " x " + cells.length);
			return new Promise((resolve) => {

				if (scale != 1) {
					this.image.scale(scale, scale);
				}
				if (angle) {
					this.image.translate(pico.Image.width / 2, pico.Image.height / 2);
					this.image.rotate(angle * Math.PI / 180);
					this.image.translate(-pico.Image.width / 2, -pico.Image.height / 2);
				}

				const ux = pico.Image.unit, uy = pico.Image.unit;
				const cx = pico.Image.width / 2 - ux / 2, cy = pico.Image.height / 2 - uy / 2;
				console.log("Center: " + cx + "," + cy + " x " + ux + "," + uy);
				for (let i = 0; i < cells.length; i++) {
					let pos = cells[i].length >= 2 ? [cells[i][0] * ux + cx, cells[i][1] * uy + cy] : [cx, cy];
					let size = cells[i].length >= 4 ? [cells[i][2] * ux, cells[i][3] * uy] : [ux, uy];
					console.log("Rect: " + pos[0] + "," + pos[1] + " x " + size[0] + "," + size[1]);
					let rgb = palls.length > 0 ? palls[cells[i][4] < palls.length ? cells[i][4] : 0] : [0, 0, 0];
					console.log("Color: " + rgb[0] + "," + rgb[1] + "," + rgb[2]);
					this.image.fillStyle = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
					this.image.fillRect(pos[0], pos[1], size[0], size[1]);
				}

				// Reset transformation matrix.
				this.image.setTransform(1, 0, 0, 1, 0, 0);

				resolve();
			}); // end of new Promise.
		});
	}
};

// Master image.
pico.image = new pico.Image();
