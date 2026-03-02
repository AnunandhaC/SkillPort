-- Admin utility: create faculty auth users from the app
-- Run this after 001_profiles.sql

create extension if not exists pgcrypto;

create or replace function public.admin_create_faculty(
  p_email text,
  p_password text,
  p_full_name text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
declare
  v_requester uuid;
  v_instance_id uuid;
  v_user_id uuid;
begin
  v_requester := auth.uid();

  if v_requester is null then
    raise exception 'Not authenticated';
  end if;

  if not exists (
    select 1
    from public.profiles p
    where p.id = v_requester
      and p.role = 'admin'
  ) then
    raise exception 'Only admin can create faculty users';
  end if;

  if p_email is null or length(trim(p_email)) = 0 then
    raise exception 'Email is required';
  end if;

  if p_password is null or length(p_password) < 6 then
    raise exception 'Password must be at least 6 characters';
  end if;

  if p_full_name is null or length(trim(p_full_name)) = 0 then
    raise exception 'Full name is required';
  end if;

  if exists (select 1 from auth.users u where lower(u.email) = lower(trim(p_email))) then
    raise exception 'A user with this email already exists';
  end if;

  select id into v_instance_id from auth.instances limit 1;
  if v_instance_id is null then
    v_instance_id := '00000000-0000-0000-0000-000000000000'::uuid;
  end if;

  v_user_id := gen_random_uuid();

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  values (
    v_instance_id,
    v_user_id,
    'authenticated',
    'authenticated',
    lower(trim(p_email)),
    crypt(p_password, gen_salt('bf')),
    now(),
    '',
    '',
    '',
    '',
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', trim(p_full_name), 'role', 'faculty'),
    now(),
    now()
  );

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    v_user_id,
    jsonb_build_object('sub', v_user_id::text, 'email', lower(trim(p_email))),
    'email',
    lower(trim(p_email)),
    now(),
    now()
  );

  insert into public.profiles (id, email, full_name, role, program)
  values (v_user_id, lower(trim(p_email)), trim(p_full_name), 'faculty', null)
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    updated_at = now();

  return v_user_id;
end;
$$;

revoke all on function public.admin_create_faculty(text, text, text) from public;
grant execute on function public.admin_create_faculty(text, text, text) to authenticated;
