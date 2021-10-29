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
			langName: "German",
			value: "",
			textarea: undefined as HTMLTextAreaElement,
		},
		{
			lang: "en",
			langName: "English",
			value: "",
			textarea: undefined as HTMLTextAreaElement,
		},
	];

	let requestsMade: number = 0;
	let latestResponse: number = 0;

	const languagePromise: Promise<
		{
			code: string;
			name: string;
		}[]
	> = (async () =>
		await (await window.fetch(`${translateURL}/languages`)).json())();

	let languages: {
		code: string;
		name: string;
	}[] = [];

	const getTranslation = (isFirstTextarea: boolean) => async (evt?: Event) => {
		const value: string = (
			(evt?.target as HTMLTextAreaElement) || langs[+!isFirstTextarea]
		).value.trim();
		if (!value)
			return void window.setTimeout(() => (langs[+isFirstTextarea].value = ""));
		const requestNr: number = requestsMade++;
		const res: Response = await window.fetch(
			`${translateURL}/translate`, //
			{
				method: "POST",
				body: JSON.stringify({
					q: value,
					source: langs[+!isFirstTextarea].lang,
					target: langs[+isFirstTextarea].lang,
					format: "text",
				}),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (res.ok) {
			if (requestNr >= latestResponse) {
				langs[+isFirstTextarea].value = (await res.json())?.translatedText;
				latestResponse = requestNr;
			}
		} else {
			console.error(
				`Reqest failed with status ${res.status} (${res.statusText})`,
			);
		}
	};

	const switchLangs = () => (evt?: Event) => {
		const textarea = focusedTextarea;
		langs = langs.reverse();
		getTranslation(textarea !== 1)();
		(
			document
				.querySelector("section.translations")
				.children[(focusedTextarea + 1 || 1) - 1]?.querySelector(
					"textarea",
				) as HTMLTextAreaElement
		)?.focus();
		window.setTimeout(() => {
			focusedTextarea = textarea;
		}, 250);
	};

	const textareaFocus = (textarea: number, focus: boolean) => (evt?: Event) => {
		if (focus) {
			focusedTextarea = textarea;
		} else {
			window.setTimeout(() => {
				if (focusedTextarea === textarea) {
					focusedTextarea = -1;
				}
			}, 250);
		}
	};

	onMount(async () => {
		window.addEventListener("keypress", (evt: KeyboardEvent) => {
			if (evt.code === "KeyS" && evt.ctrlKey && evt.shiftKey) {
				switchLangs()();
			}
			if (!evt.ctrlKey && !evt.altKey && !evt.metaKey && focusedTextarea < 0) {
				langs[0].textarea?.focus();
			}
		});
		window.addEventListener("focus", (evt: FocusEvent) => {
			window.setTimeout(() => langs[0].textarea?.focus(), 100);
		});
		langs[0].textarea?.focus();
		languages = await languagePromise;
	});
</script>

<svelte:head>
	<!---->
</svelte:head>

<div class="top-bar">
	<button on:click={switchLangs()} class="bi-arrow-left-right switch-langs" />
</div>

<section class="translations">
	{#each [...Array(2)] as _, i (i)}
		<div class="translation from">
			<textarea
				tabindex={1}
				placeholder={i - +(focusedTextarea !== 1)
					? `Type ${langs[+(focusedTextarea === 1)].langName} here`
					: `See ${langs[+(focusedTextarea !== 1)].langName} translation here`}
				on:focus={textareaFocus(i, true)}
				on:blur={textareaFocus(i, false)}
				on:input={getTranslation(!i)}
				bind:value={langs[i].value}
				bind:this={langs[i].textarea}
				spellcheck={false}
			/>
			<Languages
				{languagePromise}
				bind:selectedLang={langs[i].lang}
				on:change={() => {
					getTranslation(focusedTextarea !== 1)();
					langs[i].langName = languages.filter(
						({ code }) => code === langs[i].lang,
					)[0].name;
				}}
			/>
		</div>
	{/each}
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

				&::placeholder {
					color: var(--col-a);
				}
			}
		}
	}
</style>
