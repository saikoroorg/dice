// Web app manifest for progressive web app.
const manifest = {
    "name": "Dice",
    "version": "0.8.11001d",
    "short_name": "Dice",
    "background_color": "#000",
    "theme_color": "#000",
    "icons": [{
        "src": "./icon.svg",
        "sizes": "300x300",
        "type": "image/svg"
    },{
        "src": "./icon.png",
        "sizes": "192x192",
        "type": "image/png"
    }],
    "start_url": "./?app",
    "scope": "/dice/",
    "display": "standalone",
    "json": "manifest.json"
};

// Script for client to register service worker.
if (!self || !self.registration) {
    navigator.serviceWorker.register("./manifest.js", {"scope": manifest.scope}).then(() => {
        let head = document.getElementsByTagName("head")[0];
        let link = document.createElement("link");
        link.setAttribute("rel", "manifest");
        link.setAttribute("href", manifest.json);
        head.appendChild(link);
    });

// Script for service worker.
} else {
    const identifier = manifest.name + "/" + manifest.version;

    // Event on installing service worker.
    self.addEventListener("install", (evt) => {

        // Cache all contents.
        evt.waitUntil(caches.open(identifier).then((cache) => {

            // Contents to cache.
            // (need to set relative path "./" or absolute path "/")
            const contents = ["./"];
            return cache.addAll(contents).then(() => self.skipWaiting());
        }));
    });

    // Event on activating service worker.
    self.addEventListener("activate", (evt) => {

        // Delete old cache files when the cache version updated.
        evt.waitUntil(caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key != identifier) {
                    return caches.delete(key);
                }
            }));
        }));
    });

    // Event on fetching network request.
    self.addEventListener("fetch", (evt) => {

        // Returns manifest.
        let reqCloned = evt.request.clone();
        if (reqCloned.url.match(manifest.json + "$")) {

            let res = new Response(JSON.stringify(manifest),
                {"status": 200, "statusText": "OK",
                 "headers": {"Content-Type": "application/json"}});
            evt.respondWith(res);

        // Returns the cache file that matches the request.
        } else {
            evt.respondWith(caches.match(reqCloned, {ignoreSearch: true}).then((res) => {

                // Fetch if not found.
                return res || fetch(reqCloned).then((res) => {

                    // Cache the fetched file.
                    if (res.ok) {
                        let resCloned = res.clone();
                        caches.open(identifier).then((cache) => {
                            cache.put(evt.request, resCloned);
                        });
                    }

                    // Returns the fetched file.
                    return res;
                });
            }));
        }
    });
}
