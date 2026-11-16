# ลอยกระทงออนไลน์

เว็บลอยกระทงและปล่อยโคมลอยออนไลน์ มีกระทงรูปสัตว์ 9 แบบ โคมลอย 6 แบบ หน้าแชร์ และดาวน์โหลดรูปการ์ด
ใช้ HTML/CSS/JS ล้วน ไม่ต้อง build ไม่มีอิโมจิ (ใช้ไอคอนเส้น SVG และภาพเวกเตอร์ทั้งหมด)

## โครงสร้าง

```
index.html      หน้าเดียว (SPA ใช้ hash route)
config.js       ใส่ค่า Supabase
supabase.sql    สคริปต์สร้างตาราง + สิทธิ์
css/style.css   ดีไซน์ทั้งหมด (สี/ฟอนต์อยู่ใน :root)
js/art.js       ภาพกระทงและโคมลอย (SVG)
js/icons.js     ไอคอนเส้น
js/db.js        ชั้นข้อมูล: Supabase หรือ localStorage
js/app.js       หน้าจอ, router, แชร์, ดาวน์โหลดรูป
```

เส้นทาง: `#/` หน้าแรก, `#/create/krathong`, `#/create/lantern`, `#/w/<id>` หน้าแชร์, `#/river` ดูฉากรวม

## รันในเครื่อง

```
python -m http.server 8080
```

เปิด http://localhost:8080 — ถ้ายังไม่ใส่ค่า Supabase จะเป็น "โหมดทดลอง" เก็บข้อมูลในเบราว์เซอร์นี้เท่านั้น

## เชื่อมฐานข้อมูล Supabase (ฟรี)

1. สมัคร https://supabase.com แล้วสร้างโปรเจกต์
2. เปิด SQL Editor วางเนื้อหา `supabase.sql` แล้วกด Run
3. ไปที่ Project Settings > API คัดลอก Project URL และ `anon` public key
4. ใส่ใน `config.js` (ห้ามใช้ `service_role` key ในหน้าเว็บ)

## ขึ้นเว็บจริง

อัปโหลดทั้งโฟลเดอร์ไป Netlify, Vercel, Cloudflare Pages หรือ GitHub Pages ได้เลย (static site)

## นำดีไซน์จาก Stitch มาใช้

- สี ฟอนต์ มุมโค้ง อยู่ในตัวแปร `:root` บนสุดของ `css/style.css` ปรับตาม Stitch ได้ทันที
- ถ้า export โค้ดจาก Stitch มา ให้คัดลอก HTML ของแต่ละหน้าไปแทน template ในฟังก์ชัน
  `renderHome`, `renderChoose`, `renderWish`, `renderShare` ใน `js/app.js`
  โดยคง `id` ที่ JS ใช้ไว้ (`grid`, `pv`, `next`, `wf`, `fName`, `fWish`, `go`, `copy`, `dl` ฯลฯ)

## ข้อควรรู้

- กรองคำหยาบแบบง่ายในฝั่งเว็บ (`BAD` ใน `js/app.js`) และจำกัด 1 ครั้ง / 20 วินาทีต่อเบราว์เซอร์
- ฝั่งฐานข้อมูลจำกัดความยาวข้อความ และจำกัดรวมทั้งระบบ 30 รายการ / 10 วินาที
- ตัวเลือก "ไม่แสดงในแม่น้ำรวม" แค่ซ่อนจากฉากรวม คนที่มีลิงก์ยังเปิดอ่านได้
- ลิงก์แชร์ใช้ `#` จึงขึ้นภาพตัวอย่างเดียวกันทุกลิงก์บน Facebook/LINE
