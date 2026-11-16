// คัดลอกไฟล์เว็บ (static) ไปไว้ใน dist สำหรับ deploy บน Vercel
// ไม่ใช้ Vite build เพราะ Vite จะข้ามไฟล์ <script> ที่ไม่ใช่ type="module"
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';

const OUT = 'dist';
const FILES = ['index.html', 'config.js', 'css', 'js'];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
for (const f of FILES) {
  if (!existsSync(f)) throw new Error(`ไม่พบ ${f}`);
  cpSync(f, `${OUT}/${f}`, { recursive: true });
}
console.log(`copied ${FILES.join(', ')} -> ${OUT}/`);
