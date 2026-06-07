import programData from '@workout-xp/program-data';
import type { WorkoutProgram } from '@workout-xp/program-schema';

export type {
  Exercise,
  ProgramWeek,
  Substitution,
  VideoLink,
  WorkoutDay,
  WorkoutProgram
} from '@workout-xp/program-schema';

export const program = programData as WorkoutProgram;

export const workoutDays = program.weeks.flatMap((week) => week.days);
export const activeWorkoutDays = workoutDays.filter((day) => !day.isRestDay);

export function getWeek(weekNumber: number) {
  return program.weeks.find((week) => week.week === weekNumber);
}

export function getWorkoutDay(weekNumber: number, dayId: string) {
  return getWeek(weekNumber)?.days.find((day) => day.id === dayId);
}

export function getExercise(weekNumber: number, dayId: string, exerciseId: string) {
  return getWorkoutDay(weekNumber, dayId)?.exercises.find((exercise) => exercise.id === exerciseId);
}

export function getNextWorkoutDay(currentDayId?: string) {
  if (!currentDayId) {
    return activeWorkoutDays[0];
  }

  const currentIndex = activeWorkoutDays.findIndex((day) => day.id === currentDayId);
  return activeWorkoutDays[currentIndex + 1] ?? activeWorkoutDays[0];
}
