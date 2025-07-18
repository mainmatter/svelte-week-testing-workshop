<script>
	import { flushSync } from 'svelte';
	let value = $state(10);
</script>

<label
	>Amount (minimum 10):
	<input
		type="number"
		{value}
		oninput={(e) => {
			const new_value = e.currentTarget.valueAsNumber;
			flushSync(() => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				value = 'pls work! 😭';
			});
			value = Math.max(new_value, 10);
		}}
	/>
</label>
