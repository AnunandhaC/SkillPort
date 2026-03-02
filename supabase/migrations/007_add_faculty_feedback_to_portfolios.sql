-- Add faculty suggestion/feedback text to each portfolio.
-- Run this after 002_portfolios.sql.

alter table public.portfolios
add column if not exists faculty_feedback text default '';
