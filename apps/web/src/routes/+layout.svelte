<script lang="ts">
  import '../app.css';
  import { Activity, CalendarDays, Home } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Workout XP</title>
  <meta
    name="description"
    content="A mobile-first navigator for the Essentials 5x per week workout program."
  />
</svelte:head>

<div class="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-28 pt-5">
  <header class="mb-5 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3" aria-label="Workout XP home">
      <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary">
        <Activity size={22} />
      </span>
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Jeff Nippard</p>
        <h1 class="text-xl font-bold text-foreground">Essentials</h1>
      </div>
    </a>
  </header>

  <main class="flex-1">
    <slot />
  </main>
</div>

<nav
  class="safe-bottom fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md border-t border-border bg-background/92 px-4 pt-3 backdrop-blur"
  aria-label="Primary navigation"
>
  <div class="grid grid-cols-2 gap-3">
    <a
      href="/"
      class="flex h-12 items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-semibold text-secondary-foreground"
    >
      <Home size={18} />
      Home
    </a>
    <a
      href="/week/1"
      class="flex h-12 items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-semibold text-secondary-foreground"
    >
      <CalendarDays size={18} />
      Program
    </a>
  </div>
</nav>
