<script lang="ts">
  import { cn } from '$lib/utils';

  export let variant: 'default' | 'secondary' | 'outline' = 'default';
  export let className = '';

  const variants = {
    default: 'bg-primary/18 text-emerald-100 ring-primary/30',
    secondary: 'bg-secondary text-secondary-foreground ring-border',
    outline: 'text-muted-foreground ring-border'
  };
</script>

<span
  class={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1', variants[variant], className)}
  {...$$restProps}
>
  <slot />
</span>
