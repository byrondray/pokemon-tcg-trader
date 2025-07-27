<script lang="ts">
	import ListingCard from '$lib/components/ListingCard.svelte';
	import AnimatedCard from '$lib/components/AnimatedCard.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import { Button, Card, CardContent } from '$lib/components/ui';
	import { isAuthenticated } from '$lib/stores/user';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let data: PageData;

	// Destructure the data from the load function
	$: ({ recentListings, recentWonderPicks } = data);
</script>

<svelte:head>
	<title>Pokemon TCG Pocket Trader</title>
	<meta name="description" content="Trade Pokemon TCG Pocket cards with players worldwide" />
</svelte:head>

<PageTransition>
	<section class="text-center py-16 bg-gradient-to-br from-primary to-purple-600 text-primary-foreground rounded-xl mb-12"
		in:fly={{ y: -30, duration: 600, easing: quintOut }}>
		<div class="max-w-2xl mx-auto px-8">
			<h1 class="text-3xl md:text-5xl font-bold mb-4 leading-tight">
				🎴 Pokemon TCG Pocket Trader
			</h1>
			<p class="text-base md:text-xl mb-8 opacity-90 leading-relaxed">
				Connect with trainers worldwide to trade cards and share Wonder Pick opportunities
			</p>
			
			{#if $isAuthenticated}
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<Button href="/listings/create" size="lg" class="w-full sm:w-auto min-w-48 btn-primary">
						Create Trade Listing
					</Button>
					<Button href="/listings" variant="outline" size="lg" class="w-full sm:w-auto min-w-48 bg-white/10 border-white/30 text-primary-foreground hover:bg-white/20">
						Browse Trades
					</Button>
				</div>
			{:else}
				<div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<Button href="/api/auth/login" size="lg" class="w-full sm:w-auto min-w-48 btn-primary">
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
			{#each [
				{ icon: '🔄', title: 'Trade Cards', desc: 'Post your want lists and available cards to find perfect trading partners' },
				{ icon: '💎', title: 'Wonder Picks', desc: 'Share amazing Wonder Pick opportunities with the community' },
				{ icon: '💬', title: 'Real-time Chat', desc: 'Message other traders instantly to negotiate and finalize trades' },
				{ icon: '🏆', title: 'Reputation System', desc: 'Build trust through successful trades and community feedback' }
			] as feature, index}
				<AnimatedCard delay={index * 100} hoverable={true}>
					<CardContent class="p-8 text-center">
						<div class="text-5xl mb-4">{feature.icon}</div>
						<h3 class="mb-4 text-xl font-semibold">{feature.title}</h3>
						<p class="text-muted-foreground leading-relaxed">{feature.desc}</p>
					</CardContent>
				</AnimatedCard>
			{/each}
		</div>
	</section>

	{#if recentListings.length > 0}
		<section class="mb-12" in:fly={{ y: 30, duration: 400, delay: 200, easing: quintOut }}>
			<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<h2 class="text-3xl font-bold">Recent Trade Listings</h2>
				<Button href="/listings" variant="link" class="p-0 h-auto text-primary hover:text-primary/80">
					View All →
				</Button>
			</div>
			
			<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
				{#each recentListings as listing, index}
					<div in:fly={{ y: 20, duration: 400, delay: index * 100, easing: quintOut }}>
						<ListingCard {listing} />
					</div>
				{/each}
			</div>
		</section>
	{/if}

	{#if recentWonderPicks.length > 0}
		<section class="mb-12" in:fly={{ y: 30, duration: 400, delay: 300, easing: quintOut }}>
			<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<h2 class="text-3xl font-bold">Recent Wonder Picks</h2>
				<Button href="/wonder-picks" variant="link" class="p-0 h-auto text-primary hover:text-primary/80">
					View All →
				</Button>
			</div>
			
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{#each recentWonderPicks as wonderPick, index}
					<AnimatedCard delay={index * 50} hoverable={true}>
						{#if wonderPick.imageUrl}
							<img src={wonderPick.imageUrl} alt="Wonder Pick" class="w-full h-48 object-cover" />
						{/if}
						<CardContent class="p-4">
							<p class="text-muted-foreground text-sm">
								{new Date(wonderPick.createdAt).toLocaleDateString()}
							</p>
						</CardContent>
					</AnimatedCard>
				{/each}
			</div>
		</section>
	{/if}
</PageTransition>

<!-- Mobile responsive adjustments handled by Tailwind responsive classes -->
