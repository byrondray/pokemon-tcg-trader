<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui';
  import { Button } from '$lib/components/ui';

  export let data: PageData;

  onMount(() => {
    // Initialize wonder picks page
  });
</script>

<svelte:head>
  <title>Wonder Picks - Pokemon TCG Trader</title>
  <meta name="description" content="Share and discover Wonder Pick opportunities in Pokemon TCG Pocket" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-3xl font-bold">Wonder Picks</h1>
      <p class="text-muted-foreground mt-2">Share Wonder Pick opportunities with the community</p>
    </div>
    <Button href="/wonder-picks/new">Share Wonder Pick</Button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each data.wonderPicks as pick}
      <Card>
        <CardHeader>
          <CardTitle>Wonder Pick Available</CardTitle>
          <CardDescription>Shared by {pick.sharedBy}</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-muted-foreground mb-4">{pick.description}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-muted-foreground">
              Expires: {new Date(pick.expiresAt).toLocaleDateString()}
            </span>
            <Button size="sm">View Details</Button>
          </div>
        </CardContent>
      </Card>
    {:else}
      <div class="col-span-full text-center py-12">
        <p class="text-muted-foreground">No Wonder Picks available. Share one to get started!</p>
        <Button href="/wonder-picks/new" class="mt-4">Share Wonder Pick</Button>
      </div>
    {/each}
  </div>
</div>
