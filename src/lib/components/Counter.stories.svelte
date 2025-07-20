<script module lang="ts">
	import Counter from '$lib/components/Counter.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';
	import { flushSync } from 'svelte';

	const { Story } = defineMeta({
		component: Counter,
		title: 'Components/Counter'
	});
</script>

<Story
	name="Default"
	play={async ({ canvas, step }) => {
		await step('click the button', () => {
			const button = canvas.getByRole('button');
			button.click();
			flushSync();
			expect(button).toHaveTextContent('1');
		});
	}}
/>
