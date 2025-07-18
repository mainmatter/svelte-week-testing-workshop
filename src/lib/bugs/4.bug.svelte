<script>
	import { locale, locales, getSystemLocale } from '$lib/locale.svelte.js';
	let open = $state(false);
</script>

<button>
	Current locale: {locale.current ?? getSystemLocale()}
</button>
{#if open}
	<ul>
		<li>
			<button onclick={() => (locale.current = undefined)}>System locale</button>
		</li>
		{#each locales as locale_option (locale_option)}
			<li>
				<button onclick={() => (locale.current = locale_option)}>
					{locale_option}
				</button>
			</li>
		{/each}
	</ul>
{/if}
