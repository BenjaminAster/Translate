<script lang="ts">
	import { createEventDispatcher } from "svelte";
	const dispach = createEventDispatcher();

	export let languagePromise: Promise<{ name: string; code: string }[]>;
	export let selectedLang: string;
</script>

<ul class="langs">
	{#await languagePromise}
		<p>Loading languages... <span class="bi-arrow-repeat spin" /></p>
	{:then languages}
		{#each languages as language}
			<li>
				<button
					class:active={selectedLang === language.code}
					style={`--color: rgb(${Math.random() * 128 + 128}, ${
						Math.random() * 128 + 128
					}, ${Math.random() * 128 + 128})`}
					on:click={() => {
						selectedLang = language.code;
						dispach("change");
					}}
				>
					{language.name}
				</button>
			</li>
		{/each}
	{/await}
</ul>

<style lang="scss">
	.langs {
		list-style: none;
		display: flex;
		gap: 3px;
		flex-flow: row wrap;
		padding: 0;

		li {
			button {
				padding: 0.4em 0.8em;
				border: 2px solid var(--col-c) {
					radius: 99vmax;
				}
				background-color: var(--col-2);
				@media (hover) {
					&:hover {
						background-color: var(--col-4);
						border-color: var(--col-f);
					}
				}
				&:active {
					background-color: var(--col-b);
					color: var(--col-0);
					border-color: var(--col-f);
				}
				&.active {
					background-color: var(--col-f);
					color: var(--col-0);
					border-color: var(--col-f);
				}
			}
		}
	}
	.spin::before {
		animation: spin 1s linear infinite;

		@keyframes spin {
			to {
				transform: rotate(360deg);
			}
		}
	}
</style>
