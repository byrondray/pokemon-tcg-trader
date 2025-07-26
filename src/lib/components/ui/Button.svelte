<script lang="ts">
	import { cn } from '$lib/utils';
	import type { VariantProps } from 'class-variance-authority';
	import { cva } from 'class-variance-authority';

	const buttonVariants = cva(
		'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
		{
			variants: {
				variant: {
					default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
					destructive: 'bg-destructive text-destructive-foreground shadow hover:bg-destructive/90',
					outline:
						'border border-input bg-background shadow hover:bg-accent hover:text-accent-foreground',
					secondary: 'bg-secondary text-secondary-foreground shadow hover:bg-secondary/80',
					ghost: 'hover:bg-accent hover:text-accent-foreground',
					link: 'text-primary underline-offset-4 hover:underline'
				},
				size: {
					default: 'h-9 px-4 py-2',
					sm: 'h-8 rounded-md px-3',
					lg: 'h-10 rounded-md px-6',
					icon: 'h-9 w-9'
				}
			},
			defaultVariants: {
				variant: 'default',
				size: 'default'
			}
		}
	);

	export let variant: VariantProps<typeof buttonVariants>['variant'] = 'default';
	export let size: VariantProps<typeof buttonVariants>['size'] = 'default';
	export let href: string | undefined = undefined;

	let className = '';
	export { className as class };

	$: buttonClass = cn(buttonVariants({ variant, size }), className);
</script>

{#if href}
	<a {href} class={buttonClass} {...$$restProps}>
		<slot />
	</a>
{:else}
	<button class={buttonClass} {...$$restProps}>
		<slot />
	</button>
{/if}
