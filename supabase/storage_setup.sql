-- Run this once in Supabase Dashboard → SQL Editor

-- 1. Create the avatars bucket (public — URLs are not sensitive)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 2. Members can upload their own avatar
create policy "avatars_insert_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and name like (auth.uid()::text || '/%')
  );

-- 3. Members can overwrite their own avatar
create policy "avatars_update_own" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and name like (auth.uid()::text || '/%')
  );

-- 4. Members can delete their own avatar
create policy "avatars_delete_own" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and name like (auth.uid()::text || '/%')
  );
