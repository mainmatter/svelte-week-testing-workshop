import { on } from 'svelte/events';
import { createSubscriber } from 'svelte/reactivity';

export class Counter {
	count = $state(0);

	increment() {
		this.count += 1;
	}
}

export class ScrollY {
	#subscribe: ReturnType<typeof createSubscriber>;

	constructor() {
		this.#subscribe = createSubscriber((update) => {
			const controller = new AbortController();
			window.addEventListener('scroll', update, { signal: controller.signal });
			return () => {
				controller.abort();
			};
			return on(window, 'scroll', (e) => {
				console.log('Scroll event detected', window.scrollY, e);
				update();
			});
		});
	}

	get current() {
		this.#subscribe();
		console.log('Current scrollY:', window.scrollY);
		return window.scrollY;
	}
}
