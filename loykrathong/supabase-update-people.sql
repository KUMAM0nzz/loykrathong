-- อัปเดต: นับจำนวน "คน" ที่ร่วมลอย (รันใน SQL Editor ครั้งเดียว ต่อจาก supabase.sql)

-- รหัสผู้ใช้แบบไม่ระบุตัวตน หนึ่งเบราว์เซอร์ = หนึ่งคน
alter table public.wishes add column if not exists visitor uuid;

-- นับจำนวนคนไม่ซ้ำ (ข้อมูลเก่าที่ไม่มี visitor นับตามชื่อแทน)
create or replace function public.count_people() returns bigint
language sql stable security definer set search_path = public as $$
  select count(distinct coalesce(visitor::text, 'name:' || name)) from public.wishes
$$;

grant execute on function public.count_people() to anon, authenticated;
