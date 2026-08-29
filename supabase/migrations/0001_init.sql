-- RentFlow V1 schema
-- 단일 건물 / 단일 관리자(admin) 전제. 모든 테이블은 authenticated 사용자만 접근 가능(RLS).

-- ===== extensions =====
create extension if not exists "pgcrypto";

-- ===== enums =====
create type tenant_status as enum ('active', 'moved_out');
create type contract_status as enum ('ACTIVE', 'TERMINATED');
create type payment_status as enum ('PENDING', 'PAID');

-- ===== rooms =====
create table rooms (
  id uuid primary key default gen_random_uuid(),
  floor smallint not null check (floor between 1 and 4),
  room_number text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===== tenants =====
create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  birth_date date,
  memo text,
  room_id uuid references rooms(id) on delete set null,
  move_in_date date not null,
  move_out_date date,
  status tenant_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 호실당 현재(active) 세입자는 1명만 허용
create unique index tenants_room_active_unique
  on tenants (room_id)
  where status = 'active' and room_id is not null;

create index tenants_status_idx on tenants (status);

-- ===== contracts =====
create table contracts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  room_id uuid not null references rooms(id),
  deposit numeric(12, 0) not null default 0,
  monthly_rent numeric(12, 0) not null default 0,
  maintenance_fee numeric(12, 0) not null default 0,
  start_date date not null,
  end_date date not null,
  status contract_status not null default 'ACTIVE',
  is_renewal boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create index contracts_tenant_idx on contracts (tenant_id);
create index contracts_room_idx on contracts (room_id);

-- ===== contract_documents (계약서, Supabase Storage 참조) =====
create table contract_documents (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  mime_type text not null,
  uploaded_at timestamptz not null default now()
);

create index contract_documents_contract_idx on contract_documents (contract_id);

-- ===== payments (월세 납부 내역) =====
create table payments (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  room_id uuid not null references rooms(id),
  year int not null,
  month smallint not null check (month between 1 and 12),
  due_date date not null,
  monthly_rent numeric(12, 0) not null default 0,
  maintenance_fee numeric(12, 0) not null default 0,
  total_amount numeric(12, 0) not null default 0,
  paid_amount numeric(12, 0),
  paid_date date,
  memo text,
  status payment_status not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (contract_id, year, month)
);

create index payments_status_idx on payments (status);
create index payments_room_idx on payments (room_id);
create index payments_tenant_idx on payments (tenant_id);
create index payments_year_month_idx on payments (year, month);

-- ===== updated_at 자동 갱신 =====
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger rooms_set_updated_at before update on rooms
  for each row execute function set_updated_at();
create trigger tenants_set_updated_at before update on tenants
  for each row execute function set_updated_at();
create trigger contracts_set_updated_at before update on contracts
  for each row execute function set_updated_at();
create trigger payments_set_updated_at before update on payments
  for each row execute function set_updated_at();

-- ===== RLS: 인증된 관리자만 접근 =====
alter table rooms enable row level security;
alter table tenants enable row level security;
alter table contracts enable row level security;
alter table contract_documents enable row level security;
alter table payments enable row level security;

create policy "authenticated full access" on rooms
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on tenants
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on contracts
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on contract_documents
  for all to authenticated using (true) with check (true);
create policy "authenticated full access" on payments
  for all to authenticated using (true) with check (true);

-- ===== Storage: 계약서 파일 (private bucket) =====
insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', false)
on conflict (id) do nothing;

create policy "authenticated read contracts bucket"
  on storage.objects for select to authenticated
  using (bucket_id = 'contracts');

create policy "authenticated upload contracts bucket"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'contracts');

create policy "authenticated update contracts bucket"
  on storage.objects for update to authenticated
  using (bucket_id = 'contracts');

create policy "authenticated delete contracts bucket"
  on storage.objects for delete to authenticated
  using (bucket_id = 'contracts');
