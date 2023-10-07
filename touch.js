/* PICO Touch module */

// Sync touch event.
async function picoSync(t=10) {
	try {
		return await pico.touch.sync(t);
	} catch (error) {
		console.error(error);
	}
}

// Check touch motion.
function picoMotion(x, y, r=0) {
	return pico.touch.motion(x, y, r);
}

// Check touch action.
function picoAction(x, y, r=0) {
	return pico.touch.action(x, y, r);
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Touch class.
pico.Touch = class {
	static width = 200; // Touch width.
	static height = 200; // Touch height.
	static unit = 4; // Unit size. (Requires multiple of 2 for center pixel)
	static parent = "picoTouch"; // Parent element id.

	// Sync touch event.
	sync(t=10) {
		return new Promise(r => setTimeout(r, t)).then(() => {
			return navigator.locks.request(this.lock, async (lock) => {
				return this._sync();
			}); // end of lock.
		});
	}

	// Check touch motion.
	motion(x, y, r=0) {
		return this._motion(x, y, r);
	}

	// Check touch action.
	action(x, y, r=0) {
		return this._action(x, y, r);
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor(parent=null) {
		this.lock = "picoTouchLock" + Date.now(); // Lock object identifier.
		this.panel = null; // Touch panel element.
		this.touching = [[], []]; // Double buffered touching states.
		this.primary = 0; // Primary touching index.

		// Setup now.
		if (parent) {
			this._setup(parent);

		// Setup after load event.
		} else {
			window.addEventListener("load", () => {
				this._setup(pico.Touch.parent);
			});
		}
	}

	// Setup touch panel.
	_setup(parent=null) {
		return new Promise((resolve) => {

			// Create touch panel.
			if (this.panel == null) {
				console.log("Create touch panel.");
				this.panel = document.createElement("div");
				this.panel.width = pico.Touch.width;
				this.panel.height = pico.Touch.height;
				this.panel.style.display = "flex";
				if (parent && document.getElementById(parent)) {
					document.getElementById(parent).appendChild(this.panel);
				} else {
					document.body.appendChild(this.panel);
					parent = document.body;
				}

				// Add mouse/touch event listener.
				parent.addEventListener("mousedown", (evt) => {
					let rect = parent.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						this._eventMouseDown(evt.pageX - rect.x, evt.pageY - rect.y);
					}); // end of lock.
				});
				parent.addEventListener("mousemove", (evt) => {
					let rect = parent.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						this._eventMouseMove(evt.pageX - rect.x, evt.pageY - rect.y);
					}); // end of lock.
				});
				document.addEventListener("mouseup", () => {
					navigator.locks.request(this.lock, async (lock) => {
						this._eventMouseUp();
					}); // end of lock.
				});
				parent.addEventListener("touchstart", (evt) => {
					let rect = parent.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						for (let i = 0; i < evt.touches.length; ++i) {
							this._eventTouchOn(evt.touches[i].identifier, evt.touches[i].pageX - rect.x, evt.touches[i].pageY - rect.y);
						}
					}); // end of lock.
				});
				parent.addEventListener("touchmove", (evt) => {
					let rect = parent.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						for (let i = 0; i < evt.touches.length; ++i) {
							this._eventTouchOn(evt.touches[i].identifier, evt.touches[i].pageX - rect.x, evt.touches[i].pageY - rect.y);
						}
					}); // end of lock.
				});
				parent.addEventListener("touchend", (evt) => {
					let rect = parent.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						for (let i = 0; i < evt.changedTouches.length; ++i) {
							this._eventTouchOff(evt.changedTouches[i].identifier, evt.changedTouches[i].pageX - rect.x, evt.changedTouches[i].pageY - rect.y);
						}
					}); // end of lock.
				});
				parent.addEventListener("touchcancel", () => {
					let rect = parent.getBoundingClientRect();
					navigator.locks.request(this.lock, async (lock) => {
						for (let i = 0; i < evt.changedTouches.length; ++i) {
							this._eventTouchOff(evt.changedTouches[i].identifier, evt.changedTouches[i].pageX - rect.x, evt.changedTouches[i].pageY - rect.y);
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
			console.log("No panel.");
			return Promise.reject();
		}
		return Promise.resolve();
	}

	// Mouse down event handler.
	_eventMouseDown(x, y) {
		for (let i = 0; i < this.touching[0].length; i++) {
			if (this.touching[0][i].w == 0) {
				this.touching[0][i].motion = false;
				this.touching[0][i].action = true;
				console.log("Mouse up: " + i + ":" + JSON.stringify(this.touching[i]));
				break;
			}
		}

		// Mouse down trigger.
		let i = this.touching[0].length;
		this.touching[0][i] = {w:0, x:x, y:y, motion:true};
		console.log("Mouse down: " + i + ":" + JSON.stringify(this.touching[i]));
	}

	// Mouse move event handler.
	_eventMouseMove(x, y) {
		for (let i = 0; i < this.touching[0].length; i++) {
			if (this.touching[0][i].w == 0 && this.touching[0][i].motion) {
				this.touching[0][i].motion = true;
				this.touching[0][i].x = x;
				this.touching[0][i].y = y;
				//console.log("Mouse move: " + i + ":" + JSON.stringify(this.touching[i]));
				break;
			}
		}
	}

	// Mouse up event handler.
	_eventMouseUp() {
		for (let i = 0; i < this.touching[0].length; i++) {
			this.touching[0][i].motion = false;
			this.touching[0][i].action = true;
			console.log("Mouse up: " + i + ":" + JSON.stringify(this.touching[i]));
			break;
		}
	}

	// Touch on event handler.
	_eventTouchOn(w, x, y) {
		for (let i = 0; i < this.touching[0].length; i++) {
			if (this.touching[0][i].w == w) {
				this.touching[0][i].motion = false;
				this.touching[0][i].action = true;
				console.log("Touch up: " + i + ":" + JSON.stringify(this.touching[i]));
				break;
			}
		}

		// Touch down trigger.
		let i = this.touching[0].length;
		this.touching[0][i] = {w:w, x:x, y:y, motion:true};
		console.log("Touch down: " + i + ":" + JSON.stringify(this.touching[i]));
	}

	// Touch off event handler.
	_eventTouchOff(w, x, y) {
		for (let i = 0; i < this.touching[0].length; i++) {
			if (this.touching[0][i].w == w) {
				this.touching[0][i].motion = false;
				this.touching[0][i].action = true;
				console.log("Touch up: " + i + ":" + JSON.stringify(this.touching[i]));
				break;
			}
		}
	}

	// Sync event.
	_sync() {

		// Delete ended touching state.
		let touching1 = [];
		for (let j = 0; j < this.touching[1].length; j++) {
			if (!this.touching[1][j].action) {
				touching1[touching1.length] = this.touching[1][j];
			}
		}
		this.touching[1] = touching1;

		// Update new touching state.
		for (let i = 0; i < this.touching[0].length; i++) {

			// Check down trigger.
			let trigger = true;
			for (let j = 0; j < this.touching[1].length; j++) {
				if (this.touching[1][j].w == this.touching[0][i].w) {

					// Touch up trigger.
					if (this.touching[0][i].action) {
						console.log("Up: " + j + ":" + JSON.stringify(this.touching[0][i]));
						this.touching[1][j] = {w:this.touching[1][j].w, x:this.touching[1][j].x, y:this.touching[1][j].y, action:true};

					// Touch holding.
					} else if (this.touching[0][i].motion) {
						console.log("Holding: " + j + ":" + JSON.stringify(this.touching[0][i]));
						this.touching[1][j] = {w:this.touching[0][i].w, x:this.touching[0][i].x, y:this.touching[0][i].y, motion:true};
					}

					trigger = false;;
					break;
				}
			}

			// Touch down trigger.
			if (trigger) {
				let k = this.touching[1].length;
				if (this.touching[0][i].motion) {
					console.log("Down: " + i + ":" + JSON.stringify(this.touching[0][i]));
					this.touching[1][k] = {w:this.touching[0][i].w, x:this.touching[0][i].x, y:this.touching[0][i].y, motion:true};
				}
			}
		}

		// Delete ended touching state.
		let touching0 = [];
		for (let j = 0; j < this.touching[0].length; j++) {
			if (!this.touching[0][j].action) {
				touching0[touching0.length] = this.touching[0][j];
			}
		}
		this.touching[0] = touching0;

		this.primary = 1;
	}

	// Check touch motion.
	_motion(x, y, r=0) {
		const cx = pico.Touch.width / 2, cy = pico.Touch.height / 2;
		for (let i = 0; i < this.touching[this.primary].length; i++) {
			if (r <= 0) {
				return i + 1;
			}
			let x2 = Math.pow(cx - x - this.touching[this.primary][i].x, 2);
			let y2 = Math.pow(cy - y - this.touching[this.primary][i].y, 2);
			//console.log("Motion: " + x2 + "," + y2 + "<=" + (r*r));
			if (x2 + y2 <= r * r) {
				return i + 1;
			}
		}
		return 0;
	}

	// Check touch action.
	_action(x, y, r=0) {
		const cx = pico.Touch.width / 2, cy = pico.Touch.height / 2;
		for (let i = 0; i < this.touching[this.primary].length; i++) {
			if (this.touching[this.primary][i].action) {
				if (r <= 0) {
					return i + 1;
				}
				let x2 = Math.pow(cx - x - this.touching[this.primary][i].x, 2);
				let y2 = Math.pow(cy - y - this.touching[this.primary][i].y, 2);
				//console.log("Action: " + x2 + "," + y2 + "<=" + (r*r));
				if (x2 + y2 <= r * r) {
					return i + 1;
				}
			}
		}
		return 0;
	}
};

// Master touch.
pico.touch = new pico.Touch();
