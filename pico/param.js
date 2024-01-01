/* PICO Param module */

// Random.
function picoRandom(max, seed=0) {
	return pico.param.random(max, seed);
}
// Random seed.
function picoSeed() {
	return pico.param.seed();
}
// Time.
function picoTime() {
	return Date.now();
}

// Reload with param.
async function picoReload(url=null) {
	await pico.param.reload(url);
}

// Share params.
async function picoShare(url=null, file=null) {
	await pico.param.share(url, file);
}

// Get all params by one strings.
function picoParams() {
	return pico.param.params();
}

// Reset all params.
function picoResetParams() {
	pico.param.resetParams();
}

// Get all param keys.
function picoKeys() {
	return pico.param.keys();
}

// Get param as strings.
function picoStrings(key=0) {
	return pico.param.strings(key);
}

// Set param as strings.
function picoSetStrings(strings, key=0) {
	return pico.param.setStrings(strings, key);
}

// Get param as numbers.
function picoNumbers(key=0) {
	return pico.param.numbers(key);
}

// Set param as numbers.
function picoSetNumbers(numbers, key=0, separator=".") {
	return pico.param.setNumbers(numbers, key, separator);
}

// Get param as 6bit code.
function picoCode6(key=0) {
	return pico.param.code6(key);
}

// Set param as 6bit code.
function picoSetCode6(code6, key=0) {
	return pico.param.setCode6(code6, key);
}

// Get param as 8bit compatible 6bit code.
function picoCode8(key=0) {
	return pico.param.code8(key);
}

// Set param as 8bit compatible 6bit code.
function picoSetCode8(code8, key=0) {
	return pico.param.setCode8(code8, key);
}

//************************************************************/

// Namespace.
var pico = pico || {};

