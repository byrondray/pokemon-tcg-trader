<!-- src/lib/components/ListingCard.svelte -->
<script lang="ts">
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

<div class="listing-card">
  <div class="listing-header">
    <h3 class="listing-title">{listing.title}</h3>
    <span class="listing-time">{timeAgo(new Date(listing.createdAt))}</span>
  </div>
  
  {#if listing.description}
    <p class="listing-description">{listing.description}</p>
  {/if}
  
  <div class="listing-cards">
    {#if listing.wants && listing.wants.length > 0}
      <div class="card-section">
        <h4 class="section-title">Looking for:</h4>
        <div class="card-list">
          {#each listing.wants as want}
            <div class="card-item want">
              <span class="card-name">{want.cardId}</span>
              {#if want.quantity > 1}
                <span class="quantity">x{want.quantity}</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    {#if listing.offers && listing.offers.length > 0}
      <div class="card-section">
        <h4 class="section-title">Offering:</h4>
        <div class="card-list">
          {#each listing.offers as offer}
            <div class="card-item offer">
              <span class="card-name">{offer.cardId}</span>
              {#if offer.quantity > 1}
                <span class="quantity">x{offer.quantity}</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  
  <div class="listing-actions">
    <button class="contact-button">
      Contact Trader
    </button>
    <button class="view-button">
      View Details
    </button>
  </div>
</div>

<style>
  .listing-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
  }
  
  .listing-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #d1d5db;
  }
  
  .listing-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  
  .listing-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }
  
  .listing-time {
    color: #6b7280;
    font-size: 0.875rem;
    white-space: nowrap;
  }
  
  .listing-description {
    margin: 0 0 1rem 0;
    color: #4b5563;
    line-height: 1.5;
  }
  
  .listing-cards {
    margin-bottom: 1.5rem;
  }
  
  .card-section {
    margin-bottom: 1rem;
  }
  
  .card-section:last-child {
    margin-bottom: 0;
  }
  
  .section-title {
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .card-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .card-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .card-item.want {
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #f59e0b;
  }
  
  .card-item.offer {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #10b981;
  }
  
  .quantity {
    background: rgba(0, 0, 0, 0.1);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }
  
  .listing-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .contact-button {
    flex: 1;
    padding: 0.75rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .contact-button:hover {
    background: #2563eb;
  }
  
  .view-button {
    padding: 0.75rem 1rem;
    background: transparent;
    color: #6b7280;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .view-button:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    color: #374151;
  }
</style>
