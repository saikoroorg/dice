/* PICO Touch module */

// Read touch event.
async function picoRead(t=-1) {
	try {
		return await pico.touch.read(t);
	} catch (error) {
		console.error(error);
	}
}

// Flush touch event.
function picoFlush() {
	pico.touch.flush();
}

// Check touch motion.
function picoMotion(x, y, r=0, h=0) {
	return pico.touch.motion(x, y, r, h);
}

// Check touch action.
function picoAction(x, y, r=0, h=0) {
	return pico.touch.action(x, y, r, h);
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Touch class.
pico.Touch = class {
	static debug = false; // Debug print.
	static width = 200; // Touch width.
	static height = 200; // Touch height.
	static unit = 4; // Unit size. (Requires multiple of 2 for center pixel)
	static parent = "picoTouch"; // Parent element class.

	// Read touch event.
	read(t=10) {
		if (t >= 0) {
			return new Promise(r => setTimeout(r, t)).then(() => {
				return navigator.locks.request(this.lock, async (lock) => {
					return this._read();
				}); // end of lock.
			}); // end of new Promise.

		// Wait until input.
		} else {
			return new Promise((resolve) => {
				const timer = setInterval(() => {
					if (this.flushing || pico.touch.allscreen._motion() || pico.touch.allscreen._action()) {
						clearInterval(timer);
						this.flushing = false;
						this._read();
						resolve();
					}
					pico.touch.allscreen._read();
				}, 10); // end of setInterval.
			}); // end of new Promise.
		}
	}

	// Flush touch event.
	flush() {
		this.flushing = true;
	}

	// Check touch motion.
	motion(x=0, y=0, r=0, h=0) {
		return this._motion(x, y, r, h);
	}

	// Check touch action.
	action(x=0, y=0, r=0, h=0) {
		return this._action(x, y, r, h);
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor(parent=null) {
		this.lock = "picoTouchLock" + Date.now(); // Lock object identifier.
		this.panel = null; // Touch panel element.
		this.touching = [[], []]; // Double buffered touching states.
		this.primary = 0; // Primary touching index.
		this.flushing = false; // Flushing flag.

		this._setup(parent);
	}

	// Debug print.
	_debug(text) {
		if (pico.Touch.debug) {
			console.log(text);
		}
	}

	// Setup touch panel.
	_setup(parent=null) {
		return new Promise((resolve) => {

			// Create touch panel.
			if (this.panel == null) {
				this._debug("Select touch panel.");
				if (parent && document.getElementsByClassName(parent)[0]) {
					this.panel = document.getElementsByClassName(parent)[0];
				} else {
					this.panel = document.body;
				}

				// Add mouse/touch event listener.
				this.panel.addEventListener("mousedown", (evt) => {
					let rect = this.panel.getBoundingClientRect();
					let x = (evt.pageX - rect.x - window.pageXOffset) * pico.Touch.width / rect.width;
					let y = (evt.pageY - rect.y - window.pageYOffset) * pico.Touch.height / rect.width; // Fix to square canvas. // height;
					navigator.locks.request(this.lock, async (lock) => {
						this._eventTouchCancel(-1);
						this._eventTouchDown(-1, x, y);
					}); // end of lock.
				});
				this.panel.addEventListener("mousemove", (evt) => {
					let rect = this.panel.getBoundingClientRect();
					let x = (evt.pageX - rect.x - window.pageXOffset) * pico.Touch.width / rect.width;
					let y = (evt.pageY - rect.y - window.pageYOffset) * pico.Touch.height / rect.width; // Fix to square canvas. // height;
					navigator.locks.request(this.lock, async (lock) => {
						this._eventTouchMove(-1, x, y);
					}); // end of lock.
				});
				document.addEventListener("mouseup", () => {
					navigator.locks.request(this.lock, async (lock) => {
						this._eventTouchUp(-1);
					}); // end of lock.
				});
				this.panel.addEventListener("touchstart", (evt) => {
					let rect = this.panel.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						for (let i = 0; i < evt.changedTouches.length; ++i) {
							let x = (evt.changedTouches[i].pageX - rect.x - window.pageXOffset) * pico.Touch.width / rect.width;
							let y = (evt.changedTouches[i].pageY - rect.y - window.pageYOffset) * pico.Touch.height / rect.width; // Fix to square canvas. // height;
							this._eventTouchDown(evt.changedTouches[i].identifier, x, y);
						}
					}); // end of lock.
				});
				this.panel.addEventListener("touchmove", (evt) => {
					evt.preventDefault(); // Lock scroll.
					let rect = this.panel.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						for (let i = 0; i < evt.changedTouches.length; ++i) {
							let x = (evt.changedTouches[i].pageX - rect.x - window.pageXOffset) * pico.Touch.width / rect.width;
							let y = (evt.changedTouches[i].pageY - rect.y - window.pageYOffset) * pico.Touch.height / rect.width; // Fix to square canvas. // height;
							this._eventTouchMove(evt.changedTouches[i].identifier, x, y);
						}
					}); // end of lock.
				}, {passive: false});
				this.panel.addEventListener("touchend", (evt) => {
					let rect = this.panel.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						for (let i = 0; i < evt.changedTouches.length; ++i) {
							this._eventTouchUp(evt.changedTouches[i].identifier);
						}
					}); // end of lock.
				});
				this.panel.addEventListener("touchcancel", (evt) => {
					let rect = this.panel.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						for (let i = 0; i < evt.changedTouches.length; ++i) {
							this._eventTouchCancel(evt.changedTouches[i].identifier);
						}
					}); // end of lock.
				});
			}
			return resolve();
		}); // end of new Promise.
	}

	// Ready to touch.
	_ready() {
		if (this.panel == null) {
			this._debug("No panel.");
			return Promise.reject();
		}
		return Promise.resolve();
	}

	// Touch down event handler.
	_eventTouchDown(w, x, y) {
		for (let i = 0; i < this.touching[0].length; i++) {
			if (this.touching[0][i].w == w && this.touching[0][i].motion) {
				this.touching[0][i] = {w:w, x:x, y:y, motion:1};
				this._debug("Touch down: " + i + ":" + JSON.stringify(this.touching[0][i]));
				return;
			}
		}
		let i = this.touching[0].length;
		this.touching[0][i] = {w:w, x:x, y:y, motion:1};
		this._debug("Touch down: " + i + ":" + JSON.stringify(this.touching[0][i]));
	}

	// Touch move event handler.
	_eventTouchMove(w, x, y) {
		for (let i = 0; i < this.touching[0].length; i++) {
			if (this.touching[0][i].w == w && this.touching[0][i].motion) {
				this.touching[0][i].motion = 1;
				this.touching[0][i].x = x;
				this.touching[0][i].y = y;
				//this._debug("Touch move: " + i + ":" + JSON.stringify(this.touching[0][i]));
				break;
			}
		}
	}

	// Touch up event handler.
	_eventTouchUp(w) {
		for (let i = 0; i < this.touching[0].length; i++) {
			if (this.touching[0][i].w == w) {
				this.touching[0][i].motion = 0;
				this.touching[0][i].action = -1;
				this._debug("Touch up: " + i + ":" + JSON.stringify(this.touching[0][i]));
				break;
			}
		}
	}

	// Touch cancel event handler.
	_eventTouchCancel(w) {
		for (let i = 0; i < this.touching[0].length; i++) {
			if (this.touching[0][i].w == w) {
				this.touching[0][i].motion = -1;
				this._debug("Touch cancel: " + i + ":" + JSON.stringify(this.touching[0][i]));
				break;
			}
		}
	}

	// Read action event.
	_read() {

		// Update new touching state.
		let touching0 = [], touching1 = [];
		for (let i = 0; i < this.touching[0].length; i++) {

			// Touch up trigger.
			if (this.touching[0][i].action < 0) {
				for (let j = 0; j < this.touching[1].length; j++) {
					if (this.touching[1][j].w == this.touching[0][i].w) {
						this._debug("Up: " + j + ":" + JSON.stringify(this.touching[0][i]));
						touching1[touching1.length] = {w:this.touching[0][i].w, x:this.touching[0][i].x, y:this.touching[0][i].y, action:1};
						break;
					}
				}

			// Touch holding.
			} else if (this.touching[0][i].motion > 0 && this.touching[0][i].motion <= 100) {
				this.touching[0][i].motion++; // Time limit for exceptional movement.
				touching0[touching0.length] = this.touching[0][i];

				// Check down trigger.
				let trigger = true;
				for (let j = 0; j < this.touching[1].length; j++) {
					if (this.touching[1][j].w == this.touching[0][i].w) {
						this._debug("Holding: " + j);// + ":" + JSON.stringify(this.touching[0][i]));
						touching1[touching1.length] = {w:this.touching[0][i].w, x:this.touching[0][i].x, y:this.touching[0][i].y, motion:this.touching[0][i].motion};

						trigger = false;;
						break;
					}
				}

				// Touch down trigger.
				if (trigger) {
					this._debug("Down: " + i + ":" + JSON.stringify(this.touching[0][i]));
					touching1[touching1.length] = {w:this.touching[0][i].w, x:this.touching[0][i].x, y:this.touching[0][i].y, motion:1};
				}
			}
		}
		this.touching[0] = touching0; // Touching state for write.
		this.touching[1] = touching1; // Touching state for read.
		this.primary = 1; // Read from touching state 1.
	}

	// Check touch motion.
	_motion(x, y, r=0, h=0) {
		const cx = pico.Touch.width / 2, cy = pico.Touch.height / 2;
		for (let i = 0; i < this.touching[this.primary].length; i++) {
			if (this.touching[this.primary][i].motion > 0) {
				if (r <= 0) {
					return i + 1;
				} else if (h <= 0) {
					let x2 = Math.pow(cx + x - this.touching[this.primary][i].x, 2);
					let y2 = Math.pow(cy + y - this.touching[this.primary][i].y, 2);
					//this._debug("Motion: " + x2 + "," + y2 + "<=" + (r*r));
					if (x2 + y2 <= r * r) {
						return i + 1;
					}
				} else {
					let x1 = cx + x - this.touching[this.primary][i].x;
					let y1 = cy + y - this.touching[this.primary][i].y;
					if (x1 >= -r && x1 <= r && y1 >= -h && y1 <= h) {
						return i + 1;
					}
				}
			}
		}
		return 0;
	}

	// Check touch action.
	_action(x, y, r=0, h=0) {
		const cx = pico.Touch.width / 2, cy = pico.Touch.height / 2;
		for (let i = 0; i < this.touching[this.primary].length; i++) {
			if (this.touching[this.primary][i].action > 0) {
				if (r <= 0) {
					return i + 1;
				} else if (h <= 0) {
					let x2 = Math.pow(cx + x - this.touching[this.primary][i].x, 2);
					let y2 = Math.pow(cy + y - this.touching[this.primary][i].y, 2);
					//this._debug("Action: " + x2 + "," + y2 + "<=" + (r*r));
					if (x2 + y2 <= r * r) {
						return i + 1;
					}
				} else {
					let x1 = cx + x - this.touching[this.primary][i].x;
					let y1 = cy + y - this.touching[this.primary][i].y;
					if (x1 >= -r && x1 <= r && y1 >= -h && y1 <= h) {
						return i + 1;
					}
				}
			}
		}
		return 0;
	}
};

// Master touch.
pico.touch = new pico.Touch(pico.Touch.parent);

// Create allscreen touch class.
pico.touch.allscreen = new pico.Touch("");
