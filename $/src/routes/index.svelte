<!---->
<script lang="ts">
	import { onMount } from "svelte";

	import Languages from "$lib/translate/Languages.svelte";

	const translateURL: string = "https://translate.argosopentech.com";
	// https://translate.astian.org/translate
	// https://translate.argosopentech.com

	let focusedTextarea: number = -1;

	let langs = [
		{
			lang: "de",
			value: "hallo",
		},
		{
			lang: "en",
			value: "hello",
		},
	];

	let requestsMade: number = 0;
	let latestResponse: number = 0;

	let languages: Promise<
		{
			code: string;
			name: string;
		}[]
	> = (async () =>
		await (await window.fetch(`${translateURL}/languages`)).json())();

	const getTranslation = (isFirstTextarea: boolean) => async (evt: Event) => {
		const value: string = (evt.target as HTMLTextAreaElement).value.trim();
		if (!value)
			return void setTimeout(() => (langs[Number(isFirstTextarea)].value = ""));
		const requestNr: number = requestsMade++;
		const res: Response = await window.fetch(
			`${translateURL}/translate`, //
			{
				method: "POST",
				body: JSON.stringify({
					q: value,
					source: langs[Number(!isFirstTextarea)].lang,
					target: langs[Number(isFirstTextarea)].lang,
					format: "text",
				}),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (res.ok) {
			if (requestNr >= latestResponse) {
				langs[Number(isFirstTextarea)].value = (
					await res.json()
				)?.translatedText;
				latestResponse = requestNr;
			}
		} else {
			console.error(
				`Reqest failed with status ${res.status} (${res.statusText})`,
			);
		}
	};

	const switchLangs = () => (evt: Event) => {
		langs = langs.reverse();
		(
			document
				.querySelector("section.translations")
				.children[focusedTextarea]?.querySelector(
					"textarea",
				) as HTMLTextAreaElement
		)?.focus();
	};

	const textareaFocus = (textarea: number, focus: boolean) => (evt: Event) => {
		if (focus) {
			focusedTextarea = textarea;
		} else {
			window.setTimeout(() => {
				if (focusedTextarea === textarea) {
					focusedTextarea = -1;
				}
			}, 250);
		}
		console.log({ textarea, focus, focusedTextarea });
	};

	onMount(async () => {
		languages = await (await window.fetch(`${translateURL}/languages`)).json();
	});
</script>

<svelte:head>
	<!---->
</svelte:head>

<div class="top-bar">
	<button on:click={switchLangs()} class="bi-arrow-left-right switch-langs" />
</div>

<section class="translations">
	<div class="translation from">
		<textarea
			tabindex={1}
			on:focus={textareaFocus(0, true)}
			on:blur={textareaFocus(0, false)}
			on:input={getTranslation(true)}
			bind:value={langs[0].value}
			spellcheck={false}
		/>
		<Languages {languages} bind:selectedLang={langs[0].lang} />
	</div>
	<div class="translation to">
		<textarea
			tabindex={1}
			on:focus={textareaFocus(1, true)}
			on:blur={textareaFocus(1, false)}
			on:input={getTranslation(false)}
			bind:value={langs[1].value}
			spellcheck={false}
		/>
		<Languages {languages} bind:selectedLang={langs[1].lang} />
	</div>
</section>

<!---->
<style lang="scss">
	@import "../styles/functions-mixins";

	.top-bar {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 0;

		button.switch-langs {
			z-index: 1;
			width: 2em;
			height: 2em;
			aspect-ratio: 1;
			font-size: 1.1em;
			background-color: var(--col-3);
			transform: translateY(-0.25em);
			border: none {
				radius: 99vmax;
			}
			box-shadow: 0 0 0 0.3em var(--col-08);

			@media (hover) {
				&:hover {
					background-color: var(--col-5);
				}
			}
			&:active {
				background-color: var(--col-6);
			}

			&::before {
				transform: translateY(0.08em);
			}
		}
	}

	.translations {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		gap: 1em;
		.translation {
			flex-grow: 1;
			flex-basis: 1;
			textarea {
				outline: none;
				height: 5em;
				padding: 0.6em;
				font-size: 1.2em;
				font-family: inherit;
				min-height: 10em;
				width: 100%;
				background-color: var(--col-3);
				border: none {
					radius: 0.4em;
				}
				box-shadow: 0 0 0.5em 0.2em var(--col-0);
				resize: vertical;
				// overflow: visible;
				// overflow-y: hidden;
				&:focus {
					background-color: var(--col-4);
				}
			}
		}
	}
</style>