// Param class.
pico.Param = class {
	static debug = false; // Debug print.

	// Get random count.
	random(max, seed=0) {
		if (seed > 0) {
			this.rand = seed;
		}
		if (max > 0) {

			// Xorshift algorythm.
			this.rand = this.rand ^ (this.rand << 13);
			this.rand = this.rand ^ (this.rand >>> 17);
			this.rand = this.rand ^ (this.rand << 5);
			return Math.abs(this.rand % max);

			// LCG algorythm.
			// this.rand = (this.rand * 9301 + 49297) % 233280;
			// let rand = this.rand / 233280;
			// return Math.round(rand * max);
		}
		return 0;
	}

	// Get random seed.
	seed() {
		return this.rand >>> 0;
	}

	// Reload with param.
	async reload(url=null) {
		await this._reload(url);
	}

	// Share param.
	async share(url=null, files=null) {
		await this._share(url, files);
	}

	// Get all params by one strings.
	params() {
		return this._serialize();
	}

	// Reset all params.
	resetParams() {
		this._reset();
	}

	// Get all param keys.
	keys() {
		return this._keys();
	}

	// Get param as strings.
	strings(key=0) {
		return this._strings(key);
	}

	// Set param as strings.
	setStrings(strings, key=0) {
		this._setStrings(strings, key);
	}

	// Get param as numbers.
	numbers(key=0) {
		return this._numbers(key);
	}

	// Set param as numbers.
	setNumbers(numbers, key=0) {
		this._setNumbers(numbers, key);
	}

	// Get param as 6bit code.
	code6(key=0) {
		return this._code6(key);
	}

	// Set param as 6bit code.
	setCode6(code6, key=0) {
		this._setCode6(code6, key);
	}

	// Get param as 8bit compatible 6bit code.
	code8(key=0) {
		let code6 = this._code6(key)
		return this._expandCode(code6);
	}

	// Set param as 8bit compatible 6bit code.
	setCode8(code8, key=0) {
		const compression = 2;
		let code6 = this._compressCode(code8, compression)
		this._setCode6(code6, key);
	}
	
	//*----------------------------------------------------------*/

	// constructor.
	constructor() {
		//this.lock = "picoParamLock" + Date.now(); // Lock object identifier.
		this.context = [];
		this.rand = Date.now(); // Random seed.

		// Setup now.
		this._setup();

		// Setup after load event.
		//window.addEventListener("load", () => {
		//	this._setup();
		//});
	}

	// Debug print.
	_debug(text) {
		if (pico.Param.debug) {
			console.log(text);
		}
	}

	// Setup param.
	_setup() {
		return new Promise((resolve) => {

			// Loadd query.
			let query = window.location.search;
			if (query != null && query != "") {
				this._debug("Load query: " + query);
				let text = query.slice(1);
				this._deserialize(text);
			}
			return Promise.resolve();
		}); // end of new Promise.
	}

	// Reset param.
	_reset() {
		this.context = [];
	}

	// Reload with param.
	_reload(url=null) {
		return new Promise(async (resolve) => {
			let text = this._serialize();
			if (text != null) {
				let separator = url && url.indexOf("?") < 0 ? "?" : "";
				let query = text ? separator + text : "";
				if (url) {
					this._debug("Jump: " + query);
					window.location.href = url + query;
				} else {
					this._debug("Reload: " + query);
					window.location.search = query;
				}
			}
			return resolve();
		}); // end of new Promise.
	}

	// Share param.
	_share(url=null, files=null) {
		return new Promise(async (resolve) => {
			let text = this._serialize();
			if (text != null) {
				let data = {};
				if (url) {
					let separator = url && url.indexOf("?") < 0 ? "?" : "";
					let query = text ? separator + text : "";
					this._debug("Share query: " + query);
					data.url = url + query;
				} else {
					let query = text ? "?" + text : "";
					this._debug("Flush query: " + query);
					window.history.replaceState(null, "", query);
					data.url = window.location.href.replace(/[\?\#].*$/, '') + query;
				}
				if (files) {
					data.files = files;
				}
				if (navigator.share) {
					this._debug("Share: " + JSON.stringify(data));
					await navigator.share(data).then(() => {
						this._debug('Successful share');
					}).catch((error) => {
						this._debug('Error sharing', error);
					});
				}
			}
			return resolve();
		}); // end of new Promise.
	}

	// Ready to start param.
	_ready() {
		return Promise.resolve();
	}

	// Check the value string contains char.
	_contains(key=0, chars="") {
		if (this.context[key]) {
			if (chars.length <= 0) {
				return true;
			}
			for (let i = 0; i < chars.length; i++) {
				if (this.context[key].includes(chars[i])) {
					return true;
				}
			}
		}
		return false;
	}

	// Get all param keys.
	_keys() {
		return Object.keys(this.context);
	}
	
	// Get value by strings.
	_strings(key=0) {
		return this.context[key];
	}

	// Set value by strings.
	_setStrings(strings, key=0) {
		this.context[key] = strings;
	}

	// Get value by integer numbers.
	_numbers(key=0, separator=/\D/) {
		let results = [];
		if (this.context[key]) {
			let q = this.context[key].split(/[^-\d]/);
			for (var i = 0; i < q.length; i++) {
				if (q[i]) {
					results[i] = parseInt(q[i], 10);
				} else if (i < q.length - 1) {
					results[i] = 0;
				}
			}
		}
		return results;
	}

	// Set value by integer numbers.
	_setNumbers(numbers, key=0, separator=".") {
		this.context[key] = numbers.join(separator);
	}

	// Get number 6bit+1(0-64) array: 0-9 a-z(10-35) A-Z(36-61) .(62) -(63) _(64)
	_code6(key=0) {
		let results = [];
		if (this.context[key]) {
			for (let i = 0; i < this.context[key].length; i++) {
				let c = this.context[key].charCodeAt(i);
				if ("0".charCodeAt(0) <= c && c <= "9".charCodeAt(0)) {
					results[i] = c - "0".charCodeAt(0);
				} else if ("a".charCodeAt(0) <= c && c <= "z".charCodeAt(0)) {
					results[i] = c - "a".charCodeAt(0) + 10;
				} else if ("A".charCodeAt(0) <= c && c <= "Z".charCodeAt(0)) {
					results[i] = c - "A".charCodeAt(0) + 36;
				} else if (c == ".".charCodeAt(0)) {
					results[i] = 62;
				} else if (c == "-".charCodeAt(0)) {
					results[i] = 63;
				} else {
					results[i] = 64;
				}
			}
		}
		return results;
	}

	// Set number 6bit+1(0-64) array: 0-9 a-z(10-35) A-Z(36-61) .(62) -(63) _(64)
	_setCode6(code6, key=0) {
		this.context[key] = "";
		for (let i = 0; i < code6.length; i++) {
			if (0 <= code6[i] && code6[i] < 10) {
				this.context[key] += code6[i];
			} else if (10 <= code6[i] && code6[i] < 36) {
				this.context[key] += String.fromCharCode("a".charCodeAt(0) + code6[i] - 10);
			} else if (36 <= code6[i] && code6[i] < 62) {
				this.context[key] += String.fromCharCode("A".charCodeAt(0) + code6[i] - 36);
			} else if (code6[i] == 62) {
				this.context[key] += ".";
			} else if (code6[i] == 63) {
				this.context[key] += "-";
			} else {
				this.context[key] += "_";
			}
		}
	}

	// Expand code to 8bit code.
	_expandCode(code) {
		const maxbit = 8, maxmask = (1 << maxbit) - 1;
		let results = [];
		for (let i = 0; i < code.length; i++) {
			let r = 0, x = code[i];
			// Expand 8bit compatible 6bit code to 6bit code.
			let b = maxbit, a = (x - 1) & maxmask; // Minus 1 to reserve 0.
			while (b--) { // Bit reverse.
				r <<= 1;
				r |= (a & 1);
				a >>= 1;
			}
			r = r ^ maxmask; // Bit flip.
			this._debug("Expand: " + ("00000000"+x.toString(2)).slice(-8) + " -> " + ("00000000"+r.toString(2)).slice(-8));
			results[i] = r;
		}
		return results;
	}

	// Compress code to 8bit compatible X (8 - compression) bit code.
	// Requires 6 (compression >= 2) bit when encode with ASCII code only.
	_compressCode(code, compression=2) {
		const maxbit = 8, maxmask = (1 << maxbit) - 1;
		let results = [];
		for (let i = 0; i < code.length; i++) {
			let r = 0, x = code[i];
			// Compress 6bit code to 8bit compatible 6bit code.
			let b = maxbit - compression, a = x ^ maxmask; // Bit flip.
			a = a >> compression; // Compress.
			while (b--) { // Bit reverse.
				r <<= 1;
				r |= (a & 1);
				a >>= 1;
			}
			r = (r + 1) % (1 << (maxbit - compression)); // Plus 1 to reserve 0.
			this._debug("Compress: " + ("00000000"+x.toString(2)).slice(-8) + " -> " + ("00000000"+r.toString(2)).slice(-8));
			results[i] = r;
		}
		return results;
	}

	// Deserialize context to parameters.
	_deserialize(context) {
		this.context = [];
		if (context.includes('&')) {
			context.split('&').forEach((q) => {
				if (q.includes('=')) {
					let keyvalue = q.split('=');
					if (keyvalue[0] != null && keyvalue[1] != null) {
						this.context[keyvalue[0]] = keyvalue[1];
					}
				} else if (q.includes('+')) {
					let qs = q.split('+');
					for (var i = 0; i < qs.length; i++) {
						this.context[i] = qs[i];
					}
				} else {
					this.context[0] = q;
				}
			});
		} else if (context.includes('=')) {
			let keyvalue = context.split('=');
			if (keyvalue[0] != null && keyvalue[1] != null) {
				this.context[keyvalue[0]] = keyvalue[1];
			}
		} else if (context.includes('+')) {
			this.context = context.split('+');
		} else {
			this.context[0] = context;
		}
	}

	// Serialize parameters to context.
	_serialize() {
		let param0 = "", params = [];
		for (let key in this.context) {
			if (key != null && this.context[key] != null && this.context[key] != "") {
				if (isNaN(key)) {
					params.push(key + "=" + this.context[key]);
				} else if (param0.length > 0) {
					param0 = param0 + "+" + this.context[key];
				} else {
					param0 = this.context[key];
				}
			}
		}
		if (param0.length > 0) {
			params.unshift(param0);
		}
		return params.join("&");
	}
};

// Master param.
pico.param = new pico.Param();
