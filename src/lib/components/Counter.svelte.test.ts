import { render } from 'vitest-browser-svelte';
import { it, expect, describe } from 'vitest';
import Counter from './Counter.svelte';

describe('Counter', () => {
	it('renders correctly', () => {
		const { getByRole } = render(Counter);
		expect(getByRole('button')).toHaveTextContent('0');
	});

	it('increments count on button click', async () => {
		const { getByRole } = render(Counter);
		const button = getByRole('button');
		await button.click();
		expect(getByRole('button')).toHaveTextContent('1');
	});
});
