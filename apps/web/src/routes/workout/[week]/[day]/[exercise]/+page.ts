import { error } from '@sveltejs/kit';
import { getExercise, getWorkoutDay } from '$lib/data/program';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const weekNumber = Number(params.week);
  const day = getWorkoutDay(weekNumber, params.day);
  const exercise = getExercise(weekNumber, params.day, params.exercise);

  if (!day || !exercise) {
    error(404, 'Exercise not found');
  }

  const index = day.exercises.findIndex((item) => item.id === exercise.id);

  return {
    day,
    exercise,
    previousExercise: day.exercises[index - 1],
    nextExercise: day.exercises[index + 1],
    position: index + 1
  };
};
