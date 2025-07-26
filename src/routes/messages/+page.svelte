<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui';
  import { Button } from '$lib/components/ui';

  export let data: PageData;

  onMount(() => {
    // Initialize messages page
  });
</script>

<svelte:head>
  <title>Messages - Pokemon TCG Trader</title>
  <meta name="description" content="View your trading conversations and messages" />
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="text-3xl font-bold">Messages</h1>
      <p class="text-muted-foreground mt-2">Your trading conversations</p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Conversations List -->
    <div class="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          {#each data.conversations as conversation}
            <div class="p-3 border rounded mb-2 hover:bg-muted cursor-pointer">
              <p class="font-medium">{conversation.otherUser}</p>
              <p class="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
              <p class="text-xs text-muted-foreground">{conversation.timestamp}</p>
            </div>
          {:else}
            <p class="text-center text-muted-foreground py-8">No conversations yet</p>
          {/each}
        </CardContent>
      </Card>
    </div>

    <!-- Chat Area -->
    <div class="lg:col-span-2">
      <Card class="h-96">
        <CardHeader>
          <CardTitle>Select a Conversation</CardTitle>
        </CardHeader>
        <CardContent class="flex items-center justify-center h-full">
          <p class="text-muted-foreground">Choose a conversation to start chatting</p>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
