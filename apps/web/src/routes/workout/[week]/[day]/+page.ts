import { error } from '@sveltejs/kit';
import { getWorkoutDay } from '$lib/data/program';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const weekNumber = Number(params.week);
  const day = getWorkoutDay(weekNumber, params.day);

  if (!day) {
    error(404, 'Workout not found');
  }

  return { day };
};
