<script lang="ts">
  import Badge from '$lib/components/ui/badge.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { rememberLocation, progress } from '$lib/progress';
  import { CheckCircle2, ChevronRight, ListChecks } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  onMount(() => {
    if (!data.day.isRestDay) {
      rememberLocation(data.day.week, data.day.id);
    }
  });
</script>

<section class="space-y-5">
  <Card className="p-5">
    <div class="flex items-start justify-between gap-4">
      <div>
        <Badge>Week {data.day.week}</Badge>
        <h2 class="mt-3 text-3xl font-bold">{data.day.title}</h2>
        <p class="mt-2 text-sm text-muted-foreground">
          {data.day.exercises.length} exercises. Open each movement for cues, substitutions, and videos.
        </p>
      </div>
      <span class="rounded-2xl bg-primary/15 p-3 text-primary">
        <ListChecks size={24} />
      </span>
    </div>
  </Card>

  <div class="space-y-3">
    {#each data.day.exercises as exercise}
      {@const isComplete = $progress?.dayId === data.day.id && $progress.completedExerciseIds.includes(exercise.id)}
      <a href={`/workout/${data.day.week}/${data.day.id}/${exercise.id}`} class="block">
        <Card className="p-4 transition-colors hover:bg-accent">
          <div class="flex items-center gap-4">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground"
            >
              {exercise.order}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <h3 class="truncate text-lg font-bold">{exercise.name}</h3>
                {#if isComplete}
                  <CheckCircle2 class="shrink-0 text-primary" size={17} />
                {/if}
              </div>
              <p class="mt-1 text-sm text-muted-foreground">
                {exercise.workingSets} sets · {exercise.reps} reps · RPE {exercise.rpe}
              </p>
            </div>
            <ChevronRight class="shrink-0 text-muted-foreground" size={20} />
          </div>
        </Card>
      </a>
    {/each}
  </div>

  {#if data.day.exercises[0]}
    <Button
      href={`/workout/${data.day.week}/${data.day.id}/${data.day.exercises[0].id}`}
      size="lg"
      className="w-full"
    >
      Start Exercises
      <ChevronRight size={18} />
    </Button>
  {/if}
</section>
