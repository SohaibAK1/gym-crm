-- ═══════════════════════════════════════════════════════════════════
-- Golden Biceps CRM — Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ─────────────────────────────────────────────────────────────────
-- 1. PROFILES  (extends auth.users 1-to-1)
--    Must be first — all other tables and the role helper depend on it.
-- ─────────────────────────────────────────────────────────────────
create table public.profiles (
  id                    uuid        primary key references auth.users(id) on delete cascade,
  role                  text        not null default 'member' check (role in ('admin', 'member')),
  full_name             text,
  phone                 text,
  gender                text        check (gender in ('male', 'female', 'other')),
  date_of_birth         date,
  profile_picture_url   text,
  goal                  text,
  slot                  text        check (slot in ('morning', 'evening', 'both')),
  can_create_routine    boolean     not null default false,
  is_active             boolean     not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ── Trigger: auto-create profile when auth user is created ──────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'member')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Trigger: keep updated_at current ────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ── Role helper (now safe — profiles table exists above) ────────
-- Returns the role of the currently authenticated user.
-- security definer so it runs as the function owner, bypassing RLS.
create or replace function public.get_my_role()
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- ── RLS on profiles ─────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy "profiles_select"
  on public.profiles for select
  using (auth.uid() = id or get_my_role() = 'admin');

create policy "profiles_update"
  on public.profiles for update
  using (auth.uid() = id or get_my_role() = 'admin');


-- ─────────────────────────────────────────────────────────────────
-- 2. MEMBERSHIPS
-- ─────────────────────────────────────────────────────────────────
create table public.memberships (
  id          uuid          primary key default uuid_generate_v4(),
  member_id   uuid          not null references public.profiles(id) on delete cascade,
  plan_type   text          not null check (plan_type in ('monthly', 'quarterly', 'annual')),
  amount      numeric(10,2) not null,
  start_date  date          not null,
  end_date    date          not null,
  is_active   boolean       not null default true,
  notes       text,
  created_by  uuid          references public.profiles(id),
  created_at  timestamptz   not null default now()
);

alter table public.memberships enable row level security;

create policy "memberships_select"
  on public.memberships for select
  using (member_id = auth.uid() or get_my_role() = 'admin');

create policy "memberships_insert"
  on public.memberships for insert
  with check (get_my_role() = 'admin');

create policy "memberships_update"
  on public.memberships for update
  using (get_my_role() = 'admin');

create policy "memberships_delete"
  on public.memberships for delete
  using (get_my_role() = 'admin');


-- ─────────────────────────────────────────────────────────────────
-- 3. ATTENDANCE
-- ─────────────────────────────────────────────────────────────────
create table public.attendance (
  id             uuid        primary key default uuid_generate_v4(),
  member_id      uuid        not null references public.profiles(id) on delete cascade,
  checked_in_at  timestamptz not null default now(),
  slot           text        not null check (slot in ('morning', 'evening')),
  checked_in_by  uuid        references public.profiles(id),
  created_at     timestamptz not null default now()
);

alter table public.attendance enable row level security;

create policy "attendance_select"
  on public.attendance for select
  using (member_id = auth.uid() or get_my_role() = 'admin');

create policy "attendance_insert"
  on public.attendance for insert
  with check (member_id = auth.uid() or get_my_role() = 'admin');

create policy "attendance_delete"
  on public.attendance for delete
  using (get_my_role() = 'admin');


