<script lang="ts">
	import { onMount } from 'svelte';
	import ListingCard from '$lib/components/ListingCard.svelte';
	import { Button, Card, CardContent } from '$lib/components/ui';
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

<section class="text-center py-16 bg-gradient-to-br from-primary to-purple-600 text-primary-foreground rounded-xl mb-12">
	<div class="max-w-2xl mx-auto px-8">
		<h1 class="text-3xl md:text-5xl font-bold mb-4 leading-tight">
			🎴 Pokemon TCG Pocket Trader
		</h1>
		<p class="text-base md:text-xl mb-8 opacity-90 leading-relaxed">
			Connect with trainers worldwide to trade cards and share Wonder Pick opportunities
		</p>
		
		{#if $isAuthenticated}
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<Button href="/listings/create" size="lg" class="w-full sm:w-auto min-w-48">
					Create Trade Listing
				</Button>
				<Button href="/listings" variant="outline" size="lg" class="w-full sm:w-auto min-w-48 bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20">
					Browse Trades
				</Button>
			</div>
		{:else}
			<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
				<Button href="/api/auth/login" size="lg" class="w-full sm:w-auto min-w-48">
					Get Started
				</Button>
				<Button href="/listings" variant="outline" size="lg" class="w-full sm:w-auto min-w-48 bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20">
					Browse Trades
				</Button>
			</div>
		{/if}
	</div>
</section>

<section class="mb-12">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<Card class="text-center hover:-translate-y-1 transition-transform">
			<CardContent class="p-8">
				<div class="text-5xl mb-4">🔄</div>
				<h3 class="mb-4 text-xl font-semibold">Trade Cards</h3>
				<p class="text-muted-foreground leading-relaxed">Post your want lists and available cards to find perfect trading partners</p>
			</CardContent>
		</Card>
		
		<Card class="text-center hover:-translate-y-1 transition-transform">
			<CardContent class="p-8">
				<div class="text-5xl mb-4">💎</div>
				<h3 class="mb-4 text-xl font-semibold">Wonder Picks</h3>
				<p class="text-muted-foreground leading-relaxed">Share amazing Wonder Pick opportunities with the community</p>
			</CardContent>
		</Card>
		
		<Card class="text-center hover:-translate-y-1 transition-transform">
			<CardContent class="p-8">
				<div class="text-5xl mb-4">💬</div>
				<h3 class="mb-4 text-xl font-semibold">Real-time Chat</h3>
				<p class="text-muted-foreground leading-relaxed">Message other traders instantly to negotiate and finalize trades</p>
			</CardContent>
		</Card>
		
		<Card class="text-center hover:-translate-y-1 transition-transform">
			<CardContent class="p-8">
				<div class="text-5xl mb-4">🏆</div>
				<h3 class="mb-4 text-xl font-semibold">Reputation System</h3>
				<p class="text-muted-foreground leading-relaxed">Build trust through successful trades and community feedback</p>
			</CardContent>
		</Card>
	</div>
</section>

{#if isLoading}
	<section class="text-center py-12">
		<div class="w-10 h-10 border-4 border-gray-300 border-l-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
		<p>Loading recent activity...</p>
	</section>
{:else}
	{#if recentListings.length > 0}
		<section class="mb-12">
			<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<h2 class="text-3xl font-bold">Recent Trade Listings</h2>
				<Button href="/listings" variant="link" class="p-0 h-auto text-primary hover:text-primary/80">
					View All →
				</Button>
			</div>
			
			<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
				{#each recentListings as listing}
					<ListingCard {listing} />
				{/each}
			</div>
		</section>
	{/if}

		{#if recentWonderPicks.length > 0}
		<section class="mb-12">
			<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<h2 class="text-3xl font-bold">Recent Wonder Picks</h2>
				<Button href="/wonder-picks" variant="link" class="p-0 h-auto text-primary hover:text-primary/80">
					View All →
				</Button>
			</div>
			
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{#each recentWonderPicks as wonderPick}
					<Card class="overflow-hidden hover:scale-105 transition-transform">
						{#if wonderPick.imageUrl}
							<img src={wonderPick.imageUrl} alt="Wonder Pick" class="w-full h-48 object-cover" />
						{/if}
						<CardContent class="p-4">
							<p class="text-muted-foreground text-sm">
								{new Date(wonderPick.createdAt).toLocaleDateString()}
							</p>
						</CardContent>
					</Card>
				{/each}
			</div>
		</section>
	{/if}
{/if}

<!-- Mobile responsive adjustments handled by Tailwind responsive classes -->
