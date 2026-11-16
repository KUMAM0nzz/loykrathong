-- รันใน Supabase > SQL Editor ครั้งเดียว

create table if not exists public.wishes (
  id         bigserial primary key,
  kind       text not null check (kind in ('krathong', 'lantern')),
  design     text not null check (design ~ '^[a-z]{2,20}$'),
  name       text not null check (char_length(name) between 1 and 40),
  wish       text not null check (char_length(wish) between 1 and 150),
  is_public  boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists wishes_public_recent on public.wishes (created_at desc) where is_public;

alter table public.wishes enable row level security;

-- ทุกคนอ่านได้ (หน้าแชร์ต้องเปิดได้จากลิงก์)
-- หมายเหตุ: is_public = false แค่ไม่แสดงในแม่น้ำ/ท้องฟ้ารวม แต่คนที่มีลิงก์ยังเปิดอ่านได้
drop policy if exists "anyone can read" on public.wishes;
create policy "anyone can read" on public.wishes
  for select to anon, authenticated using (true);

-- ทุกคนเพิ่มได้ แต่แก้ไข/ลบไม่ได้ (ไม่มี policy update/delete)
drop policy if exists "anyone can insert" on public.wishes;
create policy "anyone can insert" on public.wishes
  for insert to anon, authenticated with check (true);

-- กันสแปมฝั่งเซิร์ฟเวอร์อย่างง่าย: จำกัดทั้งระบบไม่เกิน 30 รายการต่อ 10 วินาที
create or replace function public.wishes_rate_limit() returns trigger
language plpgsql as $$
begin
  if (select count(*) from public.wishes where created_at > now() - interval '10 seconds') >= 30 then
    raise exception 'rate limit';
  end if;
  return new;
end $$;

drop trigger if exists wishes_rate_limit on public.wishes;
create trigger wishes_rate_limit before insert on public.wishes
  for each row execute function public.wishes_rate_limit();

-- นับจำนวนคนที่ร่วมลอย (เหมือน supabase-update-people.sql)
alter table public.wishes add column if not exists visitor uuid;

create or replace function public.count_people() returns bigint
language sql stable security definer set search_path = public as $$
  select count(distinct coalesce(visitor::text, 'name:' || name)) from public.wishes
$$;

grant execute on function public.count_people() to anon, authenticated;

-- เพื่อนลอยกระทงที่เลือก (เหมือน supabase-update-buddy.sql)
alter table public.wishes add column if not exists buddy text;

alter table public.wishes drop constraint if exists wishes_buddy_check;
alter table public.wishes add constraint wishes_buddy_check
  check (buddy is null or buddy in ('cat', 'dog', 'redpanda'));
