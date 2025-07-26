<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui';
  import { Button } from '$lib/components/ui';

  export let data: PageData;

  onMount(() => {
    // Initialize listings page
  });
</script>

<svelte:head>
  <title>Listings - Pokemon TCG Trader</title>
  <meta name="description" content="Browse Pokemon TCG card listings and find cards you need" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-3xl font-bold">Card Listings</h1>
      <p class="text-muted-foreground mt-2">Find Pokemon TCG cards from other traders</p>
    </div>
    <Button href="/listings/new">Post a Listing</Button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each data.listings as listing}
      <Card>
        <CardHeader>
          <CardTitle>{listing.title}</CardTitle>
          <CardDescription>Posted by {listing.owner}</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground mb-4">{listing.description}</p>
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold">
              {listing.priceType === 'trade' ? 'For Trade' : `$${listing.price}`}
            </span>
            <Button size="sm">View Details</Button>
          </div>
        </CardContent>
      </Card>
    {:else}
      <div class="col-span-full text-center py-12">
        <p class="text-muted-foreground">No listings found. Be the first to post a listing!</p>
        <Button href="/listings/new" class="mt-4">Post a Listing</Button>
      </div>
    {/each}
  </div>
</div>
