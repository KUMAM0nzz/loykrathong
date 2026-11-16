-- อัปเดต: บันทึก "เพื่อนลอยกระทง" ที่ผู้ใช้เลือก (รันใน SQL Editor ครั้งเดียว ต่อจาก supabase.sql)

alter table public.wishes add column if not exists buddy text;

alter table public.wishes drop constraint if exists wishes_buddy_check;
alter table public.wishes add constraint wishes_buddy_check
  check (buddy is null or buddy in ('cat', 'dog', 'redpanda'));
