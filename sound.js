/* PICO Sound module */

// Wait sound.
async function picoWait(t=1000) {
	await pico.sound.wait(t);
}

// Play beep.
async function picoBeep(kcent=0, length=0.1, delay=0) {
	await pico.sound.beep(kcent, length, delay);
}

// Play melody.
async function picoPlay(kcents=[0], length=0.1, repeat=0) {
	await pico.melody.play(kcents, length, repeat);
}

// Stop melody.
async function picoStop() {
	await pico.melody.stop();
}

// Play pulse sound.
// Original parameter: pattern=0.125,0.25,0.5
async function picoPulse(kcent=0, length=0.1, pattern=0) {
	await pico.sound8bit.playPulse(kcent, length, pattern);
}

// Play triangle sound.
// Original parameter: pattern=16
async function picoTriangle(kcent=0, length=0.1, pattern=0) {
	await pico.sound8bit.playTriangle(kcent, length, pattern);
}

// Play noise sound.
// Original parameter: pattern=1,6
async function picoNoise(length=0.1, pattern=0) {
	await pico.sound8bit.playNoise(length, pattern);
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Sound class.
pico.Sound = class {

	// Wait sound.
	async wait(t=1000) {
		await new Promise(r => setTimeout(r, t));
	}

	// Beep.
	async beep(kcent=0, length=0.1, delay=0) {
		const type = "square"; //"sine", "square", "sawtooth", "triangle";
		const volume = 0.1;
		await this._start(type, [kcent], volume, length, delay);
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor() {
		this.audio = null; // Audio context.
		this.oscillator = null; // Oscillator node.
		this.master = null; // Master volume node.
		this.started = false; // Start flag.
		this.endTime = 0; // End time count.

		// Setup after click event for audio permission.
		document.addEventListener("click", () => {
			this._setup();
		});

		// Setup after visibility changed to visible.
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState === "visible") {
				this._setup();
			}
		});
	}

	// Setup sound.
	_setup() {
		try {

			// Create audio.
			if (this.audio == null) {
				console.log("Create audio.");
				this.audio = new window.AudioContext();
				this.master = this.audio.createGain();
				this.master.gain.value = 0.1;
				this.master.connect(this.audio.destination);
				this.oscillator = this.audio.createOscillator();
				this.oscillator.frequency.setValueAtTime(440, this.audio.currentTime);

				// Close audio.
				this.oscillator.onended = () => {
					console.log("Close audio.");
					this.master.gain.value = 0.1;
					this.master.disconnect(this.audio.destination);
					this.audio.close();
					this.audio = this.oscillator = this.master = null;
					this.started = false;
					this.endTime = 0;
				};
			}
		} catch (error) {
			console.error(error.name, error.message);
		}
	}

	// Stop sound.
	async _stop() {
		if (this.audio == null) {
			console.log("No audio.");
			return;
		} else if (!this.started) {
			console.log("Not started.");
			return;
		}

		// Stop audio.
		console.log("Stop.");
		this.master.gain.value = 0;
		this.endTime = 0;
	}
	
	// Start sound.
	async _start(type="square", kcent=0, volume=0.1, length=0.1, delay=0) {
		if (this.audio == null) {
			console.log("No audio.");
			return;
		} else if (this.endTime > Date.now() + delay * 1000) {
			console.log("Not end previous sound.");
			return;
		}

		console.log("Start: " + kcent + " x " + length + " + " + delay);
		await new Promise((resolve) => {

			// Set end time.
			this.endTime = Date.now() + length * 1000 + delay * 1000;

			// Wait to start.
			setTimeout(() => {

				// Connect.
				if (type) {
					this.master.gain.value = volume;
					this.oscillator.type = type;
					this.oscillator.detune.setValueAtTime(kcent * 1000, this.audio.currentTime);
					this.oscillator.connect(this.master);
				}

				// Start.
				if (!this.started) {
					console.log("Start audio.");
					this.oscillator.start();
					this.started = true;
				}

				// Wait to end.
				setTimeout(() => {
					console.log("End: " + kcent + " x " + length);
					if (type) {
						this.master.gain.value = 0;
						this.oscillator.disconnect(this.master);
					}
					resolve();
				}, length * 1000);
			}, delay * 1000);
		}); // end of new Promise.
	}

	// Repeat sounds.
	async _repeat(type="square", kcents=[0], volume=0.1, length=0.1, repeat=0) {
		if (this.audio == null) {
			console.log("No audio.");
			return;
		} else if (this.endTime > Date.now()) {
			console.log("Not end previous sound.");
			return;
		}

		console.log("Repeat: " + kcents + " x " + length * kcents.length + " x " + repeat);
		await new Promise((resolve) => {

			// Set end time.
			this.endTime = Date.now() + length * kcents.length * 1000;

			// Connect.
			this.master.gain.value = volume;
			this.oscillator.type = type;
			for (let i = 0; i < kcents.length; i++) {
				this.oscillator.detune.setValueAtTime(kcents[i] * 1000, this.audio.currentTime + length * i);
			}
			this.oscillator.connect(this.master);

			// Start.
			if (!this.started) {
				console.log("Start audio.");
				this.oscillator.start();
				this.started = true;
			}

			// Wait to end.
			let timer = setInterval(() => {
				if (this.endTime > 0 && repeat == 0) {
					console.log("Loop: " + kcents + " x " + length * kcents.length + " x " + repeat);
					for (let i = 0; i < kcents.length; i++) {
						this.oscillator.detune.setValueAtTime(kcents[i] * 1000, this.audio.currentTime + length * i);
					}
					this.endTime = Date.now() + length * kcents.length * 1000;
				} else if (this.endTime > 0 && repeat > 0) {
					for (let i = 0; i < kcents.length; i++) {
						this.oscillator.detune.setValueAtTime(kcents[i] * 1000, this.audio.currentTime + length * i);
					}
					repeat -= 1;
					console.log("Repeat: " + kcents + " x " + length * kcents.length + " x " + repeat);
					this.endTime = Date.now() + length * kcents.length * 1000;
				} else {
					repeat -= 1;
					console.log("End: " + kcents + " x " + length * kcents.length + " x " + repeat);
					this.master.gain.value = 0;
					this.oscillator.disconnect(this.master);
					clearInterval(timer);
					resolve();
				}
			}, length * kcents.length * 1000);
		}); // end of new Promise.
	}
};