-- ─────────────────────────────────────────────────────────────────
-- 4. ROUTINES
-- ─────────────────────────────────────────────────────────────────
create table public.routines (
  id          uuid        primary key default uuid_generate_v4(),
  member_id   uuid        not null references public.profiles(id) on delete cascade,
  name        text        not null,
  description text,
  is_active   boolean     not null default true,
  created_by  uuid        references public.profiles(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger routines_updated_at
  before update on public.routines
  for each row execute procedure public.set_updated_at();

alter table public.routines enable row level security;

create policy "routines_select"
  on public.routines for select
  using (member_id = auth.uid() or get_my_role() = 'admin');

create policy "routines_insert"
  on public.routines for insert
  with check (
    get_my_role() = 'admin'
    or (
      member_id = auth.uid()
      and (select can_create_routine from public.profiles where id = auth.uid())
    )
  );

create policy "routines_update"
  on public.routines for update
  using (
    get_my_role() = 'admin'
    or (
      member_id = auth.uid()
      and (select can_create_routine from public.profiles where id = auth.uid())
    )
  );

create policy "routines_delete"
  on public.routines for delete
  using (get_my_role() = 'admin');


-- ─────────────────────────────────────────────────────────────────
-- 5. ROUTINE DAYS
-- ─────────────────────────────────────────────────────────────────
create table public.routine_days (
  id         uuid        primary key default uuid_generate_v4(),
  routine_id uuid        not null references public.routines(id) on delete cascade,
  day_name   text        not null,
  sort_order int         not null default 0,
  created_at timestamptz not null default now()
);

alter table public.routine_days enable row level security;

create policy "routine_days_select"
  on public.routine_days for select
  using (
    get_my_role() = 'admin'
    or routine_id in (select id from public.routines where member_id = auth.uid())
  );

create policy "routine_days_insert"
  on public.routine_days for insert
  with check (
    get_my_role() = 'admin'
    or (
      routine_id in (select id from public.routines where member_id = auth.uid())
      and (select can_create_routine from public.profiles where id = auth.uid())
    )
  );

create policy "routine_days_update"
  on public.routine_days for update
  using (
    get_my_role() = 'admin'
    or (
      routine_id in (select id from public.routines where member_id = auth.uid())
      and (select can_create_routine from public.profiles where id = auth.uid())
    )
  );

create policy "routine_days_delete"
  on public.routine_days for delete
  using (get_my_role() = 'admin');


-- ─────────────────────────────────────────────────────────────────
-- 6. EXERCISES
-- ─────────────────────────────────────────────────────────────────
create table public.exercises (
  id              uuid        primary key default uuid_generate_v4(),
  routine_day_id  uuid        not null references public.routine_days(id) on delete cascade,
  name            text        not null,
  sets            int,
  reps            text,
  weight          text,
  rest_seconds    int,
  notes           text,
  sort_order      int         not null default 0,
  created_at      timestamptz not null default now()
);

alter table public.exercises enable row level security;

create policy "exercises_select"
  on public.exercises for select
  using (
    get_my_role() = 'admin'
    or routine_day_id in (
      select rd.id from public.routine_days rd
      join public.routines r on r.id = rd.routine_id
      where r.member_id = auth.uid()
    )
  );

create policy "exercises_insert"
  on public.exercises for insert
  with check (
    get_my_role() = 'admin'
    or (
      routine_day_id in (
        select rd.id from public.routine_days rd
        join public.routines r on r.id = rd.routine_id
        where r.member_id = auth.uid()
      )
      and (select can_create_routine from public.profiles where id = auth.uid())
    )
  );

create policy "exercises_update"
  on public.exercises for update
  using (
    get_my_role() = 'admin'
    or (
      routine_day_id in (
        select rd.id from public.routine_days rd
        join public.routines r on r.id = rd.routine_id
        where r.member_id = auth.uid()
      )
      and (select can_create_routine from public.profiles where id = auth.uid())
    )
  );

create policy "exercises_delete"
  on public.exercises for delete
  using (get_my_role() = 'admin');


-- ─────────────────────────────────────────────────────────────────
-- 7. EXERCISE LOGS
-- ─────────────────────────────────────────────────────────────────
create table public.exercise_logs (
  id              uuid        primary key default uuid_generate_v4(),
  member_id       uuid        not null references public.profiles(id) on delete cascade,
  exercise_id     uuid        not null references public.exercises(id) on delete cascade,
  routine_day_id  uuid        references public.routine_days(id),
  logged_date     date        not null default current_date,
  sets_done       int,
  reps_done       text,
  weight_used     text,
  completed       boolean     not null default false,
  notes           text,
  created_at      timestamptz not null default now()
);

alter table public.exercise_logs enable row level security;

create policy "exercise_logs_select"
  on public.exercise_logs for select
  using (member_id = auth.uid() or get_my_role() = 'admin');

create policy "exercise_logs_insert"
  on public.exercise_logs for insert
  with check (member_id = auth.uid() or get_my_role() = 'admin');

create policy "exercise_logs_update"
  on public.exercise_logs for update
  using (member_id = auth.uid() or get_my_role() = 'admin');

create policy "exercise_logs_delete"
  on public.exercise_logs for delete
  using (member_id = auth.uid() or get_my_role() = 'admin');


-- ─────────────────────────────────────────────────────────────────
-- 8. BODY STATS
-- ─────────────────────────────────────────────────────────────────
create table public.body_stats (
  id            uuid        primary key default uuid_generate_v4(),
  member_id     uuid        not null references public.profiles(id) on delete cascade,
  logged_at     date        not null default current_date,
  weight_kg     numeric(5,2),
  height_cm     numeric(5,2),
  chest_cm      numeric(5,2),
  waist_cm      numeric(5,2),
  hips_cm       numeric(5,2),
  bicep_cm      numeric(5,2),
  body_fat_pct  numeric(4,2),
  notes         text,
  created_at    timestamptz not null default now()
);

alter table public.body_stats enable row level security;

create policy "body_stats_select"
  on public.body_stats for select
  using (member_id = auth.uid() or get_my_role() = 'admin');

create policy "body_stats_insert"
  on public.body_stats for insert
  with check (member_id = auth.uid() or get_my_role() = 'admin');

create policy "body_stats_update"
  on public.body_stats for update
  using (member_id = auth.uid() or get_my_role() = 'admin');

create policy "body_stats_delete"
  on public.body_stats for delete
  using (member_id = auth.uid() or get_my_role() = 'admin');


-- ─────────────────────────────────────────────────────────────────
-- 9. ANNOUNCEMENTS
-- ─────────────────────────────────────────────────────────────────
create table public.announcements (
  id          uuid        primary key default uuid_generate_v4(),
  created_by  uuid        not null references public.profiles(id),
  title       text        not null,
  body        text,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger announcements_updated_at
  before update on public.announcements
  for each row execute procedure public.set_updated_at();

alter table public.announcements enable row level security;

create policy "announcements_select"
  on public.announcements for select
  using (auth.uid() is not null);

create policy "announcements_insert"
  on public.announcements for insert
  with check (get_my_role() = 'admin');

create policy "announcements_update"
  on public.announcements for update
  using (get_my_role() = 'admin');

create policy "announcements_delete"
  on public.announcements for delete
  using (get_my_role() = 'admin');


-- ─────────────────────────────────────────────────────────────────
-- 10. TRAINER NOTES
-- ─────────────────────────────────────────────────────────────────
create table public.trainer_notes (
  id          uuid        primary key default uuid_generate_v4(),
  member_id   uuid        not null references public.profiles(id) on delete cascade,
  admin_id    uuid        not null references public.profiles(id),
  note        text        not null,
  created_at  timestamptz not null default now()
);

alter table public.trainer_notes enable row level security;

create policy "trainer_notes_select"
  on public.trainer_notes for select
  using (member_id = auth.uid() or get_my_role() = 'admin');

create policy "trainer_notes_insert"
  on public.trainer_notes for insert
  with check (get_my_role() = 'admin');

create policy "trainer_notes_update"
  on public.trainer_notes for update
  using (get_my_role() = 'admin');

create policy "trainer_notes_delete"
  on public.trainer_notes for delete
  using (get_my_role() = 'admin');


-- ─────────────────────────────────────────────────────────────────
-- AFTER RUNNING: promote your admin account
--
--   update public.profiles
--   set role = 'admin'
--   where id = '<your-auth-user-uuid>';
--
-- ─────────────────────────────────────────────────────────────────
