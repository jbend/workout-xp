<script lang="ts">
  import Badge from '$lib/components/ui/badge.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { progress } from '$lib/progress';
  import { activeWorkoutDays, getNextWorkoutDay } from '$lib/data/program';
  import { ArrowRight, Dumbbell, RotateCcw } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: resumeDay = $progress
    ? activeWorkoutDays.find((day) => day.id === $progress?.dayId)
    : undefined;
  $: fallbackDay = data.firstWorkout;
  $: primaryDay = resumeDay ?? fallbackDay;
  $: resumeHref = primaryDay
    ? $progress?.exerciseId
      ? `/workout/${primaryDay.week}/${primaryDay.id}/${$progress.exerciseId}`
      : `/workout/${primaryDay.week}/${primaryDay.id}`
    : '/week/1';
  $: nextDay = getNextWorkoutDay($progress?.dayId);
</script>

<section class="space-y-5">
  <Card className="overflow-hidden p-5">
    <div class="space-y-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <Badge>5x / Week</Badge>
          <h2 class="mt-4 text-3xl font-bold tracking-tight">{data.program.title}</h2>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">
            Navigate the program by week, workout, and exercise. Your last visited exercise stays on
            this device.
          </p>
        </div>
        <span class="rounded-2xl bg-primary/15 p-3 text-primary">
          <Dumbbell size={26} />
        </span>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="rounded-xl bg-muted p-3">
          <p class="text-muted-foreground">Weeks</p>
          <p class="mt-1 text-2xl font-bold">{data.program.weeks.length}</p>
        </div>
        <div class="rounded-xl bg-muted p-3">
          <p class="text-muted-foreground">Workouts</p>
          <p class="mt-1 text-2xl font-bold">{data.totalWorkoutDays}</p>
        </div>
      </div>

      <Button href={resumeHref} size="lg" className="w-full">
        {$progress ? 'Resume Workout' : 'Start Week 1'}
        <ArrowRight size={18} />
      </Button>
    </div>
  </Card>

  {#if $progress && resumeDay}
    <Card className="p-4">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm text-muted-foreground">Last location</p>
          <h3 class="text-lg font-semibold">Week {resumeDay.week}: {resumeDay.title}</h3>
          <p class="mt-1 text-xs text-muted-foreground">
            {$progress.completedExerciseIds.length} exercises completed here
          </p>
        </div>
        <Button href={resumeHref} size="icon" aria-label="Resume last location">
          <RotateCcw size={18} />
        </Button>
      </div>
    </Card>
  {/if}

  {#if nextDay}
    <Card className="p-4">
      <p class="text-sm text-muted-foreground">Next workout in sequence</p>
      <div class="mt-2 flex items-center justify-between gap-3">
        <div>
          <h3 class="text-xl font-bold">Week {nextDay.week}: {nextDay.title}</h3>
          <p class="text-sm text-muted-foreground">{nextDay.exercises.length} exercises</p>
        </div>
        <Button href={`/workout/${nextDay.week}/${nextDay.id}`} variant="secondary">Open</Button>
      </div>
    </Card>
  {/if}

  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold">Program Weeks</h2>
      <span class="text-xs text-muted-foreground">Tap to browse</span>
    </div>

    <div class="grid grid-cols-3 gap-3">
      {#each data.program.weeks as week}
        <a
          href={`/week/${week.week}`}
          class="rounded-2xl border border-border bg-card/70 p-4 text-center font-semibold transition-colors hover:bg-accent"
        >
          <span class="block text-xs text-muted-foreground">Week</span>
          <span class="text-2xl">{week.week}</span>
        </a>
      {/each}
    </div>
  </div>
</section>
