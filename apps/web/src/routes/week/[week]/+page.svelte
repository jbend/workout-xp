<script lang="ts">
  import Badge from '$lib/components/ui/badge.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { ChevronLeft, ChevronRight, Moon, Timer } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: previousWeek = data.weeks.find((week) => week.week === data.week.week - 1);
  $: nextWeek = data.weeks.find((week) => week.week === data.week.week + 1);
</script>

<section class="space-y-5">
  <div class="flex items-center justify-between gap-3">
    <div>
      <Badge>Program</Badge>
      <h2 class="mt-3 text-3xl font-bold">{data.week.title}</h2>
      <p class="mt-1 text-sm text-muted-foreground">Follow the same order you would in the gym week.</p>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-3">
    <Button href={previousWeek ? `/week/${previousWeek.week}` : undefined} variant="secondary" className="w-full" disabled={!previousWeek}>
      <ChevronLeft size={18} />
      Prev
    </Button>
    <Button href={nextWeek ? `/week/${nextWeek.week}` : undefined} variant="secondary" className="w-full" disabled={!nextWeek}>
      Next
      <ChevronRight size={18} />
    </Button>
  </div>

  <div class="space-y-3">
    {#each data.week.days as day}
      {#if day.isRestDay}
        <Card className="p-4">
          <div class="flex items-center gap-3 text-muted-foreground">
            <span class="rounded-xl bg-muted p-3">
              <Moon size={20} />
            </span>
            <div>
              <p class="font-semibold text-foreground">{day.title}</p>
              <p class="text-sm">Recovery day</p>
            </div>
          </div>
        </Card>
      {:else}
        <a href={`/workout/${day.week}/${day.id}`} class="block">
          <Card className="p-4 transition-colors hover:bg-accent">
            <div class="flex items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-2">
                  <Badge variant="secondary">Day {day.order}</Badge>
                  <span class="text-xs text-muted-foreground">Week {day.week}</span>
                </div>
                <h3 class="mt-3 text-2xl font-bold">{day.title}</h3>
                <p class="mt-1 text-sm text-muted-foreground">{day.exercises.length} exercises</p>
              </div>
              <span class="rounded-full bg-primary/15 p-3 text-primary">
                <Timer size={20} />
              </span>
            </div>
          </Card>
        </a>
      {/if}
    {/each}
  </div>
</section>
