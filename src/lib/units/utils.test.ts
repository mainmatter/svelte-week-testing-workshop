import { it, expect, describe } from 'vitest';
import { add, division } from './utils';

describe('add function', () => {
	it('should add two numbers', () => {
		expect(add(1, 2)).toBe(3);
	});
});

describe('division function', () => {
	it('should divide two numbers', () => {
		expect(division(6, 2)).toBe(3);
	});

	it('should fail for division by zero', () => {
		expect(() => division(6, 0)).toThrow('Division by zero is not allowed');
	});
});
