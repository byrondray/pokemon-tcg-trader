<!-- PageTransition.svelte - Wrapper for page-level animations -->
<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	
	export let type: 'fade' | 'slide' = 'slide';
	export let duration = 300;
</script>

{#if type === 'slide'}
	<div in:fly={{ y: 30, duration, easing: quintOut }} out:fade={{ duration: 150 }}>
		<slot />
	</div>
{:else}
	<div in:fade={{ duration }} out:fade={{ duration: 150 }}>
		<slot />
	</div>
{/if}
