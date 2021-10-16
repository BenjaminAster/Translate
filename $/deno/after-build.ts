
import {
	expandGlob,
	ensureDir,
	walk,
} from "https://deno.land/std@0.97.0/fs/mod.ts";

import {
	parse as parseJSONC,
} from "https://deno.land/x/jsonc@1/main.ts";

let sleep = (ms: number): Promise<void> =>
	new Promise((resolve: () => void) => globalThis.setTimeout(resolve, ms));

const waitTime: number = 50;

const {
	version,
	timestamp,
	appDir,
	srcDir,
	basePath,
} = await (async () => {
	const appDir = "_";
	return JSON.parse(await Deno.readTextFile(`./static/${appDir}/info.json`));
})();

await sleep(waitTime);

{
	await ensureDir("./.svelte-kit");

	await sleep(waitTime);

	await Deno.remove("./.svelte-kit", { recursive: true });

	await sleep(waitTime);

	await ensureDir("./node_modules");

	await sleep(waitTime);

	await Deno.remove("./node_modules", { recursive: true });
}

await sleep(waitTime);

{
	// CREATE SOURCEMAP, MINIFY JSON & CREATE FILESTOCACHE.JSON

	let sourcePaths: string[] = [];
	const sourceMapName: string = "sourcemap.js.map";

	const filesToCacheFileName: string = "filestocache.json";
	let filesToCache: string[] = JSON.parse(await Deno.readTextFile(`./static/${appDir}/${filesToCacheFileName}`));

	for await (const entry of walk("../")) {
		entry.path = entry.path.replace(/\\/g, "/");

		if (
			entry.isFile
			&& !entry.path.includes(`/v/`)
			&& !entry.path.includes(`/.git/`)
		) {
			sourcePaths.push(entry.path);

			if (
				!entry.path.startsWith(`../${srcDir}/`)
				&& !entry.path.startsWith(`../.vscode/`)
			) {
				if (!entry.name.endsWith(".map")) {
					filesToCache.push(entry.path.replace(/^\.\.\//, "./").replace(/\/index\.html$/, "/"));
				}

				if (
					entry.name.endsWith(".json")
					|| entry.name.endsWith(".webmanifest")
					|| entry.name.endsWith(".jsonc")
				) {
					let fileJSON = parseJSONC(await Deno.readTextFile(entry.path));

					if (entry.name.endsWith(".webmanifest")) {
						fileJSON.version = version.toString();
					}

					if (
						entry.name.endsWith(".jsonc")
					) {
						await Deno.remove(entry.path);
					}

					await Deno.writeTextFile(
						entry.path.replace(/\.jsonc$/, ".json").replace(/\.webmanifest\.json$/, ".webmanifest"),
						JSON.stringify(fileJSON),
					);
				}

				if (entry.name === "index.html") {
					let fileContent = await Deno.readTextFile(entry.path);
					const serviceWorkerOptions = {
						scope: `${basePath}/`,
					};
					fileContent = fileContent.replace(
						`navigator.serviceWorker.register('/service-worker.js');`,

						`new URL(location.href).searchParams.has("no-sw") ${"||"
						} navigator.serviceWorker.register("./service-worker.js", ${ //
						JSON.stringify(serviceWorkerOptions)
						});`,
					);
					await Deno.writeTextFile(entry.path, fileContent);
				}

				if ((new RegExp(`../${appDir}/chunks/vendor-.+\\.js`)).test(entry.path)) {
					let fileContent = await Deno.readTextFile(entry.path);

					fileContent = fileContent.replace(/\/\*(\*|!)(\s|\*)((.|\n)+?)\*\//g, "\n");

					await Deno.writeTextFile(entry.path, fileContent);
				}

				if ((new RegExp(`../${appDir}/start-.+\\.js`)).test(entry.path)) {
					let fileContent = await Deno.readTextFile(entry.path);

					fileContent = fileContent.replaceAll(`import("./pages/`, `import("${basePath}/${appDir}/pages/`);

					await Deno.writeTextFile(entry.path, fileContent);
				}
			}
		}
	}

	await Deno.writeTextFile(`../${appDir}/${filesToCacheFileName}`, JSON.stringify(filesToCache.sort()));

	sourcePaths = [
		`../${appDir}/${sourceMapName}`,
		...sourcePaths,
		// "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.js",
		// "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.js",
		"https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.js",
		"https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.js",
	].sort()

	let sourceMap = {
		version: 3,
		mappings: "",
		sources: sourcePaths,
	}

	await Deno.writeTextFile(`../${appDir}/${sourceMapName}`, JSON.stringify(sourceMap, null, "\t"));
}

{
	// CONSOLE LOG

	console.log(
		`\n%c  ✔ FINISHED   %cby Benjamin Aster   %cVersion ${version}   %c(${new Date(timestamp).toLocaleString()})`,

		`color: lime;   font-weight: bold;`,
		`color: yellow; font-weight: bold;`,
		`color: aqua;   font-weight: bold;`,
		`color: orange; font-weight: bold;`,
	);

}

