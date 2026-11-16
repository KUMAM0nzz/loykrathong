/* ภาพประกอบกระทงและโคมลอยแบบเวกเตอร์ (SVG) — ไม่มีอิโมจิ */
window.ART = (() => {
  let uid = 0;
  const f = (v) => +v.toFixed(2);

  const COMMON =
    '<radialGradient id="glow-UID"><stop offset="0" stop-color="#FFD27A" stop-opacity=".85"/>' +
    '<stop offset=".45" stop-color="#FFB85C" stop-opacity=".35"/><stop offset="1" stop-color="#FFB85C" stop-opacity="0"/></radialGradient>';

  function wrap(vb, body, defs = '') {
    const u = 'a' + ++uid;
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" class="art" aria-hidden="true">` +
      `<defs>${(COMMON + defs).split('UID').join(u)}</defs>${body.split('UID').join(u)}</svg>`
    );
  }

  /* bare = true: ฐานใบตอง เทียน ธูป ไม่ถูกวาด (ใช้ดึงเฉพาะตัวตรงกลางของกระทงสำเร็จรูปไปใช้ในโหมดสร้างเอง) */
  let bare = false;

  /* ---------- ชิ้นส่วนพื้นฐาน ---------- */
  const flame = (x, y, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})">` +
    `<circle class="glow" cx="0" cy="-8" r="18" fill="url(#glow-UID)"/>` +
    `<path class="flame" d="M0-17C5-10 6.5-4.5 0 0-6.5-4.5-5-10 0-17Z" fill="#FFC24D"/>` +
    `<path class="flame" d="M0-10C2.6-6.5 3-3 0-1-3-3-2.6-6.5 0-10Z" fill="#FFF6D8"/></g>`;

  const candle = (x, y) =>
    bare ? '' :
    `<rect x="${x - 3.5}" y="${y - 15}" width="7" height="15" rx="2.5" fill="#FFF4DD"/>` +
    `<rect x="${x - 3.5}" y="${y - 15}" width="7" height="4" rx="2" fill="#FFE3A3"/>` +
    `<line x1="${x}" y1="${y - 15}" x2="${x}" y2="${y - 18}" stroke="#4A3428" stroke-width="1.2"/>` +
    flame(x, y - 18, 0.9);

  const incense = (x, y) =>
    bare ? '' :
    `<path d="M${x} ${y}l-4-26M${x + 4} ${y}l2-26" stroke="#B9746A" stroke-width="1.6" stroke-linecap="round"/>` +
    `<circle cx="${x - 4}" cy="${y - 26}" r="1.6" fill="#FF8A5B"/><circle cx="${x + 6}" cy="${y - 26}" r="1.6" fill="#FF8A5B"/>`;

  const flower = (x, y, r = 4, c = '#F7B2C4') =>
    [0, 72, 144, 216, 288]
      .map((a) => {
        const t = (a * Math.PI) / 180;
        return `<circle cx="${f(x + Math.cos(t) * r)}" cy="${f(y + Math.sin(t) * r)}" r="${f(r * 0.75)}" fill="${c}"/>`;
      })
      .join('') + `<circle cx="${x}" cy="${y}" r="${f(r * 0.6)}" fill="#FFE08A"/>`;

  /* หน้าน่ารัก: ตาจุด แก้มชมพู ปากรูปตัว w */
  const face = (cx, cy, r, eye = '#3A2A2E') => {
    const ex = r * 0.36, ey = cy - r * 0.02, er = Math.max(2, r * 0.1);
    return (
      `<circle cx="${f(cx - ex)}" cy="${f(ey)}" r="${f(er)}" fill="${eye}"/>` +
      `<circle cx="${f(cx + ex)}" cy="${f(ey)}" r="${f(er)}" fill="${eye}"/>` +
      `<circle cx="${f(cx - ex + er * 0.35)}" cy="${f(ey - er * 0.4)}" r="${f(er * 0.35)}" fill="#fff"/>` +
      `<circle cx="${f(cx + ex + er * 0.35)}" cy="${f(ey - er * 0.4)}" r="${f(er * 0.35)}" fill="#fff"/>` +
      `<ellipse cx="${f(cx - r * 0.6)}" cy="${f(cy + r * 0.25)}" rx="${f(r * 0.16)}" ry="${f(r * 0.1)}" fill="#FF8FA8" opacity=".6"/>` +
      `<ellipse cx="${f(cx + r * 0.6)}" cy="${f(cy + r * 0.25)}" rx="${f(r * 0.16)}" ry="${f(r * 0.1)}" fill="#FF8FA8" opacity=".6"/>` +
      `<path d="M${f(cx - r * 0.14)} ${f(cy + r * 0.2)}q${f(r * 0.07)} ${f(r * 0.11)} ${f(r * 0.14)} 0q${f(r * 0.07)} ${f(r * 0.11)} ${f(r * 0.14)} 0" ` +
      `fill="none" stroke="${eye}" stroke-width="${f(Math.max(1.2, r * 0.05))}" stroke-linecap="round"/>`
    );
  };

  const lotus = (cx, cy, s = 1, p = ['#F7B2C4', '#F59AB3', '#FBC8D5', '#F28AA5']) =>
    `<g transform="translate(${cx} ${cy}) scale(${s})">` +
    `<path d="M0 0C-26-2-34-18-32-26-20-24-8-14 0 0Z" fill="${p[0]}"/>` +
    `<path d="M0 0C26-2 34-18 32-26 20-24 8-14 0 0Z" fill="${p[0]}"/>` +
    `<path d="M0 0C-16-6-20-26-14-36-6-30 0-16 0 0Z" fill="${p[1]}"/>` +
    `<path d="M0 0C16-6 20-26 14-36 6-30 0-16 0 0Z" fill="${p[1]}"/>` +
    `<path d="M0 0C-9-10-9-32 0-44 9-32 9-10 0 0Z" fill="${p[2]}"/>` +
    `<ellipse cx="0" cy="0" rx="22" ry="5" fill="${p[3]}"/></g>`;

  /* ฐานกระทงใบตอง */
  const leafBase = (c1 = '#4E9A5E', c2 = '#7CC48A', rim = '#3B7A4A', dot = '#F7B2C4') => {
    if (bare) return '';
    const dc = [].concat(dot);
    let petals = '';
    for (let i = 0; i < 9; i++) {
      const x = 28 + i * 18, h = 22 + (i % 2 ? 0 : 6);
      petals +=
        `<path d="M${x - 11} 142C${x - 9} ${f(142 - h * 0.6)} ${x - 3} ${f(142 - h * 0.9)} ${x} ${142 - h}` +
        `C${x + 3} ${f(142 - h * 0.9)} ${x + 9} ${f(142 - h * 0.6)} ${x + 11} 142Z" fill="${i % 2 ? c2 : c1}" stroke="${rim}" stroke-width="1"/>`;
    }
    let dots = '';
    for (let i = 0; i < 5; i++) dots += flower(40 + i * 30, 145, 3.6, dc[i % dc.length]);
    return (
      `<ellipse cx="100" cy="158" rx="84" ry="8" fill="#050B1C" opacity=".35"/>${petals}` +
      `<path d="M18 140Q100 128 182 140L176 152Q100 166 24 152Z" fill="${rim}"/>` +
      `<path d="M22 141Q100 131 178 141" stroke="${c2}" stroke-width="3" fill="none"/>${dots}`
    );
  };

  /* ---------- กระทง (viewBox 0 0 200 170) ---------- */
  const K = {
    classic: () =>
      leafBase() + incense(48, 140) + lotus(100, 138, 1.15) + face(100, 112, 13) + candle(150, 140),

    cat: () =>
      leafBase() +
      `<path d="M74 92L70 60 94 78Z" fill="#F7A55B"/><path d="M77 86L75 68 88 78Z" fill="#FFC9C9"/>` +
      `<path d="M126 92L130 60 106 78Z" fill="#F7A55B"/><path d="M123 86L125 68 112 78Z" fill="#FFC9C9"/>` +
      `<ellipse cx="100" cy="108" rx="34" ry="30" fill="#F7A55B"/>` +
      `<path d="M100 79v9M92 81l2 7M108 81l-2 7" stroke="#E07F35" stroke-width="3" stroke-linecap="round"/>` +
      `<ellipse cx="100" cy="120" rx="13" ry="8" fill="#FFE7CC"/>` +
      face(100, 110, 30) +
      `<path d="M66 113H54M66 119l-11 3M134 113h12M134 119l11 3" stroke="#7A4A2A" stroke-width="1.5" stroke-linecap="round"/>` +
      flower(80, 80, 4) + flower(90, 75, 3.5, '#FFD95E') +
      candle(152, 140),

    dog: () =>
      leafBase() +
      `<path d="M72 92L74 60 95 80Z" fill="#E08F45"/><path d="M77 86L78 68 89 79Z" fill="#FFE7CC"/>` +
      `<path d="M128 92L126 60 105 80Z" fill="#E08F45"/><path d="M123 86L122 68 111 79Z" fill="#FFE7CC"/>` +
      `<ellipse cx="100" cy="108" rx="34" ry="30" fill="#EFA65A"/>` +
      `<path d="M67 112C70 128 86 137 100 137 114 137 130 128 133 112 120 122 110 117 100 117 90 117 80 122 67 112Z" fill="#FFF4E6"/>` +
      `<circle cx="88" cy="95" r="2.6" fill="#FFF4E6"/><circle cx="112" cy="95" r="2.6" fill="#FFF4E6"/>` +
      face(100, 108, 30) +
      `<ellipse cx="100" cy="111" rx="3.6" ry="2.6" fill="#3A2A2E"/>` +
      `<path d="M78 132Q100 142 122 132L113 141Q100 147 87 141Z" fill="#F28AA5"/>` +
      candle(152, 140),

    bunny: () =>
      leafBase() +
      `<ellipse cx="86" cy="62" rx="9" ry="26" fill="#FFFFFF" transform="rotate(-12 86 62)"/>` +
      `<ellipse cx="86" cy="64" rx="4.5" ry="18" fill="#FFC2D1" transform="rotate(-12 86 64)"/>` +
      `<ellipse cx="114" cy="62" rx="9" ry="26" fill="#FFFFFF" transform="rotate(12 114 62)"/>` +
      `<ellipse cx="114" cy="64" rx="4.5" ry="18" fill="#FFC2D1" transform="rotate(12 114 64)"/>` +
      `<ellipse cx="100" cy="110" rx="32" ry="28" fill="#FFFFFF"/>` +
      face(100, 112, 28) +
      flower(120, 44, 4.5, '#F7B2C4') +
      candle(150, 140),

    duck: () =>
      leafBase() +
      `<ellipse cx="106" cy="124" rx="40" ry="18" fill="#FFD95E"/>` +
      `<path d="M142 118l12-12-2 18Z" fill="#FFD95E"/>` +
      `<path d="M108 120q14-9 26 2q-12 8-26-2Z" fill="#F5C33B"/>` +
      `<circle cx="84" cy="96" r="23" fill="#FFD95E"/>` +
      face(84, 94, 23) +
      `<ellipse cx="84" cy="104" rx="9" ry="5" fill="#FF9F43"/>` +
      flower(74, 74, 4.2, '#F7B2C4') +
      candle(42, 142),

    turtle: () =>
      leafBase() +
      `<ellipse cx="66" cy="136" rx="10" ry="6" fill="#8FD19E"/><ellipse cx="134" cy="136" rx="10" ry="6" fill="#8FD19E"/>` +
      `<circle cx="152" cy="114" r="17" fill="#8FD19E"/>` +
      face(152, 114, 17) +
      `<path d="M56 134C56 92 144 92 144 134Z" fill="#5FAF74"/>` +
      `<path d="M100 104l12 8v14l-12 8-12-8v-14Z" fill="#7CC48A" stroke="#3B7A4A" stroke-width="1.5"/>` +
      `<path d="M70 126l10-10 8 4M130 126l-10-10-8 4" stroke="#3B7A4A" stroke-width="1.5" fill="none"/>` +
      `<path d="M54 134H146" stroke="#3B7A4A" stroke-width="4" stroke-linecap="round"/>` +
      candle(100, 104),

    fish: () =>
      leafBase() +
      `<path d="M138 114L168 94 162 116 168 138Z" fill="#F59A3B"/>` +
      `<ellipse cx="102" cy="116" rx="44" ry="26" fill="#F6B940"/>` +
      `<path d="M92 92Q106 72 124 94Z" fill="#F59A3B"/>` +
      `<path d="M112 104q6 6 0 12M124 106q6 6 0 12M118 116q6 6 0 12" stroke="#E5962A" stroke-width="2" fill="none"/>` +
      face(84, 114, 22) +
      `<circle cx="52" cy="96" r="4" fill="none" stroke="#BFE3FF" stroke-width="1.5"/><circle cx="44" cy="84" r="2.5" fill="none" stroke="#BFE3FF" stroke-width="1.5"/>` +
      candle(40, 142),

    elephant: () =>
      leafBase() +
      `<ellipse cx="66" cy="104" rx="20" ry="24" fill="#AEB0D6"/><ellipse cx="68" cy="104" rx="12" ry="15" fill="#F7C6D3"/>` +
      `<ellipse cx="134" cy="104" rx="20" ry="24" fill="#AEB0D6"/><ellipse cx="132" cy="104" rx="12" ry="15" fill="#F7C6D3"/>` +
      `<ellipse cx="100" cy="104" rx="30" ry="28" fill="#C3C5E6"/>` +
      `<path d="M94 118C92 132 96 141 106 141 112 141 114 135 110 133 104 135 104 128 106 118Z" fill="#C3C5E6"/>` +
      `<path d="M86 80L100 66 114 80Q100 88 86 80Z" fill="#F4C46A"/><circle cx="100" cy="76" r="3" fill="#F28AA5"/>` +
      face(100, 102, 26) +
      candle(152, 140),

    bread: () =>
      `<ellipse cx="100" cy="158" rx="84" ry="8" fill="#050B1C" opacity=".35"/>` +
      `<path d="M22 144C22 124 178 124 178 144 178 158 22 158 22 144Z" fill="#D9A35F"/>` +
      `<path d="M32 138C46 130 154 130 168 138" stroke="#F2CE93" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M58 146l8-6M88 146l8-6M118 146l8-6M148 146l8-6" stroke="#B57A3C" stroke-width="2.5" stroke-linecap="round"/>` +
      flower(68, 130, 6) + flower(132, 130, 6, '#FFD95E') +
      lotus(100, 134, 0.8) + face(100, 115, 10) +
      `<g transform="translate(156 112)"><circle r="12" fill="#9ED9B6"/><path d="M-5 5C-5-4 2-7 6-7 6 0 2 5-5 5Z" fill="#3B7A4A"/></g>` +
      candle(44, 138),
  };

  /* ---------- โคมลอย (viewBox 0 0 160 200) ---------- */
  const lgDefs = (light, dark) =>
    `<radialGradient id="lg-UID" cx=".5" cy=".62" r=".65"><stop offset="0" stop-color="#FFF8E1"/>` +
    `<stop offset=".45" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></radialGradient>`;
  const halo = `<circle class="glow" cx="80" cy="100" r="80" fill="url(#glow-UID)" opacity=".75"/>`;
  const burner = (y = 156) =>
    `<path d="M42 ${y - 2}L80 ${y + 16} 118 ${y - 2}" stroke="#6B4A3A" stroke-width="1.2" fill="none"/>` + flame(80, y + 18, 0.8);
  const bodyPath = 'M44 40C56 22 104 22 116 40L124 150C108 166 52 166 36 150Z';

  const starPath = (cx, cy, R, r) => {
    let p = '';
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r : R;
      p += (i ? 'L' : 'M') + f(cx + Math.cos(a) * rr) + ' ' + f(cy + Math.sin(a) * rr);
    }
    return p + 'Z';
  };

  const L = {
    classic: {
      c: ['#FFC27A', '#F07F3C'],
      b: () =>
        halo + `<path d="${bodyPath}" fill="url(#lg-UID)"/>` +
        `<path d="M60 30L54 158M80 26V164M100 30L106 158" stroke="#C0612E" stroke-opacity=".35" stroke-width="1.5" fill="none"/>` +
        `<path d="M36 150C52 166 108 166 124 150" stroke="#C0612E" stroke-width="3" fill="none"/>` + burner(),
    },
    star: {
      c: ['#FFE38A', '#F4B740'],
      b: () =>
        halo +
        `<path d="${starPath(80, 100, 70, 34)}" fill="url(#lg-UID)" stroke="url(#lg-UID)" stroke-width="12" stroke-linejoin="round"/>` +
        face(80, 104, 26) + `<path d="M80 166v14" stroke="#F4C46A" stroke-width="2"/>` + flame(80, 194, 0.7),
    },
    heart: {
      c: ['#FFC7D6', '#F27A9B'],
      b: () =>
        halo +
        `<path d="M80 168C30 134 16 106 16 80 16 54 34 36 56 36 68 36 76 42 80 52 84 42 92 36 104 36 126 36 144 54 144 80 144 106 130 134 80 168Z" fill="url(#lg-UID)"/>` +
        face(80, 92, 30) + `<path d="M80 168v12" stroke="#F4C46A" stroke-width="2"/>` + flame(80, 194, 0.7),
    },
    cat: {
      c: ['#FFD9A8', '#F2A65A'],
      b: () =>
        halo +
        `<path d="M50 42L46 10 74 28Z" fill="#F2A65A"/><path d="M110 42L114 10 86 28Z" fill="#F2A65A"/>` +
        `<path d="M53 36L51 18 66 28Z" fill="#FFC9C9"/><path d="M107 36L109 18 94 28Z" fill="#FFC9C9"/>` +
        `<path d="${bodyPath}" fill="url(#lg-UID)"/>` +
        face(80, 96, 40) +
        `<path d="M42 102H30M42 110l-11 3M118 102h12M118 110l11 3" stroke="#B5703A" stroke-width="1.6" stroke-linecap="round"/>` +
        `<path d="M36 150C52 166 108 166 124 150" stroke="#D98A45" stroke-width="3" fill="none"/>` + burner(),
    },
    moon: {
      c: ['#FFF1B8', '#F4C46A'],
      b: () =>
        halo +
        `<path d="M104 40A60 60 0 1 0 104 152A58 58 0 0 1 104 40Z" fill="url(#lg-UID)"/>` +
        face(44, 98, 16) +
        `<path d="${starPath(112, 70, 9, 4)}" fill="#FFF1B8"/><path d="${starPath(122, 116, 6, 2.6)}" fill="#FFF1B8"/>` +
        `<path d="M70 150v24" stroke="#F4C46A" stroke-width="2"/>` + flame(70, 190, 0.7),
    },
    lanna: {
      c: ['#FFB38A', '#E2553E'],
      b: () =>
        halo +
        `<path d="M80 36V12" stroke="#F4C46A" stroke-width="2"/>` +
        `<ellipse cx="80" cy="96" rx="50" ry="58" fill="url(#lg-UID)"/>` +
        `<path d="M80 38C50 60 50 132 80 154M80 38C110 60 110 132 80 154M80 38V154" stroke="#B83A2A" stroke-opacity=".45" stroke-width="1.5" fill="none"/>` +
        `<rect x="54" y="34" width="52" height="9" rx="4" fill="#F4C46A"/><rect x="54" y="148" width="52" height="9" rx="4" fill="#F4C46A"/>` +
        `<path d="M66 157v24M80 157v30M94 157v24" stroke="#F4C46A" stroke-width="3" stroke-linecap="round"/>` +
        face(80, 96, 26),
    },
  };

  const KRATHONGS = [
    { id: 'classic', name: 'กระทงใบตองคลาสสิก' },
    { id: 'cat', name: 'กระทงแมวเหมียว' },
    { id: 'dog', name: 'กระทงหมาน้อย' },
    { id: 'bunny', name: 'กระทงกระต่าย' },
    { id: 'duck', name: 'กระทงเป็ดน้อย' },
    { id: 'turtle', name: 'กระทงเต่าน้อย' },
    { id: 'fish', name: 'กระทงปลาทอง' },
    { id: 'elephant', name: 'กระทงช้างน้อย' },
    { id: 'bread', name: 'กระทงขนมปังรักษ์ปลา' },
  ];
  const LANTERNS = [
    { id: 'classic', name: 'โคมลอยคลาสสิก' },
    { id: 'star', name: 'โคมดาว' },
    { id: 'heart', name: 'โคมหัวใจ' },
    { id: 'cat', name: 'โคมแมวเหมียว' },
    { id: 'moon', name: 'โคมพระจันทร์' },
    { id: 'lanna', name: 'โคมล้านนา' },
  ];

  /* ---------- โหมดสร้างกระทงเอง ----------
     รหัสแบบ: "x" + ฐาน + ตรงกลาง + ดอกไม้ + เทียน(y/n) + ธูป(y/n) + ของประดับ เช่น "xacayya"
     เป็นตัวพิมพ์เล็กล้วน 7 ตัว จึงผ่าน check (design ~ '^[a-z]{2,20}$') ในฐานข้อมูลเดิมได้เลย */
  const BUILD = {
    base: {
      a: { name: 'ใบตองเขียว', p: ['#4E9A5E', '#7CC48A', '#3B7A4A'] },
      b: { name: 'ใบเตยอ่อน', p: ['#7CC48A', '#B5E3A1', '#4E9A5E'] },
      c: { name: 'ขนมปัง', bread: true },
      d: { name: 'ดอกอัญชัน', p: ['#6B5BC4', '#9C8CF0', '#4A3D96'] },
    },
    top: {
      a: { name: 'บัวชมพู', id: 'classic', c: [150, 140] },
      b: { name: 'บัวขาว', white: true, c: [150, 140] },
      c: { name: 'แมว', id: 'cat', c: [152, 140] },
      d: { name: 'หมา', id: 'dog', c: [152, 140] },
      e: { name: 'กระต่าย', id: 'bunny', c: [150, 140] },
      f: { name: 'เป็ด', id: 'duck', c: [42, 142] },
      g: { name: 'เต่า', id: 'turtle', c: [100, 104] },
      h: { name: 'ช้าง', id: 'elephant', c: [152, 140] },
      i: { name: 'ปลาทอง', id: 'fish', c: [40, 142] },
      j: { name: 'รูปของฉัน', photo: true, c: [152, 140] },
    },
    flower: {
      a: { name: 'ชมพู', c: ['#F7B2C4'] },
      b: { name: 'ดาวเรือง', c: ['#FFB347'] },
      c: { name: 'มะลิ', c: ['#FFFFFF'] },
      d: { name: 'ม่วง', c: ['#C9A7FF'] },
      e: { name: 'หลากสี', c: ['#F7B2C4', '#FFB347', '#FFFFFF', '#C9A7FF', '#9ED9B6'] },
    },
    deco: {
      a: { name: 'ไม่มี' },
      b: { name: 'ประกายดาว' },
      c: { name: 'หัวใจ' },
      d: { name: 'ผีเสื้อ' },
    },
  };
  const BUILD_DEFAULT = { base: 'a', top: 'a', flower: 'a', candle: 'y', incense: 'y', deco: 'a' };
  const BUILD_RE = /^x([a-d])([a-j])([a-e])([yn])([yn])([a-d])$/;
  /* รูปที่รับ: data URL ที่ย่อแล้วเท่านั้น (เก็บในเครื่องคนลอย) */
  const PHOTO_RE = /^data:image\/(webp|jpeg);base64,[A-Za-z0-9+/=]+$/;
  const PHOTO = { cx: 100, cy: 100, r: 31 };
  const encode = (o) => 'x' + o.base + o.top + o.flower + o.candle + o.incense + o.deco;
  const decode = (id) => {
    const m = BUILD_RE.exec(String(id || ''));
    return m && { base: m[1], top: m[2], flower: m[3], candle: m[4], incense: m[5], deco: m[6] };
  };

  const heart = (x, y, s, c) =>
    `<path transform="translate(${x} ${y}) scale(${s})" d="M0 6C-7 1-9-3-6-6-4-8-1-7 0-4 1-7 4-8 6-6 9-3 7 1 0 6Z" fill="${c}"/>`;
  const butterfly = (x, y) =>
    `<g transform="translate(${x} ${y}) rotate(-12)"><ellipse cx="-6" cy="-4" rx="6.5" ry="5" fill="#F7B2C4"/><ellipse cx="6" cy="-4" rx="6.5" ry="5" fill="#C9A7FF"/>` +
    `<ellipse cx="-4.5" cy="4" rx="4.5" ry="3.6" fill="#FBC8D5"/><ellipse cx="4.5" cy="4" rx="4.5" ry="3.6" fill="#E2D2FF"/>` +
    `<rect x="-1.2" y="-7" width="2.4" height="14" rx="1.2" fill="#5A3E52"/><path d="M-1-7q-3-5-5-5M1-7q3-5 5-5" stroke="#5A3E52" stroke-width="1" fill="none"/></g>`;

  function customKrathong(o, photo) {
    const B = BUILD.base[o.base], T = BUILD.top[o.top], dots = BUILD.flower[o.flower].c;
    let s = '';
    if (B.bread) {
      s += `<ellipse cx="100" cy="158" rx="84" ry="8" fill="#050B1C" opacity=".35"/>` +
        `<path d="M22 144C22 124 178 124 178 144 178 158 22 158 22 144Z" fill="#D9A35F"/>` +
        `<path d="M32 138C46 130 154 130 168 138" stroke="#F2CE93" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      for (let i = 0; i < 5; i++) s += flower(40 + i * 30, 147, 3.6, dots[i % dots.length]);
    } else s += leafBase(B.p[0], B.p[1], B.p[2], dots);
    if (o.incense === 'y') s += T.c[0] < 100 ? incense(156, 140) : incense(48, 140);
    if (T.photo && photo && PHOTO_RE.test(photo)) {
      const { cx, cy, r } = PHOTO;
      s += lotus(100, 140, 1.1) +
        `<clipPath id="ph-UID"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>` +
        `<circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="#FFF4DD"/>` +
        `<image class="ph-img" href="__PHOTO__" x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" preserveAspectRatio="xMidYMid slice" clip-path="url(#ph-UID)"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${r + 2}" fill="none" stroke="#F4C46A" stroke-width="3"/>` +
        flower(cx - 26, cy + 24, 4) + flower(cx + 27, cy + 22, 3.6, '#FFD95E');
    } else if (T.photo) s += lotus(100, 138, 1.15) + face(100, 112, 13); // ไม่มีรูป (เช่น คนอื่นดูในแม่น้ำรวม) แสดงดอกบัวแทน
    else if (T.white) s += lotus(100, 138, 1.15, ['#FFFFFF', '#F1ECE4', '#FFFDF5', '#E2D6C2']) + face(100, 112, 13);
    else {
      bare = true;
      try { s += K[T.id](); } finally { bare = false; }
    }
    if (o.candle === 'y') s += candle(T.c[0], T.c[1]);
    if (o.deco === 'b') s += sparkle4(34, 72, 6) + sparkle4(170, 64, 5) + sparkle4(24, 112, 4) + sparkle4(178, 106, 4.5);
    if (o.deco === 'c') s += heart(36, 92, 1.1, '#F28AA5') + heart(166, 78, 0.9, '#F7B2C4') + heart(28, 120, 0.7, '#FBC8D5');
    if (o.deco === 'd') s += butterfly(164, 74) + butterfly(38, 88).replace('rotate(-12)', 'rotate(14) scale(.8)');
    return s;
  }
  const customName = (o) => `กระทงสร้างเอง: ${BUILD.top[o.top].photo ? 'รูปส่วนตัว' : BUILD.top[o.top].name} บน${BUILD.base[o.base].name}`;

  /* opts.photo: รูปตรงกลาง (ใช้เฉพาะกระทงสร้างเองที่เลือก "รูปของฉัน") */
  function render(kind, id, opts = {}) {
    const o = kind !== 'lantern' && decode(id);
    // ใส่รูปหลัง wrap() เพราะ wrap แทนที่คำว่า UID ทั้งหมด และ base64 ของรูปอาจมีตัวอักษร UID อยู่
    if (o) return wrap('0 0 200 170', customKrathong(o, opts.photo)).replace('__PHOTO__', () => opts.photo);
    if (kind === 'lantern') {
      const l = L[id] || L.classic;
      return wrap('0 0 160 200', l.b(), lgDefs(l.c[0], l.c[1]));
    }
    return wrap('0 0 200 170', (K[id] || K.classic)());
  }

  const list = (kind) => (kind === 'lantern' ? LANTERNS : KRATHONGS);
  const find = (kind, id) => {
    const o = kind !== 'lantern' && decode(id);
    return o ? { id: encode(o), name: customName(o), custom: true } : list(kind).find((d) => d.id === id) || list(kind)[0];
  };
  const ratio = (kind) => (kind === 'lantern' ? 200 / 160 : 170 / 200);

  /* ---------- เพื่อนลอยกระทง: ตัวละครยืนสองขา (viewBox 0 0 120 170) ---------- */
  const BUDDIES = [
    { id: 'cat', name: 'แมวส้ม' },
    { id: 'dog', name: 'หมาชิบะ' },
    { id: 'redpanda', name: 'แพนด้าแดง' },
  ];

  const sparkle4 = (x, y, s) =>
    `<path d="M${x} ${f(y - s)}Q${x} ${y} ${f(x + s)} ${y}Q${x} ${y} ${x} ${f(y + s)}Q${x} ${y} ${f(x - s)} ${y}Q${x} ${y} ${x} ${f(y - s)}Z" fill="#FFF1B8"/>`;

  const jasmine = (x, y) =>
    `<path d="M${x - 2} ${y + 4}q-8 2-10-4q7-3 10 4Z" fill="#7CC48A"/>` +
    flower(x, y, 3.2, '#FFFFFF') + flower(x + 7, y - 4, 2.6, '#FFFFFF') + flower(x + 4, y + 6, 2.3, '#FFFDF5');

  /* เปลือกตา: lc = หลับ, lh = ยิ้มโค้ง, es = ตาเป็นประกาย (วางทับตาจาก face()) */
  const lids = (cx, cy, r, c) => {
    const ex = r * 0.36, ey = cy - r * 0.02, er = Math.max(2, r * 0.1);
    const xs = [cx - ex, cx + ex];
    const cov = xs.map((x) => `<circle cx="${f(x + er * 0.1)}" cy="${f(ey)}" r="${f(er * 1.45)}" fill="${c}"/>`).join('');
    const arc = (d) =>
      xs.map((x) => `<path d="M${f(x - er * 1.1)} ${f(ey)}q${f(er * 1.1)} ${f(d * er * 1.1)} ${f(er * 2.2)} 0" fill="none" stroke="#3A2A2E" stroke-width="${f(er * 0.55)}" stroke-linecap="round"/>`).join('');
    const sp = xs.map((x) => sparkle4(f(x + er * 0.45), f(ey - er * 0.5), f(er * 0.9))).join('');
    return `<g class="lids lc">${cov}${arc(1)}</g><g class="lids lh">${cov}${arc(-1)}</g><g class="es">${sp}</g>`;
  };

  /* ชุดไทยสีสดตัดกับสีขน: c = สีผ้า, t = สีขอบ/ลาย */
  const sabai = (mirror, c, t) =>
    `<g${mirror ? ' transform="translate(120 0) scale(-1 1)"' : ''}>` +
    `<path d="M37 112L47 105 86 138 82 148Z" fill="${c}" stroke="${t}" stroke-width="1.8" stroke-linejoin="round"/>` +
    `<path d="M42 111L83 142" stroke="${t}" stroke-width="1.2" stroke-dasharray="2 3"/></g>` +
    `<path d="M35 142Q60 150 85 142L84 149Q60 157 36 149Z" fill="${t}"/>`;

  const waistCloth = (c, t) =>
    `<path d="M44 104Q60 114 76 104" stroke="${t}" stroke-width="2.4" fill="none"/><circle cx="60" cy="110" r="2.6" fill="${t}"/>` +
    `<path d="M35 134Q60 144 85 134L86 146Q60 156 34 146Z" fill="${c}" stroke="${t}" stroke-width="1.6"/>` +
    `<path d="M40 139Q60 147 80 139M40 143Q60 151 80 143" stroke="${t}" stroke-width="1.1" fill="none" opacity=".9"/>` +
    `<path d="M80 140l8 12-6 1ZM82 140l10 8-5 3Z" fill="${c}" stroke="${t}" stroke-width="1"/>`;

  /* เส้นขอบ/หัวกลมแบบชิบิ: หัวทับลำตัวเล็กน้อยให้ดูเป็นตัวเดียวกัน */
  const ol = (c, w = 1.8) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round"`;
  const shine = `<ellipse cx="49" cy="48" rx="12" ry="4.6" fill="#FFFFFF" opacity=".2" transform="rotate(-14 49 48)"/>`;
  const tailOf = (d, line, fur, stripe, w, dash) =>
    `<path d="${d}" stroke="${line}" stroke-width="${w + 3.4}" fill="none" stroke-linecap="round"/>` +
    `<path d="${d}" stroke="${fur}" stroke-width="${w}" fill="none" stroke-linecap="round"/>` +
    (stripe ? `<path d="${d}" stroke="${stripe}" stroke-width="${w}" fill="none" stroke-dasharray="${dash}"/>` : '');

  const CHR = {
    cat: {
      fur: '#F7A55B', belly: '#FFE7CC', limb: '#F7A55B', paw: '#FFE7CC', lid: '#F7A55B', line: '#9C5228',
      ears:
        `<path d="M30 58L27 26Q28 21 33 24L58 41Z" fill="#F7A55B" ${ol('#9C5228')}/><path d="M34 50L32 31 49 41Z" fill="#FFC2C8"/>` +
        `<path d="M90 58L93 26Q92 21 87 24L62 41Z" fill="#F7A55B" ${ol('#9C5228')}/><path d="M86 50L88 31 71 41Z" fill="#FFC2C8"/>`,
      head:
        `<path d="M60 38C80 38 94 50 94 68C94 78 90 85 85 89L89 91 80 95.5C74 98 67 99 60 99S46 98 40 95.5L31 91 35 89C30 85 26 78 26 68 26 50 40 38 60 38Z" fill="#F7A55B" ${ol('#9C5228')}/>` +
        shine +
        `<path d="M60 40v7M52 42l1.6 5.4M68 42l-1.6 5.4" stroke="#E07F35" stroke-width="3" stroke-linecap="round"/>` +
        `<ellipse cx="55" cy="80" rx="7.4" ry="5.6" fill="#FFE7CC"/><ellipse cx="65" cy="80" rx="7.4" ry="5.6" fill="#FFE7CC"/>`,
      after:
        `<path d="M57.4 73.4h5.2l-2.6 2.8Z" fill="#F2789A" stroke="#F2789A" stroke-width="1.6" stroke-linejoin="round"/>` +
        `<path d="M40 78l-10-1.5M40 82l-9 3M80 78l10-1.5M80 82l9 3" stroke="#9C5228" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>`,
      tail: tailOf('M78 148C102 150 110 124 100 104', '#9C5228', '#F7A55B', '#E07F35', 7.5, '4 7'),
      outfit: sabai(false, '#3FD6C6', '#FFF1B8'),
    },
    dog: {
      fur: '#EFA65A', belly: '#FFF4E6', limb: '#EFA65A', paw: '#FFF4E6', lid: '#EFA65A', line: '#9A5A2A',
      ears:
        `<path d="M31 57Q28 34 35 22Q40 19 45 26L58 42Z" fill="#E08F45" ${ol('#9A5A2A')}/><path d="M36 49Q35 36 38.5 29L51 41Z" fill="#FFF4E6"/>` +
        `<path d="M89 57Q92 34 85 22Q80 19 75 26L62 42Z" fill="#E08F45" ${ol('#9A5A2A')}/><path d="M84 49Q85 36 81.5 29L69 41Z" fill="#FFF4E6"/>`,
      head:
        `<path d="M60 38C80 38 94 52 94 70S78 99 60 99 26 88 26 70 40 38 60 38Z" fill="#EFA65A" ${ol('#9A5A2A')}/>` +
        shine +
        `<path d="M27.5 76C30 92 45 98 60 98S90 92 92.5 76C86 81 77 81 71 75C66 71 54 71 49 75C43 81 34 81 27.5 76Z" fill="#FFF4E6"/>` +
        `<ellipse cx="50" cy="61" rx="3" ry="2.2" fill="#FFF4E6"/><ellipse cx="70" cy="61" rx="3" ry="2.2" fill="#FFF4E6"/>`,
      after:
        `<ellipse cx="60" cy="73.6" rx="3.8" ry="2.6" fill="#3A2A2E"/><ellipse cx="59" cy="72.8" rx="1.2" ry=".7" fill="#FFFFFF" opacity=".7"/>`,
      tail:
        tailOf('M80 132C99 132 105 111 95 103C87 97 79 107 87 112', '#9A5A2A', '#EFA65A', '', 9) +
        `<path d="M93 108C92 104 88 104 87.5 107" stroke="#FFF4E6" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
      outfit: waistCloth('#7EA6FF', '#FFF1B8'),
    },
    redpanda: {
      fur: '#D9603B', belly: '#5A2A1C', limb: '#5A2A1C', paw: '#3E1D14', lid: '#D9603B', line: '#5A2418',
      ears:
        `<path d="M29 58Q20 25 56 38Z" fill="#FFF4E6" ${ol('#5A2418')}/><path d="M33.5 52Q28 32 50 40Z" fill="#5A2A1C"/>` +
        `<path d="M91 58Q100 25 64 38Z" fill="#FFF4E6" ${ol('#5A2418')}/><path d="M86.5 52Q92 32 70 40Z" fill="#5A2A1C"/>`,
      head:
        `<path d="M60 38C80 38 93 50 94 63C99 69 99 79 93 84C87 94 75 99 60 99S33 94 27 84C21 79 21 69 26 63 27 50 40 38 60 38Z" fill="#D9603B" ${ol('#5A2418')}/>` +
        shine +
        `<ellipse cx="49" cy="60" rx="5.4" ry="3.2" fill="#FFF4E6"/><ellipse cx="71" cy="60" rx="5.4" ry="3.2" fill="#FFF4E6"/>` +
        `<path d="M24.5 72C27 84 34 90 42 90C42 82 35 76 24.5 72ZM95.5 72C93 84 86 90 78 90C78 82 85 76 95.5 72Z" fill="#FFF4E6"/>` +
        `<ellipse cx="60" cy="81" rx="13" ry="9.6" fill="#FFF4E6"/>`,
      after:
        `<ellipse cx="60" cy="73.6" rx="3.8" ry="2.6" fill="#3A2A2E"/><ellipse cx="59" cy="72.8" rx="1.2" ry=".7" fill="#FFFFFF" opacity=".7"/>`,
      tail: tailOf('M78 148C104 150 114 120 102 96', '#5A2418', '#D9603B', '#8A3B22', 14, '6 7'),
      outfit: sabai(true, '#7FE3B0', '#FFE38A'),
    },
  };

  /* วาดตัวละคร: animal = cat|dog|redpanda, pose = ชื่อท่า (คลาส p-<pose>), item = {kind, design} ที่ถืออยู่ */
  function character(animal, pose = 'idle', item = null) {
    const id = CHR[animal] ? animal : 'cat';
    const a = CHR[id];
    let held = '';
    if (item && item.kind) {
      // ขยาย 1.4 เท่ารอบจุดกึ่งกลางเดิม (โคม 60,122 / กระทง 60,136.5)
      const box = item.kind === 'lantern' ? 'x="33.4" y="88.4" width="53.2" height="67.2"' : 'x="19.4" y="102.2" width="81.2" height="68.6"';
      held = render(item.kind, item.design, { photo: item.photo }).split(item.photo || ' ').join('__PHOTO__').replace('<svg ', `<svg ${box} `).replace('class="art"', 'class="held-art"');
    }
    const L = ol(a.line, 1.6);
    const arm = (x, cls) =>
      `<g class="${cls}"><path d="M${x} 111V132" stroke="${a.line}" stroke-width="13.4" stroke-linecap="round"/>` +
      `<path d="M${x} 111V132" stroke="${a.limb}" stroke-width="10.2" stroke-linecap="round"/>` +
      `<circle cx="${x}" cy="136" r="6.4" fill="${a.paw}" ${L}/></g>`;
    const foot = (x) =>
      `<ellipse cx="${x}" cy="158" rx="10" ry="6.8" fill="${a.limb}" ${L}/>` +
      `<path d="M${x - 3} 163.6v-2.6M${x + 3} 163.6v-2.6" stroke="${a.line}" stroke-width="1.2" stroke-linecap="round"/>`;
    const body =
      `<ellipse cx="60" cy="165" rx="30" ry="4" fill="#050B1C" opacity=".35"/>` +
      `<g class="whole"><circle class="aura" cx="60" cy="122" r="62" fill="url(#glow-UID)"/>` +
      `<g class="tail">${a.tail}</g>` +
      `${foot(48)}${foot(72)}` +
      `<g class="torso"><path d="M60 96C42 96 34 114 34 132S45 160 60 160 86 150 86 132 78 96 60 96Z" fill="${a.fur}" ${L}/>` +
      `<ellipse cx="60" cy="137" rx="15" ry="17" fill="${a.belly}"/>${a.outfit}` +
      `<g class="head">${a.ears}${a.head}${face(60, 70, 30)}${a.after}${lids(60, 70, 30, a.lid)}${jasmine(40, 40)}</g>` +
      `<g class="held">${held}</g>${arm(38, 'armL')}${arm(82, 'armR')}</g>` +
      `<g class="spark">${sparkle4(20, 44, 5)}${sparkle4(100, 38, 4)}${sparkle4(14, 100, 3.5)}${sparkle4(106, 92, 5)}</g></g>`;
    return wrap('0 0 120 170', body).replace('class="art"', `class="art chr chr-${id} p-${pose}${held ? '' : ' empty'}"`)
      .replace('__PHOTO__', () => item?.photo || ''); // ใส่รูปหลัง wrap (ดูเหตุผลใน render)
  }

  /* ---------- สะพานไม้/ท่าน้ำ (viewBox 0 0 300 160, ผิวน้ำที่ y=152) ---------- */
  function pier() {
    let s = '';
    for (const x of [26, 104, 182, 254])
      s += `<rect x="${x}" y="70" width="9" height="82" rx="2" fill="#3E2A20"/><rect x="${x + 1.5}" y="70" width="2.5" height="82" fill="#6B4A3A" opacity=".6"/>`;
    s += `<path d="M35 92L104 128M104 92L35 128M113 92L182 128M182 92L113 128M191 92L254 128M254 92L191 128" stroke="#3E2A20" stroke-width="3"/>`;
    for (const x of [10, 62, 114, 166, 218]) s += `<rect x="${x}" y="36" width="5" height="30" rx="1.5" fill="#7A5236"/>`;
    s += `<path d="M0 40H258M0 54H258" stroke="#9A6A45" stroke-width="4" stroke-linecap="round"/>`;
    s += `<path d="M-4 64H268L264 76H-4Z" fill="#8A5A3C"/><path d="M-4 64H268" stroke="#B88660" stroke-width="2.4"/>`;
    for (let x = 14; x < 264; x += 18) s += `<path d="M${x} 66V75" stroke="#5E3C28" stroke-width="1"/>`;
    s += `<rect x="256" y="6" width="7" height="60" rx="2" fill="#7A5236"/><path d="M259 10H288" stroke="#7A5236" stroke-width="4" stroke-linecap="round"/>`;
    // ไฟประดับห้อยเป็นสายโค้งระหว่างหัวเสา
    const tops = [[12.5, 36], [64.5, 36], [116.5, 36], [168.5, 36], [220.5, 36], [259.5, 24]];
    let wire = '', bulbs = '', k = 0;
    for (let i = 0; i < tops.length - 1; i++) {
      const [x0, y0] = tops[i], [x1, y1] = tops[i + 1], cx = (x0 + x1) / 2, cy = Math.max(y0, y1) + 22;
      wire += `M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}`;
      for (const t of [0.2, 0.4, 0.6, 0.8]) {
        const bx = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, by = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1;
        const c = k++ % 2 ? '#F7B2C4' : '#F4C46A';
        bulbs += `<g class="sl ${k % 2 ? 'sl-a' : 'sl-b'}"><circle cx="${f(bx)}" cy="${f(by + 2.6)}" r="4.6" fill="${c}" opacity=".35"/><circle cx="${f(bx)}" cy="${f(by + 2.6)}" r="1.9" fill="${c}"/></g>`;
      }
    }
    s += `<path d="${wire}" stroke="#2A1A10" stroke-width=".8" fill="none" opacity=".8"/>${bulbs}`;
    // พวงมาลัยดอกมะลิ + ดาวเรือง ห้อยที่เสา
    for (const x of [12.5, 116.5, 220.5]) {
      s += `<path d="M${x} 37V54" stroke="#E8DCC0" stroke-width=".6"/>`;
      for (let y = 39; y < 52; y += 3.2) s += `<circle cx="${x}" cy="${f(y)}" r="1.7" fill="#FFFDF5"/>`;
      s += flower(x, 55, 2.3, '#FFB347') + `<path d="M${x - 1} 57.5l-1.4 7M${x + 1} 57.5l1.4 7" stroke="#F28AA5" stroke-width="1.2" stroke-linecap="round"/>`;
    }
    s +=
      `<g class="pier-lamp"><path d="M284 10V20" stroke="#F4C46A" stroke-width="1.2"/>` +
      render('lantern', 'lanna').replace('<svg ', '<svg x="272" y="16" width="24" height="30" ').replace('class="art"', 'class="lamp-art"') +
      `</g>`;
    return wrap('0 0 300 160', s).replace('class="art"', 'class="art pier-svg"');
  }

  /* ---------- เมืองยามค่ำคืน (viewBox 0 0 1200 200, ขอบฟ้าที่ y=200) ---------- */
  /* ตรงกลาง (x 300–1000) เว้นให้วัดและสะพาน: ตึกแถวหน้าเตี้ยลง */
  function city() {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const B = 200;
    const row = (fill, hMin, hMax, wMin, wMax, lit, gap) => {
      let s = '', w = '';
      for (let x = -10; x < 1210; ) {
        const inGap = gap && x > gap[0] && x < gap[1];
        const bw = wMin + rnd() * (wMax - wMin), bh = inGap ? 8 + rnd() * 16 : hMin + rnd() * (hMax - hMin);
        s += `<rect x="${f(x)}" y="${f(B - bh)}" width="${f(bw)}" height="${f(bh)}" fill="${fill}"/>`;
        if (!inGap && rnd() < 0.25) s += `<rect x="${f(x + bw / 2 - 1)}" y="${f(B - bh - 14)}" width="2" height="14" fill="${fill}"/>`;
        if (lit && !inGap)
          for (let wy = B - bh + 8; wy < B - 10; wy += 12)
            for (let wx = x + 6; wx < x + bw - 8; wx += 10)
              if (rnd() < lit) w += `<rect class="win${rnd() < 0.08 ? ' tw' : ''}" x="${f(wx)}" y="${f(wy)}" width="4" height="6" opacity="${f(0.45 + rnd() * 0.5)}"/>`;
        x += bw + rnd() * 8;
      }
      return s + `<g fill="#FFD98A">${w}</g>`;
    };
    const far = row('#2F2A66', 40, 130, 34, 70, 0.08, [330, 980]);
    const near = row('#17183F', 24, 96, 40, 90, 0.32, [300, 1000]);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" class="city-svg" aria-hidden="true">` +
      `<g opacity=".9">${far}</g>${near}</svg>`;
  }

  /* ---------- วัดริมน้ำ: พระปรางค์ใหญ่ + เจดีย์ 2 องค์ + โบสถ์หลังคาซ้อน (viewBox 0 0 520 240) ---------- */
  function temple() {
    const B = 240, G = 'stroke="#F4C46A" stroke-opacity=".38" stroke-width="1.2" stroke-linejoin="round"';
    const fill = 'fill="url(#tf-UID)"';
    const glow = (cx, rx, ry) => `<ellipse cx="${cx}" cy="${B}" rx="${rx}" ry="${ry}" fill="url(#tg-UID)"/>`;

    // พระปรางค์ทรงวัดอรุณ: ฐานซ้อนชั้น ลำต้นทรงฝักข้าวโพด ยอดนภศูล
    const prang = (cx, s) => {
      const X = (d) => f(cx + d * s), Y = (h) => f(B - h * s);
      let d = `M${X(-80)} ${Y(0)}V${Y(12)}H${X(-68)}V${Y(26)}H${X(-56)}V${Y(40)}H${X(-44)}V${Y(52)}H${X(-36)}` +
        `C${X(-37)} ${Y(100)} ${X(-30)} ${Y(150)} ${X(-17)} ${Y(178)}C${X(-12)} ${Y(188)} ${X(-7)} ${Y(194)} ${X(-4)} ${Y(198)}` +
        `L${X(-1.5)} ${Y(228)}H${X(1.5)}L${X(4)} ${Y(198)}C${X(7)} ${Y(194)} ${X(12)} ${Y(188)} ${X(17)} ${Y(178)}` +
        `C${X(30)} ${Y(150)} ${X(37)} ${Y(100)} ${X(36)} ${Y(52)}H${X(44)}V${Y(40)}H${X(56)}V${Y(26)}H${X(68)}V${Y(12)}H${X(80)}V${Y(0)}Z`;
      let bands = '';
      for (const [h, w] of [[70, 36], [96, 34], [122, 31], [146, 27], [166, 21], [184, 13]])
        bands += `M${X(-w)} ${Y(h)}Q${X(0)} ${Y(h - 4)} ${X(w)} ${Y(h)}`;
      bands += `M${X(-3)} ${Y(214)}H${X(3)}M${X(-2.5)} ${Y(220)}H${X(2.5)}`;
      // ซุ้มประตูทิศ
      const niche = `M${X(-9)} ${Y(52)}V${Y(68)}Q${X(0)} ${Y(80)} ${X(9)} ${Y(68)}V${Y(52)}Z`;
      return `<path d="${d}" ${fill} ${G}/><path d="${bands}" fill="none" ${G}/><path d="${niche}" fill="#FFD98A" opacity=".55"/>`;
    };
    // เจดีย์ทรงระฆัง
    const chedi = (cx, h) => {
      const k = h / 130;
      const X = (d) => f(cx + d * k), Y = (v) => f(B - v * k);
      const d = `M${X(-34)} ${Y(0)}V${Y(12)}H${X(-27)}V${Y(22)}H${X(-21)}C${X(-23)} ${Y(48)} ${X(-14)} ${Y(62)} ${X(-5)} ${Y(66)}` +
        `L${X(-1.5)} ${Y(130)}H${X(1.5)}L${X(5)} ${Y(66)}C${X(14)} ${Y(62)} ${X(23)} ${Y(48)} ${X(21)} ${Y(22)}H${X(27)}V${Y(12)}H${X(34)}V${Y(0)}Z`;
      const rings = [76, 84, 92, 100].map((v) => `M${X(-3.2 + (v - 76) * 0.06)} ${Y(v)}H${X(3.2 - (v - 76) * 0.06)}`).join('');
      return `<path d="${d}" ${fill} ${G}/><path d="${rings}" ${G}/>`;
    };
    // โบสถ์หลังคาซ้อนชั้น มีช่อฟ้า ใบระกา หางหงส์
    const ubosot = (cx, w) => {
      const l = cx - w / 2, r = cx + w / 2;
      const body = `<rect x="${l + 14}" y="${B - 46}" width="${w - 28}" height="46" ${fill} ${G}/>`;
      const doors = [-0.22, 0, 0.22].map((t) => `<path d="M${f(cx + t * w - 5)} ${B}V${B - 22}Q${f(cx + t * w)} ${B - 30} ${f(cx + t * w + 5)} ${B - 22}V${B}Z" fill="#FFD98A" opacity=".55"/>`).join('');
      const roof = (inset, y0, y1) =>
        `<path d="M${l + inset} ${B - y0}L${cx} ${B - y1}L${r - inset} ${B - y0}Z" ${fill} ${G}/>` +
        `<path d="M${l + inset} ${B - y0}q-5-9-12-10M${r - inset} ${B - y0}q5-9 12-10" fill="none" stroke="#F4C46A" stroke-opacity=".55" stroke-width="2" stroke-linecap="round"/>`;
      const chofa = `<path d="M${cx} ${B - 124}q1-11 9-15" fill="none" stroke="#F4C46A" stroke-opacity=".7" stroke-width="2.4" stroke-linecap="round"/>`;
      return body + doors + roof(0, 40, 92) + roof(18, 62, 112) + roof(34, 82, 124) + chofa;
    };

    const defs =
      `<linearGradient id="tf-UID" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2C2762"/><stop offset=".65" stop-color="#4A3A62"/><stop offset="1" stop-color="#7A5A4E"/></linearGradient>` +
      `<radialGradient id="tg-UID"><stop offset="0" stop-color="#FFC874" stop-opacity=".55"/><stop offset="1" stop-color="#FFC874" stop-opacity="0"/></radialGradient>`;
    const body =
      glow(250, 260, 120) +
      `<g class="t-chedi">${chedi(54, 118)}</g>` +
      `<g class="t-ubosot">${ubosot(150, 150)}</g>` +
      prang(330, 0.96) +
      prang(232, 0.36) + prang(428, 0.36) +
      `<g class="t-chedi">${chedi(486, 104)}</g>`;
    return wrap('0 0 520 240', body, defs).replace('class="art"', 'class="lm-svg"');
  }

  /* ---------- สะพานขึงเสาเดียว (viewBox 0 0 420 160, ผิวน้ำที่ y=160) ---------- */
  function bridge() {
    const deck = 122, px = 150, top = 14;
    let cables = '';
    for (let i = 0; i < 9; i++) {
      const ay = top + 6 + i * 3.4;
      cables += `M${px} ${f(ay)}L${f(px - 16 - i * 15)} ${deck}M${px} ${f(ay)}L${f(px + 22 + i * 28)} ${deck}`;
    }
    let lights = '';
    for (let x = 8, i = 0; x < 420; x += 26, i++) lights += `<circle class="bl${i % 2 ? ' b2' : ''}" cx="${x}" cy="${deck - 3}" r="1.8" fill="#FFE3A3"/>`;
    const body =
      `<path d="${cables}" stroke="#FFF4DD" stroke-opacity=".38" stroke-width=".8"/>` +
      `<path d="M${px - 5} 160L${px - 2.5} ${top}H${px + 2.5}L${px + 5} 160Z" fill="#26285A" stroke="#F4C46A" stroke-opacity=".35" stroke-width="1"/>` +
      `<rect x="0" y="${deck}" width="420" height="6" fill="#26285A"/><path d="M0 ${deck}H420" stroke="#F4C46A" stroke-opacity=".45" stroke-width="1"/>` +
      [40, 260, 380].map((x) => `<rect x="${x - 3}" y="${deck + 6}" width="6" height="${160 - deck - 6}" fill="#26285A"/>`).join('') +
      lights +
      `<circle class="bl b3" cx="${px}" cy="${top - 2}" r="2.4" fill="#F7B2C4"/>`;
    return wrap('0 0 420 160', body).replace('class="art"', 'class="lm-svg"');
  }

  /* ---------- ใบบัว (viewBox 0 0 100 50) ---------- */
  function lily(withFlower) {
    const body =
      `<path d="M50 36L89.1 38.5A40 12 0 1 1 89.1 33.5Z" fill="#3E8E5C"/>` +
      `<path d="M50 36L18 33M50 36L30 44M50 36L66 45M50 36L80 42" stroke="#6CC08A" stroke-width="1" opacity=".7"/>` +
      `<path d="M14 36A36 9 0 0 1 50 27" stroke="#8FD9A6" stroke-width="1.4" fill="none" opacity=".6"/>` +
      (withFlower ? lotus(40, 33, 0.5) : '');
    return wrap('0 0 100 50', body).replace('class="art"', 'class="lily-svg"');
  }

  /* ---------- ปลาน้อยกระโดดน้ำ (viewBox 0 0 60 40 หันขวา) ---------- */
  function fishy() {
    const body =
      `<path d="M14 20L2 10 5 20 2 30Z" fill="#FF8A5B"/>` +
      `<ellipse cx="31" cy="20" rx="19" ry="12" fill="#FFB36B"/>` +
      `<path d="M26 9Q32 2 38 9Z" fill="#FF8A5B"/><path d="M28 27q4 7 9 2Z" fill="#FF8A5B"/>` +
      `<ellipse cx="33" cy="24" rx="9" ry="5" fill="#FFE1BF"/>` +
      face(38, 19, 10);
    return wrap('0 0 60 40', body).replace('class="art"', 'class="fish-svg"');
  }

  const usesPhoto = (id) => decode(id)?.top === 'j';
  const builder = { parts: BUILD, DEFAULT: BUILD_DEFAULT, encode, decode, usesPhoto, PHOTO };

  return { render, list, find, ratio, character, pier, city, temple, bridge, lily, fishy, builder, KRATHONGS, LANTERNS, BUDDIES };
})();
