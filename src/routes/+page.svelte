<script lang="ts">
	let { data } = $props();

	$effect(() => {
		fetch('https://api.example.com/user')
			.then((response) => response.json())
			.then((data) => {
				console.log('User data:', data);
			});
	});
</script>

<pre>{JSON.stringify(data, null, '\t')}</pre>
