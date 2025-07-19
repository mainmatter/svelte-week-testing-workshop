import { render } from 'vitest-browser-svelte';
import { it, expect, describe } from 'vitest';
import Greet from './Greet.svelte';
import { flushSync } from 'svelte';

describe('Greet', () => {
	it('renders correctly', () => {
		const { getByRole } = render(Greet, { name: 'World' });
		expect(getByRole('heading')).toHaveTextContent('Hello World!');
	});

	it('reacts to prop changes', async () => {
		const props = $state({ name: 'World' });

		const { getByRole } = render(Greet, props);
		expect(getByRole('heading')).toHaveTextContent('Hello World!');
		props.name = 'Svelte';
		flushSync();
		expect(getByRole('heading')).toHaveTextContent('Hello Svelte!');
	});

	it('reacts to prop changes single variable', async () => {
		let name = $state('World');

		const { getByRole } = render(Greet, {
			get name() {
				return name;
			}
		});
		expect(getByRole('heading')).toHaveTextContent('Hello World!');
		name = 'Svelte';
		flushSync();
		expect(getByRole('heading')).toHaveTextContent('Hello Svelte!');
	});
});
