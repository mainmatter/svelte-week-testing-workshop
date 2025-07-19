<script module lang="ts">
	export { children };
</script>

{#snippet children(item: { id: string; name: string })}
	<div class="autocomplete-item">
		{item.name}
	</div>
{/snippet}
