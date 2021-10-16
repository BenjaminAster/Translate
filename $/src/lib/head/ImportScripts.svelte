<script lang="ts">
	import { base as basePath } from "$app/paths";

	const moduleImportScripts: string[] = [
		// "/firebase/app.js",
		// "/firebase/database.js",
		// "/firebase/analytics.js",
		// "/firebase/init.js",
	];

	const preconnectURLs: string[] = [
		// "https://storage.googleapis.com",
		// "https://cdnjs.cloudflare.com",
	];

	const scriptHTML = `\n\<script type="module"\>\n${
		moduleImportScripts
			.map((val: string) => `\timport ${JSON.stringify(val)};\n`)
			.join("") + //
		moduleImportScripts
			? "\n\n"
			: ""
	}\t//\# sourceMappingURL=${basePath}/_/sourcemap.js.map\n\<\/script\>\n`;
</script>

{#each preconnectURLs as preconnectURL, i}
	{i ? "\n" : ""}<link rel="preconnect" href={preconnectURL} />
{/each}

{#each moduleImportScripts as importScript, i}
	{i ? "\n" : ""}<link rel="modulepreload" href={importScript} />
{/each}

{@html scriptHTML}
