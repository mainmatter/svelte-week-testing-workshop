<script>
	const { name } = $props();
	const trimmed = $derived(name.trim());
</script>

{#if trimmed}
	Your name is {name}
{:else}
	You need to provide a name
{/if}
