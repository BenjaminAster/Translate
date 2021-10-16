<!-- # -->
<script lang="ts">
	import { onMount } from "svelte";
	import {
		fade,
		blur,
		fly,
		slide,
		scale,
		draw,
		crossfade,
	} from "svelte/transition";

	import {
		zipFiles, //
		colorTheme, //
	} from "$lib/utils";

	import { PWA } from "$lib/pwa/";

	let showAppIcon = false;

	let isFullscreen: boolean = false;

	onMount(async () => {
		window.addEventListener("message", ({ data }) => {
			if (data.msg === "installedStatusChange") {
				showAppIcon = !data.isInstalled;
			}
		});

		const fullscreenMatch: MediaQueryList = window.matchMedia(
			"(display-mode: fullscreen)",
		);

		isFullscreen = fullscreenMatch.matches;

		fullscreenMatch.onchange = (evt: MediaQueryListEvent) => {
			isFullscreen = evt.matches;
		};
	});
</script>

<nav>
	<section class="buttons">
		<button
			title="share"
			class="bi-share-fill"
			on:click={() => {
				navigator.share?.({
					url: location.href,
					title: document.title,
					text: document.title,
				});
			}}
		/>

		<button
			title="pop out window"
			class="bi-box-arrow-up-right"
			on:click={async () => {
				window.open(location.href, "_blank", "location=yes");
			}}
		/>

		<button
			title="clear cache & reload"
			class="bi-arrow-clockwise"
			on:click={PWA.clearCacheAndReload}
		/>

		<button
			title="download source code as ZIP"
			class="bi-file-earmark-zip-fill"
			on:click={zipFiles}
		/>

		<button
			class="theme-toggle-labels"
			title="toggle light theme"
			on:click={colorTheme.store}
		>
			<label for="theme-1" class="bi-moon-fill" />
			<label for="theme-2" class="bi-moon" />
			<label for="theme-0" class="bi-sun-fill" />
		</button>

		<button
			title="switch fullscreen mode"
			class="bi-{isFullscreen ? 'fullscreen-exit' : 'fullscreen'}"
			on:click={async () => {
				if (!isFullscreen) {
					isFullscreen = true;
					await document.documentElement.requestFullscreen?.();
				} else if (document.fullscreenElement) {
					isFullscreen = false;
					await document.exitFullscreen?.();
				}
			}}
		/>

		<button
			transition:scale
			title={showAppIcon
				? "install PWA (Progressive Web App)"
				: "download website to work offline"}
			class="bi-{showAppIcon ? 'app-indicator' : 'download'}"
			on:click={PWA.installAppOrDownload}
		/>
	</section>
</nav>

<style lang="scss">
	nav {
		// padding: 1rem;
		margin: 1rem;

		// border-radius: 1em;
		vertical-align: middle;
		text-align: center;

		@media (hover: none) {
			font-size: 1.3em;
		}

		.buttons {
			// margin-bottom: 0.8rem;
			display: inline-flex;
			flex-wrap: wrap;
			max-width: 100%;
			justify-content: center;
			gap: 3px;

			button {
				background-color: var(--col-3);
				font-size: 1.2em;

				$padding: 0.4em 0.55em;
				padding: $padding;

				white-space: nowrap;

				border: none {
					radius: 0;
				}

				&.theme-toggle-labels {
					padding: 0;
					label[for] {
						padding: $padding;
						display: none;
					}
				}

				$radius: 0.6em;
				&:first-of-type {
					border-radius: $radius 0 0 $radius;
				}

				&:last-of-type {
					border-radius: 0 $radius $radius 0;
				}

				@media (hover) {
					&:hover {
						background-color: var(--col-38);
					}
				}

				&:active {
					background-color: var(--col-48);
				}
			}
		}
	}
</style>
