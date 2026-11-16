/* ชั้นข้อมูล: ใช้ Supabase ถ้าตั้งค่าไว้ ไม่งั้นเก็บใน localStorage (โหมดทดลอง) */
window.LoyStore = {
  get(k, d) {
    try {
      const v = localStorage.getItem(k);
      return v == null ? d : JSON.parse(v);
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};

window.DB = (() => {
  const cfg = window.LOY_CONFIG || {};
  const remote = !!(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const sb = remote ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;
  const TABLE = 'wishes';
  /* รหัสผู้ใช้แบบไม่ระบุตัวตน (หนึ่งเบราว์เซอร์ = หนึ่งคน) ใช้นับจำนวนผู้ร่วมลอย */
  function visitorId() {
    let v = LoyStore.get('loy.visitor', null);
    if (!v) {
      v = crypto.randomUUID
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, () => ((Math.random() * 16) | 0).toString(16));
      LoyStore.set('loy.visitor', v);
    }
    return v;
  }

  /* ---------- โหมดทดลอง (localStorage) ---------- */
  const KEY = 'loykrathong.wishes.v1';
  const SEED = [
    ['krathong', 'cat', 'มะลิ', 'ขอให้สุขภาพแข็งแรง ทั้งครอบครัว'],
    ['lantern', 'heart', 'ต้นกล้า', 'ขอให้สมหวังในความรัก'],
    ['krathong', 'classic', 'ป้าแดง', 'ขอขมาพระแม่คงคา ขอให้ทำมาค้าขึ้น'],
    ['krathong', 'duck', 'น้ำหวาน', 'ขอให้สอบติดคณะที่หวังไว้'],
    ['lantern', 'star', 'ภูผา', 'ขอให้ความทุกข์ลอยไปกับโคมนี้'],
    ['krathong', 'turtle', 'คุณยาย', 'ขอให้ลูกหลานอยู่เย็นเป็นสุข'],
    ['lantern', 'lanna', 'แก้ว', 'ขอให้การงานรุ่งเรือง'],
    ['krathong', 'bunny', 'ใบเตย', 'ขอให้เจอแต่คนดี ๆ'],
    ['krathong', 'bread', 'ทีมรักษ์น้ำ', 'ลอยกระทงขนมปัง ให้ปลาได้กินด้วย'],
    ['lantern', 'cat', 'ส้มโอ', 'ขอให้น้องแมวที่บ้านแข็งแรง'],
    ['krathong', 'dog', 'โอ๊ต', 'ขอให้ปีหน้าดีกว่าปีนี้'],
    ['lantern', 'moon', 'ฟ้าใส', 'ขอให้ฝันเป็นจริง'],
    ['krathong', 'elephant', 'เจมส์', 'ขอให้ธุรกิจไปได้สวย'],
    ['krathong', 'fish', 'ปลาทู', 'ขอให้แม่น้ำใสสะอาด'],
  ];

  function load() {
    const v = LoyStore.get(KEY, null);
    if (Array.isArray(v)) return v;
    const now = Date.now();
    const seeded = SEED.map(([kind, design, name, wish], i) => ({
      id: i + 1, kind, design, name, wish, is_public: true,
      created_at: new Date(now - (i + 1) * 3600e3).toISOString(),
    }));
    LoyStore.set(KEY, seeded);
    return seeded;
  }

  const local = {
    async list(limit) {
      return load().filter((r) => r.is_public).slice(-limit).reverse();
    },
    async get(id) {
      return load().find((r) => String(r.id) === String(id)) || null;
    },
    async add(row) {
      const all = load();
      const rec = {
        ...row, visitor: visitorId(),
        id: all.reduce((m, r) => Math.max(m, r.id), 0) + 1, created_at: new Date().toISOString(),
      };
      all.push(rec);
      LoyStore.set(KEY, all);
      return rec;
    },
    async counts() {
      const all = load();
      return {
        krathong: all.filter((r) => r.kind === 'krathong').length,
        lantern: all.filter((r) => r.kind === 'lantern').length,
        people: new Set(all.map((r) => r.visitor || r.name)).size,
      };
    },
  };

  /* ---------- Supabase ---------- */
  const cloud = {
    async list(limit) {
      const { data, error } = await sb
        .from(TABLE).select('*').eq('is_public', true)
        .order('created_at', { ascending: false }).limit(limit);
      if (error) throw error;
      return data;
    },
    async get(id) {
      if (!/^\d+$/.test(String(id))) return null;
      const { data, error } = await sb.from(TABLE).select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    },
    async add(row) {
      const payload = { ...row, visitor: visitorId() };
      // ฐานข้อมูลยังไม่มีคอลัมน์ visitor / buddy (ยังไม่ได้รัน SQL อัปเดต) → ตัดคอลัมน์นั้นออกแล้วบันทึกใหม่
      for (;;) {
        const res = await sb.from(TABLE).insert(payload).select().single();
        if (!res.error) return { ...res.data, buddy: res.data.buddy || row.buddy };
        const msg = res.error.message || '';
        const col = ['buddy', 'visitor'].find((c) => c in payload && msg.includes(c));
        if (!col) throw res.error;
        delete payload[col];
      }
    },
    async counts() {
      const q = (kind) => sb.from(TABLE).select('id', { count: 'exact', head: true }).eq('kind', kind);
      const [k, l, p] = await Promise.all([q('krathong'), q('lantern'), sb.rpc('count_people')]);
      if (k.error) throw k.error;
      if (l.error) throw l.error;
      return { krathong: k.count || 0, lantern: l.count || 0, people: p.error ? null : Number(p.data) };
    },
  };

  return { remote, ...(remote ? cloud : local) };
})();
