import { it, expect, describe } from 'vitest';
import { add } from './utils';

describe('add function', () => {
	it('should add two numbers', () => {
		expect(add(1, 2)).toBe(3);
	});
});
