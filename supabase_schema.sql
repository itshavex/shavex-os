-- ShaVex OS - Production Database Schema
-- Run this script in the Supabase SQL Editor to prepare your PostgreSQL database.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Linked to auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  username text,
  goal text default 'AI Engineer',
  level text default 'Beginner',
  target_year text default '2027',
  daily_time text default '4 Hours',
  join_date date default current_date
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- 2. Goals Table
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  target_date date,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for goals
alter table public.goals enable row level security;
create policy "Users can manage own goals" on public.goals for all using (auth.uid() = user_id);
create index idx_goals_user on public.goals(user_id);

-- 3. Roadmaps & Curriculum Tracker Table
create table public.roadmaps (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  track_name text not null, -- 'ai', 'java', 'dsa'
  module_id text not null,
  progress integer default 0,
  hours numeric default 0.0,
  notes text,
  completed boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.roadmaps enable row level security;
create policy "Users can manage own roadmaps" on public.roadmaps for all using (auth.uid() = user_id);
create index idx_roadmaps_user on public.roadmaps(user_id);

-- 4. Resources Hub Table
create table public.resources (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  url text not null,
  category text,
  type text,
  notes text,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.resources enable row level security;
create policy "Users can manage own resources" on public.resources for all using (auth.uid() = user_id);
create index idx_resources_user on public.resources(user_id);

-- 5. Daily Execution Logs Heatmap Table
create table public.daily_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  day_number integer not null,
  studied text,
  internship text,
  dsa text,
  gym boolean default false,
  commit boolean default false,
  wins text,
  challenges text,
  plan text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_day unique(user_id, day_number)
);

alter table public.daily_logs enable row level security;
create policy "Users can manage own daily_logs" on public.daily_logs for all using (auth.uid() = user_id);
create index idx_daily_logs_user on public.daily_logs(user_id);

-- 6. Missions Checklist Table
create table public.missions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  phase text,
  day_counter integer default 1
);

alter table public.missions enable row level security;
create policy "Users can manage own missions" on public.missions for all using (auth.uid() = user_id);

-- 7. Projects Vault Table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  tech_stack text,
  github_url text,
  status text default 'Planned',
  progress_percent integer default 0,
  start_date date,
  end_date date,
  is_ml_model boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.projects enable row level security;
create policy "Users can manage own projects" on public.projects for all using (auth.uid() = user_id);
create index idx_projects_user on public.projects(user_id);

-- 8. Journal Entries Table
create table public.journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  entry_date date default current_date not null,
  content text not null,
  mood text
);

alter table public.journal_entries enable row level security;
create policy "Users can manage own journal_entries" on public.journal_entries for all using (auth.uid() = user_id);

-- 9. Achievements Table
create table public.achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  achievement_id text not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_achievement unique(user_id, achievement_id)
);

alter table public.achievements enable row level security;
create policy "Users can manage own achievements" on public.achievements for all using (auth.uid() = user_id);

-- 10. XP Logs Table
create table public.xp_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount integer not null,
  reason text,
  logged_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.xp_logs enable row level security;
create policy "Users can manage own xp_logs" on public.xp_logs for all using (auth.uid() = user_id);

-- 11. Streaks Table
create table public.streaks (
  user_id uuid references auth.users on delete cascade primary key,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_active_date date default current_date
);

alter table public.streaks enable row level security;
create policy "Users can manage own streaks" on public.streaks for all using (auth.uid() = user_id);

-- 12. Analytics Table
create table public.analytics (
  user_id uuid references auth.users on delete cascade primary key,
  total_study_hours numeric default 0.0,
  total_projects_built integer default 0,
  total_leetcode_solved integer default 0,
  total_commits_count integer default 0,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.analytics enable row level security;
create policy "Users can manage own analytics" on public.analytics for all using (auth.uid() = user_id);

-- 13. Master Workspaces State Sync Table (Backup & easy recovery)
create table public.shavex_os_states (
  user_id uuid references auth.users on delete cascade primary key,
  state jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.shavex_os_states enable row level security;
create policy "Users can view own state" on public.shavex_os_states for select using (auth.uid() = user_id);
create policy "Users can update own state" on public.shavex_os_states for update using (auth.uid() = user_id);
create policy "Users can insert own state" on public.shavex_os_states for insert with check (auth.uid() = user_id);

-- Trigger to automatically create a profile and state on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, username)
  values (new.id, new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  
  insert into public.shavex_os_states (user_id, state)
  values (new.id, '{"onboarded": false, "profile": {"name": "", "level": "Beginner"}}'::jsonb);

  insert into public.streaks (user_id, current_streak, longest_streak)
  values (new.id, 0, 0);

  insert into public.analytics (user_id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
