<!-- src/lib/components/ListingCard.svelte -->
<script lang="ts">
  import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button, Badge } from '$lib/components/ui';
  
  export let listing: any;
  
  function timeAgo(date: Date) {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  }
</script>

<Card class="hover:shadow-md transition-shadow">
  <CardHeader>
    <div class="flex justify-between items-start">
      <CardTitle class="flex-1 mr-4">{listing.title}</CardTitle>
      <span class="text-muted-foreground text-sm whitespace-nowrap">{timeAgo(new Date(listing.createdAt))}</span>
    </div>
    
    {#if listing.description}
      <p class="text-muted-foreground text-sm leading-relaxed">{listing.description}</p>
    {/if}
  </CardHeader>
  
  <CardContent>
    {#if listing.wants && listing.wants.length > 0}
      <div class="mb-4">
        <h4 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Looking for:</h4>
        <div class="flex flex-wrap gap-2">
          {#each listing.wants as want}
            <Badge variant="outline" class="bg-yellow-50 text-yellow-800 border-yellow-200">
              {want.cardId}
              {#if want.quantity > 1}
                <span class="ml-1 text-xs">×{want.quantity}</span>
              {/if}
            </Badge>
          {/each}
        </div>
      </div>
    {/if}
    
    {#if listing.offers && listing.offers.length > 0}
      <div class="mb-4">
        <h4 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Offering:</h4>
        <div class="flex flex-wrap gap-2">
          {#each listing.offers as offer}
            <Badge variant="outline" class="bg-green-50 text-green-800 border-green-200">
              {offer.cardId}
              {#if offer.quantity > 1}
                <span class="ml-1 text-xs">×{offer.quantity}</span>
              {/if}
            </Badge>
          {/each}
        </div>
      </div>
    {/if}
  </CardContent>
  
  <CardFooter class="gap-3">
    <Button class="flex-1">
      Contact Trader
    </Button>
    <Button variant="outline">
      View Details
    </Button>
  </CardFooter>
</Card>

<!-- Converted to use shadcn/ui components -->
