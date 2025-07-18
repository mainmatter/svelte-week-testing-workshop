<script>
	const { user_id, page } = $props();

	$effect(() => {
		const controller = new AbortController();
		(async () => {
			const res = await fetch(`/profile/${user_id}`, {
				signal: controller.signal
			});
			const profile = await res.json();
			navigator.sendBeacon('/analytics', JSON.stringify({ page, profile }));
		})();
		return () => {
			controller.abort();
		};
	});
</script>
