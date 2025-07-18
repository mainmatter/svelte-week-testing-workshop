<script>
	const { name } = $props();
	const trimmed = name.trim();
</script>

{#if trimmed}
	Your name is {name}
{:else}
	You need to provide a name
{/if}
