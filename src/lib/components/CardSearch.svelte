<!-- src/lib/components/CardSearch.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Input, Button, Badge, Card, CardContent } from '$lib/components/ui';
  
  const dispatch = createEventDispatcher();
  
  let searchQuery = '';
  let selectedSet = '';
  let isLoading = false;
  let searchResults: any[] = [];
  
  async function performSearch() {
    if (!searchQuery.trim()) return;
    
    isLoading = true;
    try {
      const params = new URLSearchParams({
        name: searchQuery,
        ...(selectedSet && { set: selectedSet })
      });
      
      const response = await fetch(`/api/cards/search?${params}`);
      const result = await response.json();
      
      if (result.success) {
        searchResults = result.data.cards;
      } else {
        console.error('Search failed:', result.error);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function selectCard(card: any) {
    dispatch('cardSelected', card);
  }
</script>

<div class="w-full space-y-4">
  <div class="flex gap-4">
    <Input
      bind:value={searchQuery}
      placeholder="Search for Pokemon cards..."
      class="flex-1"
      on:keydown={(e) => e.detail?.key === 'Enter' && performSearch()}
    />
    
    <select 
      bind:value={selectedSet} 
      class="px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
    >
      <option value="">All Sets</option>
      <!-- Add set options dynamically -->
    </select>
    
    <Button 
      on:click={performSearch}
      disabled={isLoading || !searchQuery.trim()}
    >
      {isLoading ? 'Searching...' : 'Search'}
    </Button>
  </div>
  
  {#if searchResults.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
      {#each searchResults as card}
        <Card class="cursor-pointer hover:shadow-md transition-shadow" on:click={() => selectCard(card)} on:keydown>
          <CardContent class="flex gap-4 p-4">
            {#if card.image}
              <img src={card.image} alt={card.name} class="w-15 h-21 object-cover rounded" />
            {/if}
            <div class="flex-1 space-y-2">
              <h4 class="font-semibold text-lg">{card.name}</h4>
              <p class="text-muted-foreground text-sm">{card.set?.name || 'Unknown Set'}</p>
              {#if card.types}
                <div class="flex gap-1 flex-wrap">
                  {#each card.types as type}
                    <Badge variant="secondary" class="text-xs">{type}</Badge>
                  {/each}
                </div>
              {/if}
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
  {/if}
</div>

<!-- Converted to use shadcn/ui components -->
