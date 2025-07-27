<!-- LoadingSpinner.svelte - Beautiful loading animation -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let text = 'Loading...';
	export let showText = true;
	
	$: sizeClass = {
		sm: 'w-4 h-4',
		md: 'w-8 h-8', 
		lg: 'w-12 h-12'
	}[size];
</script>

<div 
	class="flex flex-col items-center justify-center p-8"
	in:fade={{ duration: 200 }}
	out:fade={{ duration: 200 }}
>
	<div class="relative {sizeClass}">
		<!-- Pokéball-inspired spinner -->
		<div class="absolute inset-0 rounded-full border-4 border-primary/20"></div>
		<div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
		<div class="absolute inset-2 rounded-full bg-primary/10"></div>
		<div class="absolute inset-3 rounded-full bg-white border border-primary/30"></div>
	</div>
	
	{#if showText}
		<p class="mt-4 text-sm text-muted-foreground animate-pulse">{text}</p>
	{/if}
</div>

<style>
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	
	.animate-spin {
		animation: spin 1s linear infinite;
	}
</style>
