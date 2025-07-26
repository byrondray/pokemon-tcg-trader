<!-- src/lib/components/CardSearch.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
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

<div class="card-search">
  <div class="search-form">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search for Pokemon cards..."
      class="search-input"
      on:keydown={(e) => e.key === 'Enter' && performSearch()}
    />
    
    <select bind:value={selectedSet} class="set-select">
      <option value="">All Sets</option>
      <!-- Add set options dynamically -->
    </select>
    
    <button 
      on:click={performSearch}
      disabled={isLoading || !searchQuery.trim()}
      class="search-button"
    >
      {isLoading ? 'Searching...' : 'Search'}
    </button>
  </div>
  
  {#if searchResults.length > 0}
    <div class="search-results">
      {#each searchResults as card}
        <div class="card-result" on:click={() => selectCard(card)} on:keydown>
          {#if card.image}
            <img src={card.image} alt={card.name} class="card-image" />
          {/if}
          <div class="card-info">
            <h4>{card.name}</h4>
            <p>{card.set?.name || 'Unknown Set'}</p>
            {#if card.types}
              <div class="card-types">
                {#each card.types as type}
                  <span class="type-badge">{type}</span>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .card-search {
    width: 100%;
  }
  
  .search-form {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .search-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-size: 1rem;
  }
  
  .set-select {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    background: white;
  }
  
  .search-button {
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
  }
  
  .search-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
  
  .search-results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .card-result {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .card-result:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  }
  
  .card-image {
    width: 60px;
    height: 84px;
    object-fit: cover;
    border-radius: 0.25rem;
  }
  
  .card-info {
    flex: 1;
  }
  
  .card-info h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .card-info p {
    margin: 0 0 0.5rem 0;
    color: #6b7280;
    font-size: 0.9rem;
  }
  
  .card-types {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
  }
  
  .type-badge {
    padding: 0.125rem 0.5rem;
    background: #f3f4f6;
    color: #374151;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
  }
</style>
