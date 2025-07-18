<script>
	import { locale, locales } from '$lib/locale.svelte.js';
	let open = $state(false);
</script>

<button>
	Current locale: {locale.current}
</button>
{#if open}
	<ul>
		{#each locales as locale_option (locale_option)}
			<li>
				<button onclick={() => (locale.current = locale_option)}>
					{locale_option}
				</button>
			</li>
		{/each}
	</ul>
{/if}
