create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'participant' check (role in ('admin', 'participant')),
  created_at timestamptz not null default now()
);

create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) >= 2),
  category text not null,
  description text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved')),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint votes_candidate_user_unique unique (candidate_id, user_id)
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists candidates_status_idx on public.candidates(status);
create index if not exists candidates_category_idx on public.candidates(category);
create index if not exists candidates_created_at_idx on public.candidates(created_at desc);
create index if not exists votes_candidate_id_idx on public.votes(candidate_id);
create index if not exists votes_user_id_idx on public.votes(user_id);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, coalesce(new.email, ''), 'participant')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.candidates enable row level security;
alter table public.votes enable row level security;

drop policy if exists "Users can read own profile and admins can read profiles" on public.profiles;
create policy "Users can read own profile and admins can read profiles"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can create own participant profile" on public.profiles;
create policy "Users can create own participant profile"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid() and role = 'participant');

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users can read approved candidates own candidates and admins can read all" on public.candidates;
create policy "Users can read approved candidates own candidates and admins can read all"
  on public.candidates for select
  using (status = 'approved' or created_by = auth.uid() or public.is_admin());

drop policy if exists "Authenticated users can submit candidates" on public.candidates;
create policy "Authenticated users can submit candidates"
  on public.candidates for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and (status = 'pending' or public.is_admin())
  );

drop policy if exists "Admins can moderate candidates" on public.candidates;
create policy "Admins can moderate candidates"
  on public.candidates for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete candidates" on public.candidates;
create policy "Admins can delete candidates"
  on public.candidates for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Anyone can read votes" on public.votes;
create policy "Anyone can read votes"
  on public.votes for select
  using (true);

drop policy if exists "Authenticated users can vote for approved candidates" on public.votes;
create policy "Authenticated users can vote for approved candidates"
  on public.votes for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.candidates
      where candidates.id = votes.candidate_id
        and candidates.status = 'approved'
    )
  );

drop policy if exists "Users can remove own votes or admins can remove votes" on public.votes;
create policy "Users can remove own votes or admins can remove votes"
  on public.votes for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- After creating the first user, make an admin manually:
-- update public.profiles set role = 'admin' where email = 'admin@example.com';
