const CACHE = "regul-v1";

function isRegulPath(pathname) {
  return /\/regul(\/|$)/.test(pathname);
}

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith("regul-") && key !== CACHE).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

function put(cache, request, response) {
  if (!response || !response.ok || response.type !== "basic") return Promise.resolve();
  return cache.put(request, response.clone()).catch(() => undefined);
}

function fromRegulClient(event, request) {
  const clientPromise = event.clientId ? self.clients.get(event.clientId) : Promise.resolve(null);
  return clientPromise.then((client) => {
    if (client && isRegulPath(new URL(client.url).pathname)) return true;
    const referer = request.headers.get("referer");
    if (!referer) return false;
    try {
      return isRegulPath(new URL(referer).pathname);
    } catch {
      return false;
    }
  });
}

function cachedDocument(cache, url) {
  return cache.keys().then((keys) => {
    const target = url.pathname.replace(/\/$/, "");
    const matches = keys.filter((key) => {
      const keyUrl = new URL(key.url);
      return keyUrl.origin === url.origin && keyUrl.pathname.replace(/\/$/, "") === target && keyUrl.search.indexOf("_rsc") === -1;
    });
    if (!matches.length) return undefined;
    return cache.match(matches[0]);
  });
}

function networkFirst(request, documentUrl) {
  return caches.open(CACHE).then((cache) =>
    fetch(request)
      .then((response) => put(cache, request, response).then(() => response))
      .catch(() =>
        cache.match(request).then((exact) => {
          if (exact) return exact;
          if (!documentUrl) {
            return new Response("Hors ligne", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
          }
          return cachedDocument(cache, documentUrl).then(
            (hit) =>
              hit ||
              new Response("Hors ligne", {
                status: 503,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
              })
          );
        })
      )
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isRegulPath(url.pathname)) {
    event.respondWith(networkFirst(request, request.mode === "navigate" ? url : null));
    return;
  }

  if (url.pathname.indexOf("/_next/static/") === 0) {
    event.respondWith(
      fromRegulClient(event, request).then((fromRegul) => (fromRegul ? networkFirst(request, null) : fetch(request)))
    );
  }
});

self.addEventListener("message", (event) => {
  const urls = event.data && event.data.type === "CACHE_URLS" ? event.data.urls : null;
  if (!urls || !urls.length) return;

  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        urls.map((entry) =>
          fetch(new Request(entry, { credentials: "same-origin" }))
            .then((response) => put(cache, entry, response))
            .catch(() => undefined)
        )
      )
    )
  );
});
