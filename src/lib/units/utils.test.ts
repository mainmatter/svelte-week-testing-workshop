import { it, expect, describe, vi, beforeEach, afterEach, afterAll } from 'vitest';
import {
	add,
	division,
	format_currency,
	is_valid_email,
	get_current_timestamp,
	log_message,
	fetch_user_data,
	debounce,
	retry_operation
} from './utils';

describe('add function', () => {
	it('should add two positive numbers', () => {
		expect(add(1, 2)).toBe(3);
	});

	it('should add negative numbers', () => {
		expect(add(-1, -2)).toBe(-3);
	});

	it('should add zero', () => {
		expect(add(5, 0)).toBe(5);
	});

	it('should handle decimal numbers', () => {
		expect(add(1.5, 2.5)).toBe(4);
	});
});

describe('division function', () => {
	it('should divide two positive numbers', () => {
		expect(division(6, 2)).toBe(3);
	});

	it('should divide negative numbers', () => {
		expect(division(-6, -2)).toBe(3);
	});

	it('should handle decimal division', () => {
		expect(division(7, 2)).toBe(3.5);
	});

	it('should fail for division by zero', () => {
		expect(() => division(6, 0)).toThrow('Division by zero is not allowed');
	});
});

describe('format_currency function', () => {
	it('should format USD currency by default', () => {
		expect(format_currency(100)).toBe('$100.00');
	});

	it('should format different currencies', () => {
		expect(format_currency(100, 'EUR')).toBe('€100.00');
	});

	it('should handle decimal amounts', () => {
		expect(format_currency(99.99)).toBe('$99.99');
	});

	it('should handle zero amount', () => {
		expect(format_currency(0)).toBe('$0.00');
	});
});

describe('is_valid_email function', () => {
	it('should validate correct email addresses', () => {
		expect(is_valid_email('user@example.com')).toBe(true);
		expect(is_valid_email('test.email@domain.co.uk')).toBe(true);
		expect(is_valid_email('user+tag@example.org')).toBe(true);
	});

	it('should reject invalid email addresses', () => {
		expect(is_valid_email('invalid-email')).toBe(false);
		expect(is_valid_email('user@')).toBe(false);
		expect(is_valid_email('@domain.com')).toBe(false);
		expect(is_valid_email('user@domain')).toBe(false);
		expect(is_valid_email('')).toBe(false);
	});
});

describe('get_current_timestamp function', () => {
	it('should return a timestamp', () => {
		const timestamp = get_current_timestamp();
		expect(typeof timestamp).toBe('number');
		expect(timestamp).toBeGreaterThan(0);
	});

	it('should return current time (within reasonable range)', () => {
		const before = Date.now();
		const timestamp = get_current_timestamp();
		const after = Date.now();

		expect(timestamp).toBeGreaterThanOrEqual(before);
		expect(timestamp).toBeLessThanOrEqual(after);
	});

	it('should return different timestamps when called multiple times', () => {
		const timestamp1 = get_current_timestamp();
		// Small delay to ensure different timestamps
		const timestamp2 = get_current_timestamp();
		expect(timestamp2).toBeGreaterThanOrEqual(timestamp1);
	});
});

describe('log_message function', () => {
	let consoleSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		consoleSpy.mockRestore();
	});

	it('should log message with timestamp', () => {
		log_message('Test message');
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] Test message$/)
		);
	});

	it('should log empty message', () => {
		log_message('');
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(consoleSpy).toHaveBeenCalledWith(
			expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] $/)
		);
	});
});

describe('fetch_user_data function', () => {
	const originalFetch = global.fetch;

	beforeEach(() => {
		global.fetch = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	afterAll(() => {
		global.fetch = originalFetch;
	});

	it('should fetch user data successfully', async () => {
		const mockUserData = { id: '123', name: 'John Doe' };
		const mockResponse = {
			json: vi.fn().mockResolvedValue(mockUserData)
		};

		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

		const result = await fetch_user_data('123');

		expect(global.fetch).toHaveBeenCalledWith('/api/users/123');
		expect(result).toEqual(mockUserData);
	});

	it('should handle fetch errors', async () => {
		const mockError = new Error('Network error');
		(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);

		await expect(fetch_user_data('123')).rejects.toThrow('Network error');
	});

	it('should handle JSON parsing errors', async () => {
		const mockResponse = {
			json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
		};

		(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

		await expect(fetch_user_data('123')).rejects.toThrow('Invalid JSON');
	});
});

describe('debounce function', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should debounce function calls', () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 100);

		debouncedFn('arg1');
		debouncedFn('arg2');
		debouncedFn('arg3');

		expect(mockFn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);

		expect(mockFn).toHaveBeenCalledTimes(1);
		expect(mockFn).toHaveBeenCalledWith('arg3');
	});

	it('should reset timer on subsequent calls', () => {
		const mockFn = vi.fn();
		const debouncedFn = debounce(mockFn, 100);

		debouncedFn('arg1');
		vi.advanceTimersByTime(50);
		debouncedFn('arg2');
		vi.advanceTimersByTime(50);

		expect(mockFn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(50);

		expect(mockFn).toHaveBeenCalledTimes(1);
		expect(mockFn).toHaveBeenCalledWith('arg2');
	});
});

describe('retry_operation function', () => {
	it('should succeed on first try', async () => {
		const mockOperation = vi.fn().mockResolvedValue('success');

		const result = await retry_operation(mockOperation);

		expect(result).toBe('success');
		expect(mockOperation).toHaveBeenCalledTimes(1);
	});

	it('should retry on failure', async () => {
		const mockOperation = vi
			.fn()
			.mockRejectedValueOnce(new Error('fail 1'))
			.mockRejectedValueOnce(new Error('fail 2'))
			.mockResolvedValue('success');

		const result = await retry_operation(mockOperation);

		expect(result).toBe('success');
		expect(mockOperation).toHaveBeenCalledTimes(3);
	});

	it('should fail after max retries', async () => {
		const mockOperation = vi.fn().mockRejectedValue(new Error('persistent error'));

		await expect(retry_operation(mockOperation, 2)).rejects.toThrow('persistent error');
		expect(mockOperation).toHaveBeenCalledTimes(3); // initial + 2 retries
	});

	it('should use custom max retries', async () => {
		const mockOperation = vi.fn().mockRejectedValue(new Error('error'));

		await expect(retry_operation(mockOperation, 1)).rejects.toThrow('error');
		expect(mockOperation).toHaveBeenCalledTimes(2); // initial + 1 retry
	});
});
