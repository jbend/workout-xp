-- Draft normalized schema for migrating program.json into Postgres.
-- Stable string ids (workout_days.id, exercises.id) are preserved for client progress.

create table programs (
  id uuid primary key default gen_random_uuid(),
  program_id text not null unique,
  schema_version integer not null,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table program_weeks (
  id uuid primary key default gen_random_uuid(),
  program_uuid uuid not null references programs (id) on delete cascade,
  week_number integer not null,
  title text not null,
  unique (program_uuid, week_number)
);

create table workout_days (
  id uuid primary key default gen_random_uuid(),
  week_uuid uuid not null references program_weeks (id) on delete cascade,
  day_id text not null,
  week_number integer not null,
  day_order integer not null,
  title text not null,
  is_rest_day boolean not null default false,
  unique (week_uuid, day_id)
);

create index workout_days_day_id_idx on workout_days (day_id);

create table exercises (
  id uuid primary key default gen_random_uuid(),
  day_uuid uuid not null references workout_days (id) on delete cascade,
  exercise_id text not null,
  exercise_order integer not null,
  name text not null,
  warmup_sets text not null default '',
  working_sets text not null default '',
  reps text not null default '',
  load text not null default '',
  rpe text not null default '',
  rest text not null default '',
  notes text not null default '',
  unique (day_uuid, exercise_id)
);

create index exercises_exercise_id_idx on exercises (exercise_id);

create table exercise_substitutions (
  id uuid primary key default gen_random_uuid(),
  exercise_uuid uuid not null references exercises (id) on delete cascade,
  sub_order integer not null,
  name text not null,
  video_url text,
  unique (exercise_uuid, sub_order)
);

create table exercise_video_links (
  id uuid primary key default gen_random_uuid(),
  exercise_uuid uuid not null references exercises (id) on delete cascade,
  link_order integer not null,
  label text not null,
  url text not null,
  unique (exercise_uuid, link_order)
);

-- Future user progress tables (not in program.json today):
-- create table user_workout_progress (
--   id uuid primary key default gen_random_uuid(),
--   user_id uuid not null,
--   day_id text not null,
--   exercise_id text,
--   completed_exercise_ids text[] not null default '{}',
--   updated_at timestamptz not null default now(),
--   unique (user_id)
-- );
