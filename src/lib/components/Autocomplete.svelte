<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	interface Props {
		get_url: (query: string) => string;
		get_items: (response: unknown) => T[];
		debounce_delay?: number;
		placeholder?: string;
		children: Snippet<[T]>;
	}

	let {
		get_url,
		get_items,
		debounce_delay = 300,
		placeholder = 'Type to search...',
		children
	}: Props = $props();

	let results = $state<T[]>([]);
	let is_loading = $state(false);
	let show_results = $state(false);
	let debounce_timeout: ReturnType<typeof setTimeout>;

	async function fetch_results(query: string) {
		if (!query.trim()) {
			results = [];
			show_results = false;
			return;
		}

		is_loading = true;

		try {
			const response = await fetch(get_url(query));
			if (response.ok) {
				const data = await response.json();
				results = get_items(data);
				show_results = true;
			} else {
				results = [];
				show_results = false;
			}
		} catch {
			results = [];
			show_results = false;
		} finally {
			is_loading = false;
		}
	}

	function debounced_search(query: string) {
		clearTimeout(debounce_timeout);
		debounce_timeout = setTimeout(() => {
			fetch_results(query);
		}, debounce_delay);
	}

	function handle_focus() {
		if (results.length > 0) {
			show_results = true;
		}
	}

	function handle_blur() {
		setTimeout(() => {
			show_results = false;
		}, 150);
	}
</script>

<label class="autocomplete">
	Search
	<input
		type="text"
		{placeholder}
		oninput={(e) => {
			debounced_search(e.currentTarget.value);
		}}
		onfocus={handle_focus}
		onblur={handle_blur}
	/>

	{#if is_loading}
		<div class="loading">Loading...</div>
	{/if}

	{#if show_results && results.length > 0}
		<ul class="results">
			{#each results as item (item)}
				<li>
					{@render children(item)}
				</li>
			{/each}
		</ul>
	{/if}
</label>

<style>
	.autocomplete {
		position: relative;
		display: inline-block;
	}

	input {
		width: 100%;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.loading {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		padding: 8px;
		background: white;
		border: 1px solid #ccc;
		border-top: none;
		font-size: 12px;
		color: #666;
	}

	.results {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		max-height: 200px;
		overflow-y: auto;
		background: white;
		border: 1px solid #ccc;
		border-top: none;
		list-style: none;
		padding: 0;
		margin: 0;
		z-index: 10;
	}

	.results li {
		padding: 8px;
		cursor: pointer;
		border-bottom: 1px solid #eee;
	}

	.results li:hover {
		background-color: #f5f5f5;
	}

	.results li:last-child {
		border-bottom: none;
	}
</style>
