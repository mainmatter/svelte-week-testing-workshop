<script lang="ts">
	let { data } = $props();

	let searchTerm = $state('');
	let filteredProducts = $derived(
		searchTerm
			? data.products.filter(
					(product) =>
						product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
						product.description.toLowerCase().includes(searchTerm.toLowerCase())
				)
			: data.products
	);
</script>

<svelte:head>
	<title>Products - DummyJSON Store</title>
	<meta name="description" content="Browse our collection of products" />
</svelte:head>

<main class="container">
	<h1>Products ({data.total} total)</h1>

	<div class="search-container">
		<input
			type="text"
			placeholder="Search products..."
			bind:value={searchTerm}
			class="search-input"
		/>
	</div>

	<div class="products-grid">
		{#each filteredProducts as product (product.id)}
			<article class="product-card">
				<img src={product.thumbnail} alt={product.title} loading="lazy" class="product-image" />
				<div class="product-content">
					<h2 class="product-title">{product.title}</h2>
					<p class="product-description">{product.description}</p>
					<div class="product-details">
						<span class="product-price">${product.price}</span>
						<span class="product-rating">⭐ {product.rating}</span>
					</div>
					<div class="product-meta">
						<span class="product-brand">{product.brand}</span>
						<span class="product-category">{product.category}</span>
					</div>
				</div>
			</article>
		{/each}
	</div>

	{#if filteredProducts.length === 0 && searchTerm}
		<p class="no-results">No products found matching "{searchTerm}"</p>
	{/if}
</main>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		color: #333;
		margin-bottom: 2rem;
		text-align: center;
	}

	.search-container {
		margin-bottom: 2rem;
		text-align: center;
	}

	.search-input {
		padding: 0.75rem;
		font-size: 1rem;
		border: 2px solid #ddd;
		border-radius: 8px;
		width: 100%;
		max-width: 400px;
		transition: border-color 0.2s;
	}

	.search-input:focus {
		outline: none;
		border-color: #007acc;
	}

	.products-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.product-card {
		border: 1px solid #ddd;
		border-radius: 12px;
		overflow: hidden;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		background: white;
	}

	.product-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.product-image {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

	.product-content {
		padding: 1rem;
	}

	.product-title {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		color: #333;
	}

	.product-description {
		color: #666;
		margin: 0 0 1rem 0;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.product-details {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.product-price {
		font-size: 1.25rem;
		font-weight: 700;
		color: #007acc;
	}

	.product-rating {
		font-size: 0.9rem;
		color: #666;
	}

	.product-meta {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
		color: #888;
	}

	.product-brand {
		font-weight: 500;
	}

	.product-category {
		text-transform: capitalize;
	}

	.no-results {
		text-align: center;
		color: #666;
		font-style: italic;
		margin-top: 2rem;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.products-grid {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 1rem;
		}
	}
</style>
