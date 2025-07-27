<!-- AnimatedCard.svelte - Reusable animated card component -->
<script lang="ts">
	import { Card } from '$lib/components/ui';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	
	export let delay = 0;
	export let hoverable = true;
	export let clickable = false;
	export let href: string | undefined = undefined;
	
	$: cardClass = `${hoverable ? 'card-hover' : ''} ${clickable ? 'cursor-pointer' : ''}`;
</script>

{#if href}
	<a {href} class="block" in:fly={{ y: 20, duration: 400, delay: delay, easing: quintOut }}>
		<Card class={cardClass}>
			<slot />
		</Card>
	</a>
{:else}
	<div in:fly={{ y: 20, duration: 400, delay: delay, easing: quintOut }}>
		<Card class={cardClass} on:click>
			<slot />
		</Card>
	</div>
{/if}
