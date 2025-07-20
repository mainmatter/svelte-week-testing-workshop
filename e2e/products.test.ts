import { expect, test } from '@playwright/test';

test.describe('Products Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('displays products correctly', async ({ page }) => {
		// Check page title and heading
		await expect(page).toHaveTitle(/Products - DummyJSON Store/);
		await expect(page.getByRole('heading', { name: /Products \(2 total\)/ })).toBeVisible();

		// Check that products are displayed
		const product_cards = page.locator('.product-card');
		await expect(product_cards).toHaveCount(2);

		// Check first product details
		const first = product_cards.first();
		await expect(first.locator('.product-title')).toHaveText('Test Product 1');
		await expect(first.locator('.product-description')).toHaveText(
			'A great test product for testing purposes'
		);
		await expect(first.locator('.product-price')).toHaveText('$29.99');
		await expect(first.locator('.product-rating')).toHaveText('⭐ 4.5');
		await expect(first.locator('.product-brand')).toHaveText('TestBrand');
		await expect(first.locator('.product-category')).toHaveText('electronics');

		// Check second product details
		const second = product_cards.nth(1);
		await expect(second.locator('.product-title')).toHaveText('Test Product 2');
		await expect(second.locator('.product-description')).toHaveText(
			'Another excellent test product'
		);
		await expect(second.locator('.product-price')).toHaveText('$19.99');
		await expect(second.locator('.product-rating')).toHaveText('⭐ 4.2');
		await expect(second.locator('.product-brand')).toHaveText('TestBooks');
		await expect(second.locator('.product-category')).toHaveText('books');
	});

	test('displays product images correctly', async ({ page }) => {
		const products = page.locator('.product-card');

		// Check first product image
		const first = products.first().locator('.product-image');
		await expect(first).toBeVisible();
		await expect(first).toHaveAttribute('src', 'https://example.com/product1-thumb.jpg');
		await expect(first).toHaveAttribute('alt', 'Test Product 1');
		await expect(first).toHaveAttribute('loading', 'lazy');

		// Check second product image
		const second = products.nth(1).locator('.product-image');
		await expect(second).toBeVisible();
		await expect(second).toHaveAttribute('src', 'https://example.com/product2-thumb.jpg');
		await expect(second).toHaveAttribute('alt', 'Test Product 2');
	});

	test('search functionality works correctly', async ({ page }) => {
		// Verify initial state shows all products
		await expect(page.locator('.product-card')).toHaveCount(2);

		// Search for "electronics"
		const search_input = page.locator('.search-input');
		await search_input.fill('electronics');

		// Should show only the first product
		await expect(page.locator('.product-card')).toHaveCount(1);
		await expect(page.locator('.product-title')).toHaveText('Test Product 1');

		// Search for "books"
		await search_input.fill('books');

		// Should show only the second product
		await expect(page.locator('.product-card')).toHaveCount(1);
		await expect(page.locator('.product-title')).toHaveText('Test Product 2');

		// Search for something that doesn't exist
		await search_input.fill('nonexistent');

		// Should show no products and display no results message
		await expect(page.locator('.product-card')).toHaveCount(0);
		await expect(page.locator('.no-results')).toBeVisible();
		await expect(page.locator('.no-results')).toHaveText(
			'No products found matching "nonexistent"'
		);

		// Clear search
		await search_input.fill('');

		// Should show all products again
		await expect(page.locator('.product-card')).toHaveCount(2);
		await expect(page.locator('.no-results')).not.toBeVisible();
	});

	test('search is case insensitive', async ({ page }) => {
		const search_input = page.locator('.search-input');

		// Search with different cases
		await search_input.fill('ELECTRONICS');
		await expect(page.locator('.product-card')).toHaveCount(1);
		await expect(page.locator('.product-title')).toHaveText('Test Product 1');

		await search_input.fill('Books');
		await expect(page.locator('.product-card')).toHaveCount(1);
		await expect(page.locator('.product-title')).toHaveText('Test Product 2');

		await search_input.fill('test');
		await expect(page.locator('.product-card')).toHaveCount(2);
	});

	test('search works with partial matches', async ({ page }) => {
		const search_input = page.locator('.search-input');

		// Search for partial title match
		await search_input.fill('Product 1');
		await expect(page.locator('.product-card')).toHaveCount(1);
		await expect(page.locator('.product-title')).toHaveText('Test Product 1');

		// Search for partial description match
		await search_input.fill('excellent');
		await expect(page.locator('.product-card')).toHaveCount(1);
		await expect(page.locator('.product-title')).toHaveText('Test Product 2');
	});

	test('responsive design works on mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		// Check that the layout adapts
		const container = page.locator('.container');
		await expect(container).toBeVisible();

		// Products should still be visible and functional
		await expect(page.locator('.product-card')).toHaveCount(2);

		// Search should still work
		const search_input = page.locator('.search-input');
		await search_input.fill('electronics');
		await expect(page.locator('.product-card')).toHaveCount(1);
	});

	test('page loads with proper meta tags', async ({ page }) => {
		// Check page title
		await expect(page).toHaveTitle('Products - DummyJSON Store');

		// Check meta description
		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute('content', 'Browse our collection of products');
	});
});