// Double buffered melody class.
pico.Melody = class {

	// Play melody.
	async play(kcents=[0], length=0.1, repeat=0) {
		const type = "triangle";
		const volume = 0.1;
		await this.sounds[this.soundIndex]._stop();
		this.soundIndex = this.soundIndex != 0 ? 0 : 1;
		await this.sounds[this.soundIndex]._repeat(type, kcents, volume, length, repeat);
	}

	// Wait for stop melody.
	async stop() {
		await this.sounds[this.soundIndex]._stop();
	}

	//*----------------------------------------------------------*/

	// constructor.
	constructor() {
		this.sounds = []; // Sound objects for double buffering.
		this.soundMax = 2;
		this.soundIndex = 0; // Primary sound object index.
		for (let i = 0; i < this.soundMax; i++) {
			this.sounds[i] = new pico.Sound();
		}
	}
};

// Sound 8bit class.
pico.Sound8bit = class extends pico.Sound {

	// Beep.
	async beep(kcent=0, length=0.1, delay=0) {
		const type = "square";
		const volume = 0.1;
		await this._start(type, [kcent], volume, length, delay);
	}

	// Play pulse sound.
	async playPulse(kcent=0, length=0.1, pattern=0) {
		console.log("Play pulse" + pattern + ": " + kcent + " x " + length);
		const volume = 0.1;

		// Original 8bit argorithm, original parameter: pattern=0.125,0.25,0.5
		if (pattern > 0) {

			// Create pulse filters.
			let frequency = !kcent ? this.oscillator.frequency.value :
				this.oscillator.frequency.value * (2 ** (kcent * 1000 / 1200));
			let pulseFilters = [];
			pulseFilters[0] = this.audio.createGain();
			pulseFilters[0].gain.value = -1;
			pulseFilters[1] = this.audio.createDelay();
			pulseFilters[1].delayTime.value = (1.0 - pattern) / frequency;

			// Connect pulse filters to master volume.
			this.oscillator.connect(pulseFilters[0]).connect(pulseFilters[1]).connect(this.master);
			setTimeout(() => {
				console.log("Disconnect pulse filters.");
				this.oscillator.disconnect(pulseFilters[0]);
				pulseFilters[0].disconnect(pulseFilters[1]);
				pulseFilters[0] = null;
				pulseFilters[1].disconnect(this.master);
				pulseFilters[1] = null;
			}, length * 1000);

			// Start.
			const type = "sawtooth";
			await this._start(type, [kcent], volume, length);

		// Simple square sound.
		} else {
			const type = "square";
			await this._start(type, [kcent], volume, length);
		}
	}

	// Play triangle sound.
	async playTriangle(kcent=0, length=0.1, pattern=0) {
		if (this.audio == null) {
			console.log("No audio.");
			return;
		}
		console.log("Play triangle" + pattern + ": " + kcent + " x " + length);
		const volume = 0.1;

		// Original 8bit argorithm, original parameter: pattern=16
		if (pattern > 0) {

			// Create triangle buffers.
			let triangleBuffer = null;
			triangleBuffer = this.audio.createBuffer(1, this.audio.sampleRate * length, this.audio.sampleRate);

			// Original pseudo triangle argorithm.
			let frequency = !kcent ? this.oscillator.frequency.value :
				this.oscillator.frequency.value * (2 ** (kcent * 1000 / 1200));
			let triangleCycle = 2 * Math.PI, value = 0;
			let buffering = triangleBuffer.getChannelData(0);
			for (let i = 0; i < triangleBuffer.length; i++) {
				let k = (triangleCycle * frequency * i / this.audio.sampleRate) % triangleCycle;
				//buffering[i] = Math.sin(k);
				if (k < triangleCycle / 2) {
					if (k < triangleCycle / 4) { // 0 -> 1.
						value = k / (triangleCycle / 4);
					} else { // 1 -> 0.
						value = -k / (triangleCycle / 4) + 2;
					}
					buffering[i] = Math.floor(value * pattern) / pattern;
				} else {
					if (k < triangleCycle * 3 / 4) { // 0 -> -1.
						value = -k / (triangleCycle / 4) + 2;
					} else { // -1 -> 0.
						value = k / (triangleCycle / 4) - 4;
					}
					buffering[i] = Math.ceil(value * pattern) / pattern;
				}
				//if (!Math.floor(i % 100)) {
				//	console.log("buffering" + i + ": " + value + " -> " + buffering[i]);
				//}
			}

			// Connect triangle generator to master volume.
			this.master.gain.value = volume;
			let triangleGenerator = null;
			triangleGenerator = this.audio.createBufferSource();
			triangleGenerator.buffer = triangleBuffer;
			triangleGenerator.connect(this.master);
			triangleGenerator.start();
			setTimeout(() => {
				console.log("Disconnect triangle generator.");
				triangleGenerator.disconnect(this.master);
				triangleGenerator = null;
				triangleBuffer = null;
			}, length * 1000);

			// Start.
			const type = null;
			await this._start(type, [0], volume, length);

		// Simple triangle sound.
		} else {
			const type = "triangle";
			await this._start(type, [kcent], volume, length);
		}
	}

	// Play noise sound.
	async playNoise(length=0.1, pattern=0) {
		if (this.audio == null) {
			console.log("No audio.");
			return;
		}
		console.log("Play noise" + pattern + ": " + length);
		const volume = 0.1;

		// Create noise buffers.
		let noiseBuffer = null;
		noiseBuffer = this.audio.createBuffer(2, this.audio.sampleRate * length, this.audio.sampleRate);

		// Original 8bit argorithm, original parameter: pattern=1,6
		if (pattern > 0) {
			let reg = 0x8000;
			for (let j = 0; j < noiseBuffer.numberOfChannels; j++) {
				let buffering = noiseBuffer.getChannelData(j);
				for (let i = 0; i < noiseBuffer.length; i++) {
					reg >>= 1;
					reg |= ((reg ^ (reg >> pattern)) & 1) << 15;
					buffering[i] = reg & 1;
				}
			}

		// Simple noise sound.
		} else {
			for (let j = 0; j < noiseBuffer.numberOfChannels; j++) {
				let buffering = noiseBuffer.getChannelData(j);
				for (let i = 0; i < noiseBuffer.length; i++) {
					buffering[i] = Math.random() * 2 - 1;
				}
			}
		}

		// Connect noise generator to master volume.
		this.master.gain.value = volume;
		let noiseGenerator = null;
		noiseGenerator = this.audio.createBufferSource();
		noiseGenerator.buffer = noiseBuffer;
		noiseGenerator.connect(this.master);
		noiseGenerator.start();
		setTimeout(() => {
			console.log("Disconnect noise generator.");
			noiseGenerator.disconnect(this.master);
			noiseGenerator = null;
			noiseBuffer = null;
		}, length * 1000);

		// Start.
		const type = null;
		await this._start(type, [0], volume, length);
	}
};

// Master sound.
pico.sound = new pico.Sound();
pico.melody = new pico.Melody();
pico.sound8bit = new pico.Sound8bit();
