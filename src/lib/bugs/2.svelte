<script>
	const { page } = $props();

	$effect(() => {
		navigator.sendBeacon('/analytics', JSON.stringify({ page }));
	});
</script>
