-- Repair migration for existing projects where portfolios.updated_at is missing
-- Run this in Supabase SQL Editor after 002_portfolios.sql

alter table public.portfolios
  add column if not exists updated_at timestamptz default now();

alter table public.portfolios
  add column if not exists created_at timestamptz default now();

alter table public.portfolios
  add column if not exists last_updated timestamptz default now();

create or replace function public.handle_portfolio_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_portfolio_updated_at on public.portfolios;

create trigger set_portfolio_updated_at
  before update on public.portfolios
  for each row execute function public.handle_portfolio_updated_at();
