-- Add dedicated eligibility fields used for opportunity matching.
-- Run this after 002_portfolios.sql.

alter table public.portfolios
add column if not exists family_income numeric,
add column if not exists current_gpa numeric;
