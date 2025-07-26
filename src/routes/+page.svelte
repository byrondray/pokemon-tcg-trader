<script lang="ts">
	import { onMount } from 'svelte';
	import ListingCard from '$lib/components/ListingCard.svelte';
	import { isAuthenticated } from '$lib/stores/user';

	let recentListings: any[] = [];
	let recentWonderPicks: any[] = [];
	let isLoading = true;

	onMount(async () => {
		try {
			// Fetch recent listings
			const listingsResponse = await fetch('/api/listings?limit=6');
			if (listingsResponse.ok) {
				const listingsData = await listingsResponse.json();
				if (listingsData.success) {
					recentListings = listingsData.data.listings;
				}
			}

			// Fetch recent Wonder Picks
			const wonderPicksResponse = await fetch('/api/wonder-picks?limit=4');
			if (wonderPicksResponse.ok) {
				const wonderPicksData = await wonderPicksResponse.json();
				if (wonderPicksData.success) {
					recentWonderPicks = wonderPicksData.data.wonderPicks || [];
				}
			}
		} catch (error) {
			console.error('Error loading home page data:', error);
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Pokemon TCG Pocket Trader</title>
	<meta name="description" content="Trade Pokemon TCG Pocket cards with players worldwide" />
</svelte:head>

<section class="hero">
	<div class="hero-content">
		<h1 class="hero-title">
			🎴 Pokemon TCG Pocket Trader
		</h1>
		<p class="hero-subtitle">
			Connect with trainers worldwide to trade cards and share Wonder Pick opportunities
		</p>
		
		{#if $isAuthenticated}
			<div class="hero-actions">
				<a href="/listings/create" class="cta-button primary">Create Trade Listing</a>
				<a href="/listings" class="cta-button secondary">Browse Trades</a>
			</div>
		{:else}
			<div class="hero-actions">
				<a href="/api/auth/login" class="cta-button primary">Get Started</a>
				<a href="/listings" class="cta-button secondary">Browse Trades</a>
			</div>
		{/if}
	</div>
</section>

<section class="features">
	<div class="features-grid">
		<div class="feature-card">
			<div class="feature-icon">🔄</div>
			<h3>Trade Cards</h3>
			<p>Post your want lists and available cards to find perfect trading partners</p>
		</div>
		
		<div class="feature-card">
			<div class="feature-icon">💎</div>
			<h3>Wonder Picks</h3>
			<p>Share amazing Wonder Pick opportunities with the community</p>
		</div>
		
		<div class="feature-card">
			<div class="feature-icon">💬</div>
			<h3>Real-time Chat</h3>
			<p>Message other traders instantly to negotiate and finalize trades</p>
		</div>
		
		<div class="feature-card">
			<div class="feature-icon">🏆</div>
			<h3>Reputation System</h3>
			<p>Build trust through successful trades and community feedback</p>
		</div>
	</div>
</section>

{#if isLoading}
	<section class="loading">
		<div class="loading-spinner"></div>
		<p>Loading recent activity...</p>
	</section>
{:else}
	{#if recentListings.length > 0}
		<section class="recent-listings">
			<div class="section-header">
				<h2>Recent Trade Listings</h2>
				<a href="/listings" class="view-all-link">View All →</a>
			</div>
			
			<div class="listings-grid">
				{#each recentListings as listing}
					<ListingCard {listing} />
				{/each}
			</div>
		</section>
	{/if}

	{#if recentWonderPicks.length > 0}
		<section class="recent-wonder-picks">
			<div class="section-header">
				<h2>Recent Wonder Picks</h2>
				<a href="/wonder-picks" class="view-all-link">View All →</a>
			</div>
			
			<div class="wonder-picks-grid">
				{#each recentWonderPicks as wonderPick}
					<div class="wonder-pick-card">
						{#if wonderPick.imageUrl}
							<img src={wonderPick.imageUrl} alt="Wonder Pick" class="wonder-pick-image" />
						{/if}
						<div class="wonder-pick-info">
							<p class="wonder-pick-time">
								{new Date(wonderPick.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
{/if}

<style>
	.hero {
		text-align: center;
		padding: 4rem 0;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 1rem;
		margin-bottom: 3rem;
	}

	.hero-content {
		max-width: 600px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.hero-title {
		font-size: 3rem;
		font-weight: bold;
		margin-bottom: 1rem;
		line-height: 1.1;
	}

	.hero-subtitle {
		font-size: 1.25rem;
		margin-bottom: 2rem;
		opacity: 0.9;
		line-height: 1.5;
	}

	.hero-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.cta-button {
		padding: 0.875rem 2rem;
		border-radius: 0.5rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s;
		display: inline-block;
	}

	.cta-button.primary {
		background: #3b82f6;
		color: white;
	}

	.cta-button.primary:hover {
		background: #2563eb;
		transform: translateY(-1px);
	}

	.cta-button.secondary {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.cta-button.secondary:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-1px);
	}

	.features {
		margin-bottom: 3rem;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 2rem;
	}

	.feature-card {
		background: white;
		padding: 2rem;
		border-radius: 0.75rem;
		text-align: center;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
	}

	.feature-card:hover {
		transform: translateY(-2px);
	}

	.feature-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.feature-card h3 {
		margin-bottom: 1rem;
		color: #1f2937;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.feature-card p {
		color: #6b7280;
		line-height: 1.5;
	}

	.loading {
		text-align: center;
		padding: 3rem 0;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #e5e7eb;
		border-left: 4px solid #3b82f6;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin: 0 auto 1rem;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.recent-listings,
	.recent-wonder-picks {
		margin-bottom: 3rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.section-header h2 {
		margin: 0;
		color: #1f2937;
		font-size: 1.875rem;
		font-weight: 700;
	}

	.view-all-link {
		color: #3b82f6;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.view-all-link:hover {
		color: #2563eb;
	}

	.listings-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
	}

	.wonder-picks-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.wonder-pick-card {
		background: white;
		border-radius: 0.75rem;
		overflow: hidden;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
	}

	.wonder-pick-card:hover {
		transform: scale(1.02);
	}

	.wonder-pick-image {
		width: 100%;
		height: 200px;
		object-fit: cover;
	}

	.wonder-pick-info {
		padding: 1rem;
	}

	.wonder-pick-time {
		margin: 0;
		color: #6b7280;
		font-size: 0.875rem;
	}

	@media (max-width: 768px) {
		.hero-title {
			font-size: 2rem;
		}

		.hero-subtitle {
			font-size: 1rem;
		}

		.hero-actions {
			flex-direction: column;
			align-items: center;
		}

		.cta-button {
			width: 100%;
			max-width: 300px;
		}

		.section-header {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		.listings-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
