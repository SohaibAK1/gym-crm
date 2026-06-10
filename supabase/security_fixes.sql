-- ═══════════════════════════════════════════════════════════════════
-- Security fixes — run in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────
-- FIX 1 (Critical) — Lock role/status columns from self-update
--
-- The old single policy let members update ANY column on their own
-- row, including role → 'admin'. Replaced with two policies:
--   • own: members may update only profile/preference fields
--   • admin: admins may update anything
-- ─────────────────────────────────────────────────────────────────
drop policy if exists "profiles_update" on public.profiles;

create policy "profiles_update_own"
  on public.profiles for update
  using  (auth.uid() = id)
  with check (
    auth.uid() = id
    -- role, is_active, can_create_routine must not change
    and role               = (select role               from public.profiles where id = auth.uid())
    and is_active          = (select is_active          from public.profiles where id = auth.uid())
    and can_create_routine = (select can_create_routine from public.profiles where id = auth.uid())
  );

create policy "profiles_update_admin"
  on public.profiles for update
  using (get_my_role() = 'admin');


-- ─────────────────────────────────────────────────────────────────
-- FIX 2 (Critical) — Harden new-user trigger
--
-- Old trigger read role from user_metadata, so anyone who called
-- supabase.auth.signUp({ data: { role: 'admin' } }) would get
-- an admin profile. Now always inserts 'member'.
-- ─────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'member');
  return new;
end;
$$;


-- ─────────────────────────────────────────────────────────────────
-- FIX 3 (Medium) — Prevent duplicate attendance records
--
-- Without this, a member could call the API directly and log the
-- same slot twice on the same day, inflating streak/month counts.
--
-- We need an IMMUTABLE wrapper around the UTC date cast because
-- PostgreSQL won't index a STABLE expression (timestamptz::date
-- depends on the server timezone GUC). Supabase always stores in
-- UTC, so hardcoding 'UTC' here is correct and safe.
-- ─────────────────────────────────────────────────────────────────
create or replace function public.ts_to_utc_date(ts timestamptz)
returns date
language sql
immutable parallel safe
as $$ select (ts at time zone 'UTC')::date $$;

create unique index if not exists attendance_member_slot_date_unique
  on public.attendance (member_id, slot, public.ts_to_utc_date(checked_in_at));


-- ─────────────────────────────────────────────────────────────────
-- FIX 4 (Medium) — Hidden announcements not readable by members
--
-- Old policy: any authenticated user could read ALL announcements.
-- New policy: members only see is_active = true; admins see all.
-- ─────────────────────────────────────────────────────────────────
drop policy if exists "announcements_select" on public.announcements;

create policy "announcements_select"
  on public.announcements for select
  using (
    (is_active = true and auth.uid() is not null)
    or get_my_role() = 'admin'
  );
