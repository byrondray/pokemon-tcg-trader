<script lang="ts">
	import { cn } from '$lib/utils';

	let className = '';
	export { className as class };
</script>

<div class={cn('leading-none font-semibold', className)} {...$$restProps}>
	<slot />
</div>
