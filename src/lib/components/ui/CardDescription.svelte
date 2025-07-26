<script lang="ts">
	import { cn } from '$lib/utils';

	let className = '';
	export { className as class };
</script>

<div class={cn('text-muted-foreground text-sm', className)} {...$$restProps}>
	<slot />
</div>
