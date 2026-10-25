-- =============================================================================
-- Wura Interiors — initial schema, row-level security and storage policies
-- Run in the Supabase SQL editor, or with `supabase db push`.
-- =============================================================================

-- ---------- Enums ------------------------------------------------------------
create type public.project_status as enum ('draft', 'published', 'archived');
create type public.service_status as enum ('draft', 'published');

-- ---------- Profiles (administrators) ---------------------------------------
-- A row here is what makes an auth user an administrator. Rows are NOT created
-- automatically on sign-up, so a stranger who manages to register can never
-- become an admin. See README → "Create the first administrator".
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'admin' check (role in ('admin')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and p.is_active
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Categories -------------------------------------------------------
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 60),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- Projects ---------------------------------------------------------
create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (char_length(title) between 2 and 140),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary       text check (char_length(summary) <= 300),
  description   text check (char_length(description) <= 10000),
  category_id   uuid references public.categories (id) on delete set null,
  location      text check (char_length(location) <= 120),
  completed_on  date,
  featured      boolean not null default false,
  status        public.project_status not null default 'draft',
  published_at  timestamptz,
  created_by    uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index projects_status_published_idx on public.projects (status, published_at desc);
create index projects_category_idx on public.projects (category_id);

-- ---------- Project images ---------------------------------------------------
create table public.project_images (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references public.projects (id) on delete cascade,
  storage_path  text not null check (storage_path like 'projects/%' or storage_path like '/images/%'),
  caption       text check (char_length(caption) <= 200),
  alt_text      text check (char_length(alt_text) <= 250),
  width         integer check (width > 0),
  height        integer check (height > 0),
  sort_order    integer not null default 0,
  is_cover      boolean not null default false,
  created_at    timestamptz not null default now()
);

create index project_images_project_idx on public.project_images (project_id, sort_order);
-- At most one cover image per project.
create unique index project_images_one_cover on public.project_images (project_id) where is_cover;

-- ---------- Services ---------------------------------------------------------
create table public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 2 and 120),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  summary     text check (char_length(summary) <= 300),
  description text check (char_length(description) <= 10000),
  sort_order  integer not null default 0,
  status      public.service_status not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- Site settings (single row) --------------------------------------
-- Every optional column is NULL until the client supplies / approves the fact.
create table public.site_settings (
  id                 smallint primary key default 1 check (id = 1),
  business_name      text not null default 'Wura Interiors',
  tagline            text,
  whatsapp_number    text check (whatsapp_number ~ '^\+[1-9][0-9]{7,14}$'),
  email              text,
  phone              text,
  address            text,
  instagram_url      text,
  facebook_url       text,
  tiktok_url         text,
  logo_path          text,
  about_story        text,
  design_philosophy  text,
  founder_name       text,
  founder_bio        text,
  updated_at         timestamptz not null default now()
);

insert into public.site_settings (id, business_name) values (1, 'Wura Interiors')
on conflict (id) do nothing;

-- ---------- Triggers ---------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger services_touch before update on public.services
  for each row execute function public.touch_updated_at();
create trigger site_settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- Projects: maintain timestamps and refuse to publish a project with no photos.
create or replace function public.guard_project_publish()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();

  if new.status = 'published' then
    if not exists (select 1 from public.project_images i where i.project_id = new.id) then
      raise exception 'A project needs at least one image before it can be published.'
        using errcode = 'P0001';
    end if;
    if new.published_at is null then
      new.published_at := now();
    end if;
  end if;

  return new;
end;
$$;

create trigger projects_guard before insert or update on public.projects
  for each row execute function public.guard_project_publish();

-- ---------- Table privileges (RLS below does the real gatekeeping) ----------
grant select on public.categories, public.projects, public.project_images,
                public.services, public.site_settings to anon, authenticated;
grant insert, update, delete on public.categories, public.projects,
                public.project_images, public.services to authenticated;
grant insert, update on public.site_settings to authenticated;
grant select on public.profiles to authenticated;

-- ---------- Row-level security ----------------------------------------------
alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.projects       enable row level security;
alter table public.project_images enable row level security;
alter table public.services       enable row level security;
alter table public.site_settings  enable row level security;

-- profiles: a user can read their own row; admins can read all. No client
-- writes at all — profiles are managed from the SQL editor / dashboard.
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles: admins read all" on public.profiles
  for select to authenticated using (public.is_admin());

-- categories: public read, admin write.
create policy "categories: public read" on public.categories
  for select to anon, authenticated using (true);
create policy "categories: admin write" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- projects: the public only ever sees published rows. Admins see everything.
create policy "projects: public read published" on public.projects
  for select to anon, authenticated using (status = 'published');
create policy "projects: admin all" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- project_images: public can read images of published projects only.
create policy "project_images: public read published" on public.project_images
  for select to anon, authenticated
  using (exists (
    select 1 from public.projects p
    where p.id = project_images.project_id and p.status = 'published'
  ));
create policy "project_images: admin all" on public.project_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- services: public read published only.
create policy "services: public read published" on public.services
  for select to anon, authenticated using (status = 'published');
create policy "services: admin all" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- site_settings: contains only information intended for the public site.
create policy "site_settings: public read" on public.site_settings
  for select to anon, authenticated using (true);
create policy "site_settings: admin insert" on public.site_settings
  for insert to authenticated with check (public.is_admin());
create policy "site_settings: admin update" on public.site_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Storage ----------------------------------------------------------
-- Buckets are public-read (images are served from the CDN by URL) but the
-- listing API is admin-only, and uploads are restricted by size, MIME type and
-- by an admin-only policy. File names are random UUIDs, so draft photographs
-- cannot be discovered by guessing.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-images', 'project-images', true, 10485760,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('brand-assets', 'brand-assets', true, 2097152,
    array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "storage: admin read" on storage.objects
  for select to authenticated
  using (bucket_id in ('project-images', 'brand-assets') and public.is_admin());
create policy "storage: admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('project-images', 'brand-assets') and public.is_admin());
create policy "storage: admin update" on storage.objects
  for update to authenticated
  using (bucket_id in ('project-images', 'brand-assets') and public.is_admin())
  with check (bucket_id in ('project-images', 'brand-assets') and public.is_admin());
create policy "storage: admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('project-images', 'brand-assets') and public.is_admin());
