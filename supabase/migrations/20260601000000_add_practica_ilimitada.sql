alter table public.profiles
  add column if not exists practica_ilimitada boolean not null default false;
