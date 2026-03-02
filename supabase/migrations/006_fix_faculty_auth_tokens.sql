-- Fix existing auth rows created without required token defaults.
-- Symptom fixed: "Database error querying schema" on sign-in.
-- Run this after 004_admin_create_faculty.sql.

update auth.users
set
  confirmation_token = coalesce(confirmation_token, ''),
  email_change = coalesce(email_change, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  recovery_token = coalesce(recovery_token, '')
where
  coalesce(raw_user_meta_data ->> 'role', '') = 'faculty'
  and (
    confirmation_token is null
    or email_change is null
    or email_change_token_new is null
    or recovery_token is null
  );
