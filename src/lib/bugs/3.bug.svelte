<script>
	let value = $state(10);
</script>

<label
	>Amount (minimum 10):
	<input
		type="number"
		{value}
		oninput={(e) => {
			const new_value = e.currentTarget.valueAsNumber;
			value = Math.max(new_value, 10);
		}}
	/>
</label>
