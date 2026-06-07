import { activeWorkoutDays, getNextWorkoutDay, program } from '$lib/data/program';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  return {
    program,
    firstWorkout: getNextWorkoutDay(),
    totalWorkoutDays: activeWorkoutDays.length
  };
};
