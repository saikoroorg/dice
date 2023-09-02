// Service worker.
Worker = class {
	constructor() {
		this.background = "./background.js"; // This script file.
		this.manifest = "./manifest.json"; // Manifest file.
		this.contents = ["./"]; // Prefetch contents file.
		this.replacing = null; // Replacing strings by manifest json.
		this.cacheKey = null; // Cache key.
	}

	// Get file from cache or fetch.
	cacheOrFetch(req, cacheKey) {
		return new Promise((resolve) => {

			// Get cached file.
			console.log("Get cached file: " + req.url + " from " + cacheKey);
			self.caches.open(cacheKey).then((cache) => {
				cache.match(req, {ignoreSearch: true}).then((res) => {
					console.log("Found cached file. -> " + res.statusText);
					resolve(res);
				}).catch((error) => {

					// Not found cached file.
					console.log("Not found cached file: " + req.url);
					this.fetchAndCache(req, cacheKey).then((res) => {
						resolve(res);
					});
				})
			});
		});
	}

	// Delete old cache files when the cache version updated.
	deleteOldCache(cacheKey) {
		return self.caches.keys().then((keys) => {
			return Promise.all(keys.map((key) => {
				if (key != cacheKey && key != "*") {
					console.log("Delete old cache: " + key);
					return self.caches.delete(key);
				}
			}));
		});
	}

	// Fetch and cache.
	fetchAndCache(req, cacheKey) {
		console.log("Fetch and cache: " + req.url);

		// Cache the fetched file.
		return fetch(req).then((res) => {
			if (res.ok) {
				let contentType = res.headers.get("Content-Type");
				if (!contentType.match("text/html")) {

					console.log("Cache the fetched file: " + req.url + " to " + cacheKey + " -> " + res.statusText);
					self.caches.open(cacheKey).then((cache) => {
						cache.put(req.url, res.clone());
					});

					// Returns fetched response.
					console.log("Returns fetched response. -> " + res.statusText);
					return res.clone();

				// Replace fetched html file.
				} else {
					return new Promise((resolve) => {
						res.text().then((text) => {

							// Replace strings by manifest.
							if (this.replacing) {
								if (this.replacing.version) {
									text = text.replace("<!--$version-->", "#" + this.replacing.version.substr(-4));
								}
								if (this.replacing.author && this.replacing.name) {
									text = text.replace("<!--$author-->", this.replacing.author + "/" + this.replacing.name);
								}
								if (this.replacing.short_name) {
									text = text.replace("<!--$title-->", this.replacing.short_name);
								}
								console.log("Replaced: " + text.replace(/\s+/g, " ").substr(-1000));
							}

							// Replaced responce.
							let options = {status: res.status,
								 statusText: res.statusText,
								 headers: res.headers};
							res = new Response(text, options);

							// Cache the replaced file.
							console.log("Cache the replaced file: " + req.url + " to " + cacheKey + " -> " + res.statusText + " : " + text.replace(/\s+/g, " ").substr(-1000));
							self.caches.open(cacheKey).then((cache) => {
								cache.put(req.url, res.clone());
							});

							// Resolves by replaced response.
							console.log("Resolves by replaced response. -> " + res.statusText);
							resolve(res.clone());
						});
					});
				}

			// File not found.
			} else {
				console.log("File not found: " + req.url + " -> " + res.statusText);
				return res;
			}
		});
	}

	// Fetch and cache all.
	fetchAndCacheAll(reqs, cacheKey) {
		return reqs.then((reqs) => {
			return Promise.all(reqs.map((req) => {
				return this.fetchAndCache(req, cacheKey);
			}));
		});
	}

	// Get manifest file from cache or fetch to start.
	start() {
		return new Promise((resolve) => {
			this.cacheOrFetch(new Request(this.manifest), "*", null).then((res) => {
				if (res.ok) {
					res.json().then((manifest) => {
						console.log("Found manifest: " + JSON.stringify(manifest));
						this.replacing = manifest;
						this.cacheKey = manifest.name + "/" + manifest.version;
						resolve(manifest);
					});
				}
			});
		});
	}

	// Fetch manifest file to renew.
	renew() {
		return this.fetchAndCache(this.manifest, "*", null);
	}
};
var worker = new Worker();

// Script for client to register worker.
if (!self || !self.registration) {

	// Register worker.
	if (worker.background) {
		if (navigator.serviceWorker) {
			console.log("Register worker: " + worker.background);
			(async()=>{
				await navigator.serviceWorker.register(worker.background);
			})();
		}
	}

// Script for worker.
} else {

	// Event on installing worker.
	self.addEventListener("install", (evt) => {
		console.log("Install worker: " + worker.background);

		// Read manifest file.
		evt.waitUntil(worker.start());

		// Delete old cache files when the cache version updated.
		evt.waitUntil(worker.deleteOldCache());

		// Prefetch and cache all new contents.
		evt.waitUntil(worker.fetchAndCacheAll(worker.contents, worker.cacheKey));

		// Update manifest file for next install.
		worker.renew();
	});

	// Event on activating worker.
	self.addEventListener("activate", (evt) => {
		console.log("Activate worker: " + worker.background);
	});

	// Event on fetching network request.
	self.addEventListener("fetch", (evt) => {
		console.log("Fetch by worker: " + evt.request.url);

		// Read manifest file.
		evt.waitUntil(worker.start());

		// Get cache or fetch and return response.
		evt.respondWith(worker.cacheOrFetch(evt.request, worker.cacheKey));
	});
}
