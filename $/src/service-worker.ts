
import { build, files, timestamp } from '$service-worker';

console.log({ build, files });

// import { base as basePath } from "$app/paths";

// import basePath from "../base-path.js";
// new RegExp(`^${basePath}/`),

// @ts-ignore
importScripts("/workbox-sw.js");

workbox.setConfig({
	debug: false,
});

console.log("hi from service-worker.js");

workbox.routing.registerRoute(
	/.*/,
	new workbox.strategies.CacheFirst({}),
);

// self.addEventListener("install", async (evt: Event) => {
// });

// self.addEventListener("activate", async (evt: Event) => {
// });

