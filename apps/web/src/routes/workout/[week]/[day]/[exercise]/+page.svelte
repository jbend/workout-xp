<script lang="ts">
  import Badge from '$lib/components/ui/badge.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Card from '$lib/components/ui/card.svelte';
  import { markExerciseComplete, progress, rememberLocation } from '$lib/progress';
  import { ArrowLeft, ArrowRight, Check, ExternalLink, Video } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: isComplete =
    $progress?.dayId === data.day.id && $progress.completedExerciseIds.includes(data.exercise.id);

  onMount(() => {
    rememberLocation(data.day.week, data.day.id, data.exercise.id);
  });

  function completeExercise() {
    markExerciseComplete(
      data.day.week,
      data.day.id,
      data.exercise.id,
      data.nextExercise?.id
    );
  }
</script>

<section class="space-y-5">
  <div class="flex items-center justify-between gap-3">
    <Button href={`/workout/${data.day.week}/${data.day.id}`} variant="ghost">
      <ArrowLeft size={18} />
      Workout
    </Button>
    <Badge>
      {data.position} / {data.day.exercises.length}
    </Badge>
  </div>

  <Card className="p-5">
    <div class="space-y-4">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Week {data.day.week} · {data.day.title}
        </p>
        <h2 class="mt-3 text-3xl font-bold leading-tight">{data.exercise.name}</h2>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl bg-muted p-3">
          <p class="text-xs text-muted-foreground">Warm-up</p>
          <p class="mt-1 text-xl font-bold">{data.exercise.warmupSets || '-'}</p>
        </div>
        <div class="rounded-xl bg-muted p-3">
          <p class="text-xs text-muted-foreground">Working</p>
          <p class="mt-1 text-xl font-bold">{data.exercise.workingSets || '-'}</p>
        </div>
        <div class="rounded-xl bg-muted p-3">
          <p class="text-xs text-muted-foreground">Reps</p>
          <p class="mt-1 text-xl font-bold">{data.exercise.reps || '-'}</p>
        </div>
        <div class="rounded-xl bg-muted p-3">
          <p class="text-xs text-muted-foreground">RPE</p>
          <p class="mt-1 text-xl font-bold">{data.exercise.rpe || '-'}</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <Badge variant="secondary">Rest {data.exercise.rest || '-'}</Badge>
        {#if data.exercise.load}
          <Badge variant="secondary">Load {data.exercise.load}</Badge>
        {/if}
      </div>
    </div>
  </Card>

  {#if data.exercise.notes}
    <Card className="p-4">
      <h3 class="font-bold">Cues and Notes</h3>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">{data.exercise.notes}</p>
    </Card>
  {/if}

  <Card className="p-4">
    <h3 class="font-bold">Substitutions</h3>
    {#if data.exercise.substitutions.length}
      <div class="mt-3 space-y-2">
        {#each data.exercise.substitutions as substitution}
          {#if substitution.videoUrl}
            <a
              href={substitution.videoUrl}
              target="_blank"
              rel="noreferrer"
              class="flex items-center justify-between rounded-xl bg-muted p-3 text-sm font-semibold"
            >
              {substitution.name}
              <ExternalLink size={16} />
            </a>
          {:else}
            <div class="rounded-xl bg-muted p-3 text-sm font-semibold">{substitution.name}</div>
          {/if}
        {/each}
      </div>
    {:else}
      <p class="mt-2 text-sm text-muted-foreground">No substitutions listed.</p>
    {/if}
  </Card>

  <Card className="p-4">
    <div class="flex items-center gap-2">
      <Video size={18} class="text-primary" />
      <h3 class="font-bold">Videos</h3>
    </div>
    {#if data.exercise.videoLinks.length}
      <div class="mt-3 space-y-2">
        {#each data.exercise.videoLinks as link}
          <a
            href={link.url}
            target="_blank"
            rel="noreferrer"
            class="flex items-center justify-between rounded-xl bg-muted p-3 text-sm font-semibold"
          >
            {link.label}
            <ExternalLink size={16} />
          </a>
        {/each}
      </div>
    {:else}
      <p class="mt-2 text-sm text-muted-foreground">No videos linked for this exercise.</p>
    {/if}
  </Card>

  <Button on:click={completeExercise} size="lg" className="w-full" variant={isComplete ? 'secondary' : 'default'}>
    <Check size={18} />
    {isComplete ? 'Completed' : 'Mark Complete'}
  </Button>

  <div class="grid grid-cols-2 gap-3">
    <Button
      href={data.previousExercise
        ? `/workout/${data.day.week}/${data.day.id}/${data.previousExercise.id}`
        : undefined}
      variant="secondary"
      disabled={!data.previousExercise}
    >
      <ArrowLeft size={18} />
      Prev
    </Button>
    <Button
      href={data.nextExercise
        ? `/workout/${data.day.week}/${data.day.id}/${data.nextExercise.id}`
        : `/workout/${data.day.week}/${data.day.id}`}
      variant="secondary"
    >
      {data.nextExercise ? 'Next' : 'Done'}
      <ArrowRight size={18} />
    </Button>
  </div>
</section>
