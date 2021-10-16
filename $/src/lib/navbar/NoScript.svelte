<!-- # -->

<noscript>
	<input type="checkbox" id="javascript-banner-x" hidden />
	<section>
		<strong class="message">
			You have to enable JavaScript for this site to work.
		</strong>
		<label for="javascript-banner-x">
			<span class="bi-x-lg x" />
		</label>
		<style>
			.no-transition,
			.no-transition * {
				transition: var(--transition-props);
			}
		</style>
	</section>
</noscript>

<style lang="scss">
	@import "../../styles/functions-mixins";

	section {
		display: flex;
		align-items: center;
		text-align: center;
		padding: 0.2em;
		background-color: #{darkLight(tomato, firebrick)};
		color: var(--col-0);

		.message {
			width: 100%;
			letter-spacing: 0.3px;
		}

		* {
			color: inherit;
		}

		#javascript-banner-x:checked ~ & {
			display: none;
		}

		label {
			$width: 1.2em;
			width: $width;
			height: $width;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: var(--col-f);
			border-radius: 50%;
			margin-left: 0.5em;

			.x {
				font-size: 0.7em;
			}

			@media (hover) {
				&:hover {
					background-color: var(--col-c);
				}
			}

			&:active {
				background-color: var(--col-9);
			}
		}
	}
</style>
