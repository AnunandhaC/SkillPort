-- Create profiles table (run this in Supabase Dashboard > SQL Editor)
-- This stores user details (name, email, role, program) for your app

-- 1. Create the profiles table
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  role text default 'student',
  program text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  primary key (id)
);

-- 2. Enable Row Level Security
alter table public.profiles enable row level security;

-- 3. Policies: users can read/update/insert their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 4. Trigger: auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role, program)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'student'),
    new.raw_user_meta_data ->> 'program'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    role = coalesce(excluded.role, profiles.role),
    program = coalesce(excluded.program, profiles.program),
    updated_at = now();
  return new;
end;
$$;

-- Drop existing trigger if it exists (in case you're re-running)
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Backfill: create profiles for any existing auth users who don't have one
insert into public.profiles (id, email, full_name, role, program)
select
  id,
  email,
  coalesce(raw_user_meta_data ->> 'full_name', split_part(email, '@', 1)),
  coalesce(raw_user_meta_data ->> 'role', 'student'),
  raw_user_meta_data ->> 'program'
from auth.users
on conflict (id) do nothing;
