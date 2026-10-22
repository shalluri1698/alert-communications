create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text not null unique,
  to_path text not null,
  status int not null default 303,
  source text not null default 'ai',
  confidence numeric,
  reason text,
  hits int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.redirect_misses (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  referrer text,
  hit_count int not null default 1,
  attempts int not null default 0,
  status text not null default 'pending',
  last_error text,
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists redirect_misses_pending_idx
  on public.redirect_misses (status, hit_count desc, last_seen desc);

create table if not exists public.redirect_job_state (
  key text primary key,
  lease_until timestamptz,
  paused boolean not null default false,
  paused_reason text,
  last_run_at timestamptz,
  updated_at timestamptz not null default now()
);
insert into public.redirect_job_state (key) values ('ai-redirects')
  on conflict (key) do nothing;

grant all on public.redirects to service_role;
grant all on public.redirect_misses to service_role;
grant all on public.redirect_job_state to service_role;

alter table public.redirects enable row level security;
alter table public.redirect_misses enable row level security;
alter table public.redirect_job_state enable row level security;