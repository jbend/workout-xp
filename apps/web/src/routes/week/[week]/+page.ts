import { error } from '@sveltejs/kit';
import { getWeek, program } from '$lib/data/program';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
  const weekNumber = Number(params.week);
  const week = getWeek(weekNumber);

  if (!week) {
    error(404, 'Week not found');
  }

  return {
    week,
    weeks: program.weeks
  };
};
