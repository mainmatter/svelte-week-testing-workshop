import * as v from 'valibot';
import { ProductsResponseSchema } from '$lib/schemas/product.js';
import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
	const response = await fetch('https://dummyjson.com/products?limit=12');

	if (!response.ok) {
		error(response.status, `Failed to fetch products: ${response.statusText}`);
	}

	const raw_data = await response.json();

	const validated = v.parse(ProductsResponseSchema, raw_data);

	return {
		products: validated.products,
		total: validated.total
	};
}
