import { http, HttpResponse } from 'msw';

const mocks = [
	{
		id: 1,
		title: 'Test Product 1',
		description: 'A great test product for testing purposes',
		category: 'electronics',
		price: 29.99,
		discountPercentage: 10.5,
		rating: 4.5,
		stock: 50,
		tags: ['electronics', 'test'],
		brand: 'TestBrand',
		sku: 'TEST-001',
		weight: 1.2,
		dimensions: {
			width: 10.5,
			height: 15.2,
			depth: 5.8
		},
		warrantyInformation: '1 year warranty',
		shippingInformation: 'Ships in 2-3 business days',
		availabilityStatus: 'In Stock',
		reviews: [
			{
				rating: 5,
				comment: 'Great product!',
				date: '2025-01-01T10:00:00.000Z',
				reviewerName: 'John Doe',
				reviewerEmail: 'john.doe@example.com'
			}
		],
		returnPolicy: '30 day return policy',
		minimumOrderQuantity: 1,
		meta: {
			createdAt: '2025-01-01T10:00:00.000Z',
			updatedAt: '2025-01-01T10:00:00.000Z',
			barcode: '1234567890123',
			qrCode: 'https://example.com/qr-code.png'
		},
		images: ['https://example.com/product1.jpg'],
		thumbnail: 'https://example.com/product1-thumb.jpg'
	},
	{
		id: 2,
		title: 'Test Product 2',
		description: 'Another excellent test product',
		category: 'books',
		price: 19.99,
		discountPercentage: 5.0,
		rating: 4.2,
		stock: 25,
		tags: ['books', 'test'],
		brand: 'TestBooks',
		sku: 'TEST-002',
		weight: 0.8,
		dimensions: {
			width: 8.0,
			height: 12.0,
			depth: 2.0
		},
		warrantyInformation: 'No warranty',
		shippingInformation: 'Ships in 1-2 business days',
		availabilityStatus: 'In Stock',
		reviews: [
			{
				rating: 4,
				comment: 'Good read!',
				date: '2025-01-02T10:00:00.000Z',
				reviewerName: 'Jane Smith',
				reviewerEmail: 'jane.smith@example.com'
			}
		],
		returnPolicy: '14 day return policy',
		minimumOrderQuantity: 1,
		meta: {
			createdAt: '2025-01-02T10:00:00.000Z',
			updatedAt: '2025-01-02T10:00:00.000Z',
			barcode: '1234567890124',
			qrCode: 'https://example.com/qr-code.png'
		},
		images: ['https://example.com/product2.jpg'],
		thumbnail: 'https://example.com/product2-thumb.jpg'
	}
];

export const handlers = [
	http.get('https://api.example.com/user', () => {
		return HttpResponse.json({
			id: 'abc-123',
			firstName: 'John',
			lastName: 'Maverick'
		});
	}),

	http.get('https://dummyjson.com/products', ({ request }) => {
		const url = new URL(request.url);
		const limit = parseInt(url.searchParams.get('limit') || '30');
		const skip = parseInt(url.searchParams.get('skip') || '0');

		const sliced = mocks.slice(skip, skip + limit);

		return HttpResponse.json({
			products: sliced,
			total: mocks.length,
			skip,
			limit
		});
	}),

	// Handler for server errors during testing
	http.get('https://dummyjson.com/products/error', () => {
		return HttpResponse.json({ message: 'Server Error' }, { status: 500 });
	})
];
