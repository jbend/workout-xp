<script lang="ts">
  import { cn } from '$lib/utils';

  export let href: string | undefined = undefined;
  export let variant: 'default' | 'secondary' | 'ghost' | 'outline' = 'default';
  export let size: 'default' | 'sm' | 'lg' | 'icon' = 'default';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled = false;
  export let className = '';

  const variants = {
    default: 'bg-primary text-primary-foreground shadow-glow hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground'
  };

  const sizes = {
    default: 'h-11 px-5 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-12 rounded-xl px-6',
    icon: 'h-11 w-11'
  };

  $: classes = cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className
  );
</script>

{#if href && !disabled}
  <a {href} class={classes} {...$$restProps}>
    <slot />
  </a>
{:else}
  <button {type} class={classes} {disabled} on:click {...$$restProps}>
    <slot />
  </button>
{/if}
