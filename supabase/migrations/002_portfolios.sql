-- Create portfolios table (run this after 001_profiles.sql)
-- Stores each student's portfolio content in Supabase

create table if not exists public.portfolios (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  about text default '',
  skills jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  certifications jsonb not null default '[]'::jsonb,
  template_id text default 'modern',
  score numeric,
  last_updated timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.portfolios enable row level security;

-- Public portfolio pages can read portfolios
create policy "Anyone can view portfolios"
  on public.portfolios for select
  using (true);

-- Students can create their own portfolio
create policy "Students can insert own portfolio"
  on public.portfolios for insert
  with check (auth.uid() = student_id);

-- Students can update their own portfolio
create policy "Students can update own portfolio"
  on public.portfolios for update
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

-- Faculty/Admin can update portfolios (e.g., score/evaluation)
create policy "Faculty and admin can update portfolios"
  on public.portfolios for update
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('faculty', 'admin')
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('faculty', 'admin')
    )
  );

-- Keep updated_at fresh
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
