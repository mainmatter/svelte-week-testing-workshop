// Level 1: Easy to test - Pure functions with no dependencies
export function add(a: number, b: number): number {
	return a + b;
}

export function division(a: number, b: number): number {
	if (b === 0) {
		throw new Error('Division by zero is not allowed');
	}
	return a / b;
}

export function format_currency(amount: number, currency = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency
	}).format(amount);
}

export function is_valid_email(email: string): boolean {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
}

// Level 2: Moderate difficulty - Functions with external dependencies
export function get_current_timestamp(): number {
	return Date.now();
}

export function log_message(message: string): void {
	console.log(`[${new Date().toISOString()}] ${message}`);
}

// Level 3: Hard to test - Functions with side effects and async operations
export function fetch_user_data(user_id: string): Promise<unknown> {
	return fetch(`/api/users/${user_id}`).then((response) => response.json());
}

export function debounce<T extends (...args: unknown[]) => void>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeout_id: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout_id);
		timeout_id = setTimeout(() => func(...args), delay);
	};
}

export function retry_operation<T>(operation: () => Promise<T>, max_retries = 3): Promise<T> {
	return operation().catch((error) => {
		if (max_retries > 0) {
			return retry_operation(operation, max_retries - 1);
		}
		throw error;
	});
}
