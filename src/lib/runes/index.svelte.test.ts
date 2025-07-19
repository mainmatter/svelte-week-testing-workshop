import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest';
import { Counter, ScrollY } from './index.svelte';
import { flushSync } from 'svelte';

describe('counter class', () => {
	it('should increment the count', () => {
		const counter = new Counter();
		expect(counter.count).toBe(0);
		counter.increment();
		expect(counter.count).toBe(1);
	});

	it('should handle multiple increments', () => {
		const counter = new Counter();
		counter.increment();
		counter.increment();
		expect(counter.count).toBe(2);
	});

	it('is reactive to changes', () => {
		const logs: number[] = [];
		const counter = new Counter();
		const cleanup = $effect.root(() => {
			$effect(() => {
				logs.push(counter.count);
			});
		});
		flushSync();
		expect(logs).toStrictEqual([0]);
		counter.increment();
		flushSync();
		expect(logs).toStrictEqual([0, 1]);
		cleanup();
	});
});

describe('scrollY class', () => {
	beforeEach(() => {
		document.body.innerHTML =
			'<div style="height: 2000px; background: linear-gradient(to bottom, white, black)"></div>';
	});

	afterEach(() => {
		window.scrollTo(0, 0);
	});
	it('should return current scrollY position', () => {
		const scrollY = new ScrollY();
		expect(scrollY.current).toBe(window.scrollY);
	});

	it('should update on scroll event', () => {
		const scrollY = new ScrollY();
		window.scrollTo(0, 100);
		expect(scrollY.current).toBe(100);
	});

	it.skip('should subscribe to scroll events', () => {
		const scrollY = new ScrollY();
		window.scrollTo(0, 200);
		expect(scrollY.current).toBe(200);
	});

	it('should subscribe to scroll events', async () => {
		const scrollY = new ScrollY();
		const logs: number[] = [];
		const cleanup = $effect.root(() => {
			$effect.pre(() => {
				logs.push(scrollY.current);
			});
		});
		expect(logs).toStrictEqual([0]);
		window.scrollTo(0, 200);
		await vi.waitFor(() => {
			expect(logs).toStrictEqual([0, 200]);
		});
		window.scrollTo(0, 400);
		await vi.waitFor(() => {
			expect(logs).toStrictEqual([0, 200, 400]);
		});
		cleanup();
	});
});
