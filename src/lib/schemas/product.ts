import * as v from 'valibot';

export const DimensionsSchema = v.object({
	width: v.number(),
	height: v.number(),
	depth: v.number()
});

export const ReviewSchema = v.object({
	rating: v.number(),
	comment: v.string(),
	date: v.string(),
	reviewerName: v.string(),
	reviewerEmail: v.pipe(v.string(), v.email())
});

export const MetaSchema = v.object({
	createdAt: v.string(),
	updatedAt: v.string(),
	barcode: v.string(),
	qrCode: v.pipe(v.string(), v.url())
});

export const ProductSchema = v.object({
	id: v.number(),
	title: v.string(),
	description: v.string(),
	category: v.string(),
	price: v.number(),
	discountPercentage: v.number(),
	rating: v.number(),
	stock: v.number(),
	tags: v.array(v.string()),
	brand: v.string(),
	sku: v.string(),
	weight: v.number(),
	dimensions: DimensionsSchema,
	warrantyInformation: v.string(),
	shippingInformation: v.string(),
	availabilityStatus: v.string(),
	reviews: v.array(ReviewSchema),
	returnPolicy: v.string(),
	minimumOrderQuantity: v.number(),
	meta: MetaSchema,
	images: v.array(v.pipe(v.string(), v.url())),
	thumbnail: v.pipe(v.string(), v.url())
});

export const ProductsResponseSchema = v.object({
	products: v.array(ProductSchema),
	total: v.number(),
	skip: v.number(),
	limit: v.number()
});

export type Product = v.InferOutput<typeof ProductSchema>;
export type ProductsResponse = v.InferOutput<typeof ProductsResponseSchema>;