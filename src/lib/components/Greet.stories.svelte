<script module lang="ts">
	import Greet from '$lib/components/Greet.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect } from 'storybook/test';

	const { Story } = defineMeta({
		component: Greet,
		title: 'Components/Greet',
		argTypes: {
			name: { control: 'text' }
		}
	});
</script>

<Story
	name="Default"
	args={{ name: 'World' }}
	play={({ canvas }) => {
		const header = canvas.getByRole('heading');
		expect(header).toHaveTextContent('Hello World');
	}}
/>
<Story
	name="Svelte"
	args={{ name: 'Svelte' }}
	play={({ canvas }) => {
		const header = canvas.getByRole('heading');
		expect(header).toHaveTextContent('Hello Svelte');
	}}
/>
