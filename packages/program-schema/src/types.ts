/** Canonical program data shape. Keep in sync with program.schema.json and postgres.sql. */

export const PROGRAM_SCHEMA_VERSION = 1;

export type VideoLink = {
  label: string;
  url: string;
};

export type Substitution = {
  name: string;
  videoUrl?: string | null;
};

export type Exercise = {
  /** Stable id within a workout day, used for resume/progress tracking. */
  id: string;
  order: number;
  name: string;
  warmupSets: string;
  workingSets: string;
  reps: string;
  load: string;
  rpe: string;
  rest: string;
  substitutions: Substitution[];
  notes: string;
  videoLinks: VideoLink[];
};

export type WorkoutDay = {
  /** Stable id across the program, used for resume/progress tracking. */
  id: string;
  week: number;
  order: number;
  title: string;
  isRestDay: boolean;
  exercises: Exercise[];
};

export type ProgramWeek = {
  week: number;
  title: string;
  days: WorkoutDay[];
};

export type WorkoutProgram = {
  schemaVersion: typeof PROGRAM_SCHEMA_VERSION;
  programId: string;
  title: string;
  weeks: ProgramWeek[];
};
