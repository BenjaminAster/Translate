<script lang="ts">
	export let languages: Promise<{ name: string; code: string }[]>;
	export let selectedLang: string;
</script>

<ul class="langs">
	{#await languages}
		<p>Loading languages... <span class="bi-arrow-repeat spin" /></p>
	{:then languages}
		{#each languages as language}
			<li>
				<button
					class:active={selectedLang === language.code}
					on:click={() => (selectedLang = language.code)}
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
				border: 2px solid var(--col-a) {
					radius: 99vmax;
				}
				background-color: var(--col-1);
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
