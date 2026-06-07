import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'workout-xp.progress.v1';

export type ProgressState = {
  week: number;
  dayId: string;
  exerciseId?: string;
  completedExerciseIds: string[];
  updatedAt: string;
};

function readProgress(): ProgressState | null {
  if (!browser) {
    return null;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as ProgressState;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function createProgressStore() {
  const store = writable<ProgressState | null>(readProgress());

  if (browser) {
    store.subscribe((value) => {
      if (!value) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    });
  }

  return store;
}

export const progress = createProgressStore();

export function rememberLocation(week: number, dayId: string, exerciseId?: string) {
  progress.update((current) => ({
    week,
    dayId,
    exerciseId,
    completedExerciseIds: current?.dayId === dayId ? current.completedExerciseIds : [],
    updatedAt: new Date().toISOString()
  }));
}

export function markExerciseComplete(
  week: number,
  dayId: string,
  exerciseId: string,
  nextExerciseId?: string
) {
  progress.update((current) => {
    const completed = new Set(current?.dayId === dayId ? current.completedExerciseIds : []);
    completed.add(exerciseId);

    return {
      week,
      dayId,
      exerciseId: nextExerciseId ?? exerciseId,
      completedExerciseIds: [...completed],
      updatedAt: new Date().toISOString()
    };
  });
}

export function clearProgress() {
  progress.set(null);
}
