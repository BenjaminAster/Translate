<!-- # -->
<script context="module" lang="ts">
	export function load({ error, status }) {
		return {
			props: {
				title: `${status}: ${error.message}`,
			},
		};
	}
</script>

<script lang="ts">
	import { onMount } from "svelte";
	import { browser } from "$app/env";

	let online = true;

	export let title;

	onMount(() => {
		online = navigator.onLine;

		window.addEventListener("online", () => (online = true));
		window.addEventListener("offline", () => (online = false));
	});
</script>

<h2>
	<span class="bi-exclamation-triangle-fill warning-triangle" />

	{#if online}
		Something went wrong. Try clicking the
		<span class="bi-arrow-clockwise" />-refresh button
	{:else}
		You are currently offline. Make sure you're connected to the internet and
		try again
	{/if}
	or return <a href="./">home</a>.
</h2>

<p>Error message: <br /> {title} </p>

<slot />

<style lang="scss">
	@import "../styles/functions-mixins";

	* {
		$red-col: #{darkLight(tomato, crimson)};
		&,
		& *:not(a) {
			color: $red-col;
		}

		.warning-triangle {
			padding: 0.2em 0.32em;
			background-color: $red-col;
			color: var(--col-0);
			border-radius: 0.3em;
		}
	}
</style>
