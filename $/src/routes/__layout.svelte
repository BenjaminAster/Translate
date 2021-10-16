<!-- # -->
<script context="module" lang="ts">
	import { browser } from "$app/env";

	export async function load({ page, fetch, session, context }) {
		const baseFolder = browser ? "./" : "/";
		const renderInfo = await (await fetch(`${baseFolder}_/info.json`)).json();

		return {
			props: {
				renderInfo,
			},
		};
	}
</script>

<script lang="ts">
	import "../styles/global.scss";
	import { onMount } from "svelte";

	import GlobalHead from "$lib/head/GlobalHead.svelte";

	import { onMountFunction } from "$lib/global";

	import Navbar from "$lib/navbar/Navbar.svelte";
	import NoScript from "$lib/navbar/NoScript.svelte";

	export let renderInfo;

	onMount(async () => {
		await onMountFunction();
	});
</script>

<svelte:head>
	{#if !browser}
		<GlobalHead {renderInfo} />
	{/if}

	<title>Translate</title>
</svelte:head>

<!-- svelte-ignore missing-declaration -->

<input type="radio" name="theme-toggle" id="theme-0" hidden />
<input type="radio" name="theme-toggle" id="theme-1" hidden checked />
<input type="radio" name="theme-toggle" id="theme-2" hidden />

<section id="actual-content">
	<NoScript />

	<Navbar />

	<main>
		<slot />
	</main>

	<footer>
		&copy;
		<!---->
		2021 Benjamin Aster
		<!---->
		&bull;
		<span class="version">
			v{renderInfo.version}
		</span>
	</footer>
</section>

<style lang="scss">
	@import "../styles/functions-mixins";

	#actual-content {
		background-color: var(--col-08);

		// position: absolute;
		// top: 0;
		// left: 0;
		// right: 0;

		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		padding: 1rem;
		text-align: center;

		flex-grow: 1;
	}

	footer {
		padding: 0.5em;
		background-color: var(--col-1);
		text-align: center;

		.version {
			background-color: var(--col-2);
			border-radius: 0.4em;
			padding: 0.3em 0.5em;
		}
	}
</style>
