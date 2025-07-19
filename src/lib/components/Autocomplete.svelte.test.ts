import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { children } from './Autocomplete.snippets.svelte';
import Autocomplete from './Autocomplete.svelte';

describe('Autocomplete', () => {
	it('renders correctly with default props', () => {
		const { getByPlaceholder } = render(Autocomplete<{ id: string; name: string }>, {
			children,
			get_url(query: string) {
				return `https://api.example.com/search?q=${query}`;
			},
			get_items() {
				return [];
			}
		});
		expect(getByPlaceholder('Type to search...')).toBeInTheDocument();
	});

	it('calls the debounced search function on input', async () => {
		vi.useFakeTimers();
		const fn = vi.fn();
		const { getByLabelText } = render(Autocomplete<{ id: string; name: string }>, {
			children,
			get_url: fn,
			get_items: () => []
		});
		const input = getByLabelText('Search');
		await input.fill('test');
		vi.advanceTimersByTime(100);
		expect(fn).not.toHaveBeenCalledWith('test');
		vi.advanceTimersByTime(300);
		expect(fn).toHaveBeenCalledWith('test');
		vi.useRealTimers();
	});

	it('calls fetch with the result of the get_url', async () => {
		vi.useFakeTimers();
		const og_fetch = globalThis.fetch;
		const new_fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: vi.fn(() => Promise.resolve([{ id: '1', name: 'Test Item' }]))
			})
		);
		// @ts-expect-error aint mocking the whole thing
		globalThis.fetch = new_fetch;
		const { getByLabelText } = render(Autocomplete<{ id: string; name: string }>, {
			children,
			get_url(query) {
				return `https://api.example.com/search?q=${query}`;
			},
			get_items: () => []
		});
		const input = getByLabelText('Search');
		await input.fill('test');
		vi.advanceTimersByTime(300);
		expect(new_fetch).toHaveBeenCalledWith('https://api.example.com/search?q=test');
		vi.useRealTimers();
		globalThis.fetch = og_fetch;
	});

	it.only('calls get_items with the result of the fetch call', async () => {
		vi.useFakeTimers();
		const og_fetch = globalThis.fetch;
		const new_fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: vi.fn(() => Promise.resolve([{ id: '1', name: 'Test Item' }]))
			})
		);
		// @ts-expect-error aint mocking the whole thing
		globalThis.fetch = new_fetch;
		const get_items = vi.fn((response: unknown) => response as { id: string; name: string }[]);
		const { getByLabelText } = render(Autocomplete<{ id: string; name: string }>, {
			children,
			get_url(query) {
				return `https://api.example.com/search?q=${query}`;
			},
			get_items
		});
		const input = getByLabelText('Search');
		await input.fill('test');
		vi.advanceTimersByTime(300);
		expect(new_fetch).toHaveBeenCalledWith('https://api.example.com/search?q=test');
		await vi.waitFor(() => {
			expect(get_items).toHaveBeenCalledWith([{ id: '1', name: 'Test Item' }]);
		});
		vi.useRealTimers();
		globalThis.fetch = og_fetch;
	});
});
