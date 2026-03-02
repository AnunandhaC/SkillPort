-- Add flexible metadata storage for template-specific fields
-- Required for BArch template details (name, education, contact links, images, etc.)

alter table public.portfolios
add column if not exists meta jsonb not null default '{}'::jsonb;
