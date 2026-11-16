(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const I = (n) => ICONS.svg(n);
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const view = $('#view');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const KIND = {
    krathong: { label: 'กระทง', icon: 'lotus', verb: 'ลอยกระทง', go: 'ลอยเลย', again: 'ลอยอีกกระทง' },
    lantern: { label: 'โคมลอย', icon: 'lantern', verb: 'ปล่อยโคม', go: 'ปล่อยเลย', again: 'ปล่อยอีกโคม' },
  };
  const QUICK = ['ขอให้สุขภาพแข็งแรง', 'ขอให้การงานรุ่งเรือง', 'ขอให้สมหวังในความรัก', 'ขอให้สอบผ่าน', 'ขอให้ครอบครัวมีความสุข'];
  const BAD = ['เหี้ย', 'ควย', 'เย็ด', 'fuck', 'shit', 'bitch'];
  const COOLDOWN = 20000;

  const clean = (t) =>
    BAD.reduce(
      (s, w) => s.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '***'),
      String(t).replace(/\s+/g, ' ').trim()
    );

  let toastTimer;
  function toast(msg, icon = 'sparkle') {
    const t = $('#toast');
    t.innerHTML = `${I(icon)}<span>${esc(msg)}</span>`;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  /* ================= ฉากหลัง ================= */
  function buildSky() {
    const stars = $('#stars');
    let html = '';
    for (let i = 0; i < 90; i++) {
      const s = (Math.random() * 2 + 1).toFixed(1);
      html += `<i style="left:${(Math.random() * 100).toFixed(2)}%;top:${(Math.random() * 58).toFixed(2)}%;width:${s}px;height:${s}px;--t:${(2 + Math.random() * 3).toFixed(1)}s;animation-delay:${(-Math.random() * 4).toFixed(1)}s"></i>`;
    }
    stars.innerHTML = html;
    const cityHtml = () =>
      ART.city() + `<div class="lm lm-temple">${ART.temple()}</div><div class="lm lm-bridge">${ART.bridge()}</div>`;
    $('#city').innerHTML = cityHtml();
    $('#cityReflect').innerHTML = cityHtml();

    const hang = $('#hanging');
    hang.innerHTML = Array.from({ length: 7 }, (_, i) => {
      const len = 24 + ((i * 37) % 60);
      return `<div class="hang" style="--len:${len}px;animation-delay:${-i * 0.7}s">${ART.render('lantern', 'lanna')}</div>`;
    }).join('');
    layoutHanging();
    addEventListener('resize', layoutHanging);

    /* เงาพระจันทร์ในน้ำ: ชิ้นแสงสั้น ๆ แคบด้านบน กว้างด้านล่าง กระพริบคนละจังหวะ */
    let glints = '';
    for (let i = 0; i < 22; i++) {
      const t = i / 21, top = (t * 92).toFixed(1);
      const spread = 8 + t * 38, w = (10 + t * 46) * (0.55 + Math.random() * 0.7);
      const left = 50 + (Math.random() * 2 - 1) * spread;
      glints += `<i style="top:${top}%;left:${left.toFixed(1)}%;width:${w.toFixed(0)}px;height:${(2 + t * 2).toFixed(1)}px;` +
        `--d:${(1.2 + Math.random() * 2).toFixed(2)}s;animation-delay:${(-Math.random() * 3).toFixed(2)}s"></i>`;
    }
    $('.moon-reflect').innerHTML = glints;
  }

  /* โคมห้อยเว้นพื้นที่โลโก้ (ซ้ายบน) และตัวนับ (ขวาบน) */
  function layoutHanging() {
    const hang = $('#hanging'), lr = $('.logo').getBoundingClientRect(), cr = $('.counters').getBoundingClientRect();
    const left = lr.right + 24, right = innerWidth - cr.left + 24;
    const room = innerWidth - left - right;
    hang.style.left = left + 'px';
    hang.style.right = right + 'px';
    hang.hidden = room < 160;
    const n = Math.max(2, Math.min(7, Math.floor(room / 110)));
    [...hang.children].forEach((h, i) => (h.style.display = i < n ? '' : 'none'));
  }

  /* ================= บรรยากาศริมน้ำ: ใบบัว หิ่งห้อย ปลา ================= */
  function buildRiverDecor() {
    const small = innerWidth <= 560;
    const nLily = small ? 5 : 8;
    let lh = '';
    for (let i = 0; i < nLily; i++) {
      const left = 30 + (i / nLily) * 66 + Math.random() * (60 / nLily);
      lh += `<span class="lily" style="left:${left.toFixed(1)}%;bottom:calc(${small ? 92 : 84}px + ${(Math.random() * 7).toFixed(1)}%);--w:${(small ? 46 : 64) + Math.round(Math.random() * 40)}px;` +
        `--d:${(4 + Math.random() * 3).toFixed(1)}s;animation-delay:${(-Math.random() * 5).toFixed(1)}s">${ART.lily(i % 3 === 1)}</span>`;
    }
    $('#lilies').innerHTML = lh;

    const nFly = small ? 20 : 28, r = () => ((Math.random() * 2 - 1) * 46).toFixed(0) + 'px';
    let fh = '';
    for (let i = 0; i < nFly; i++)
      fh += `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;--x1:${r()};--y1:${r()};--x2:${r()};--y2:${r()};--x3:${r()};--y3:${r()};` +
        `animation-duration:${(14 + Math.random() * 12).toFixed(1)}s,${(1.8 + Math.random() * 2.4).toFixed(1)}s;animation-delay:${(-Math.random() * 20).toFixed(1)}s,${(-Math.random() * 3).toFixed(1)}s"></i>`;
    $('#fireflies').innerHTML = fh;
  }

  const FishJump = (() => {
    function ripple(box, x, y) {
      const rp = document.createElement('i');
      rp.className = 'f-ripple';
      rp.style.cssText = `left:${x}px;top:${y}px`;
      box.appendChild(rp);
      setTimeout(() => rp.remove(), 1500);
    }
    function jump() {
      const box = $('.river'), W = box.clientWidth, H = box.clientHeight;
      const dir = Math.random() < 0.5 ? 1 : -1, dist = 70 + Math.random() * 30;
      const x = W * (0.32 + Math.random() * 0.56), y = H * (0.25 + Math.random() * 0.4);
      const el = document.createElement('div');
      el.className = 'fish-jump';
      el.style.cssText = `left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;--dist:${dist.toFixed(0)}px;transform:scaleX(${dir})`;
      el.innerHTML = `<div class="fj">${ART.fishy()}</div>`;
      box.appendChild(el);
      ripple(box, x, y);
      setTimeout(() => ripple(box, x + dir * dist, y), 1250);
      setTimeout(() => el.remove(), 1500);
    }
    function loop() {
      setTimeout(() => {
        if (!document.hidden) jump();
        loop();
      }, 15000 + Math.random() * 15000);
    }
    return { start: () => !reduced && loop(), jump };
  })();

  /* ================= เสียงประกอบ (Web Audio API ล้วน ไม่โหลดไฟล์) ================= */
  const Sound = (() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    const btn = $('#soundBtn');
    let on = !!LoyStore.get('loy.sound', false), ctx, master, delay, timer = 0, nextNote = 0, nextChirp = 0, step = 3;
    const SCALE = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25]; // เพนทาโทนิก ฟังแบบไทย ๆ

    function paint() {
      btn.innerHTML = I(on ? 'volume' : 'volumeOff');
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? 'ปิดเสียง' : 'เปิดเสียงประกอบ');
      btn.title = on ? 'ปิดเสียง' : 'เปิดเสียงประกอบ';
    }

    function build() {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      // เสียงน้ำ: brown noise ผ่าน low-pass + LFO ช้า ๆ
      const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      let last = 0;
      for (let i = 0; i < len; i++) {
        last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
        d[i] = last * 3.5;
      }
      const src = ctx.createBufferSource(), lp = ctx.createBiquadFilter(), wg = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      src.buffer = buf;
      src.loop = true;
      lp.type = 'lowpass';
      lp.frequency.value = 600;
      wg.gain.value = 0.3;
      lfo.frequency.value = 0.12;
      lg.gain.value = 0.12;
      lfo.connect(lg).connect(wg.gain);
      src.connect(lp).connect(wg).connect(master);
      src.start();
      lfo.start();
      // เสียงสะท้อนสำหรับเพลง
      delay = ctx.createDelay();
      delay.delayTime.value = 0.38;
      const fb = ctx.createGain(), wet = ctx.createGain();
      fb.gain.value = 0.32;
      wet.gain.value = 0.3;
      delay.connect(fb).connect(delay);
      delay.connect(wet).connect(master);
      // เสียงโดรนต่ำ ๆ
      for (const fq of [130.81, 196]) {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = fq;
        g.gain.value = 0.018;
        o.connect(g).connect(master);
        o.start();
      }
    }

    function pluck(t, fq) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = fq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.06, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      o.connect(g);
      g.connect(master);
      g.connect(delay);
      o.start(t);
      o.stop(t + 1.7);
    }
    function chirp(t) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 4300 + Math.random() * 400;
      g.gain.value = 0;
      o.connect(g).connect(master);
      for (let i = 0; i < 3; i++) {
        const s = t + i * 0.045;
        g.gain.setValueAtTime(0, s);
        g.gain.linearRampToValueAtTime(0.02, s + 0.008);
        g.gain.linearRampToValueAtTime(0, s + 0.03);
      }
      o.start(t);
      o.stop(t + 0.2);
    }
    function tick() {
      const ahead = ctx.currentTime + 0.6;
      while (nextNote < ahead) {
        step = Math.max(0, Math.min(7, step + [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)]));
        if (Math.random() < 0.85) pluck(nextNote, SCALE[step]);
        nextNote += [0.5, 0.75, 1][Math.floor(Math.random() * 3)];
      }
      while (nextChirp < ahead) {
        chirp(nextChirp);
        nextChirp += 0.5 + Math.random() * 1.4;
      }
    }

    function start() {
      if (!ctx) build();
      ctx.resume();
      nextNote = Math.max(nextNote, ctx.currentTime + 0.1);
      nextChirp = Math.max(nextChirp, ctx.currentTime + 0.3);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0.6, ctx.currentTime, 0.4);
      clearInterval(timer);
      timer = setInterval(tick, 200);
    }
    function stop(suspend = true) {
      clearInterval(timer);
      timer = 0;
      if (!ctx) return;
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      if (suspend) setTimeout(() => !on && ctx.suspend(), 700);
    }

    function init() {
      if (!AC) return;
      btn.hidden = false;
      paint();
      btn.addEventListener('click', () => {
        on = !on;
        LoyStore.set('loy.sound', on);
        paint();
        on ? start() : stop();
      });
      // เบราว์เซอร์ให้เริ่มเสียงได้หลังผู้ใช้แตะหน้าจอเท่านั้น
      if (on) {
        const kick = (e) => {
          removeEventListener('pointerdown', kick, true);
          removeEventListener('keydown', kick, true);
          if (on && e.target !== btn && !btn.contains(e.target)) start();
        };
        addEventListener('pointerdown', kick, true);
        addEventListener('keydown', kick, true);
      }
      document.addEventListener('visibilitychange', () => {
        if (!ctx) return;
        if (document.hidden) {
          clearInterval(timer);
          timer = 0;
          ctx.suspend();
        } else if (on) start();
      });
    }
    return { init };
  })();

  /* ================= ฝนดาวตก ================= */
  const Meteor = (() => {
    const box = $('#meteors');
    function one(delay = 0) {
      const m = document.createElement('i');
      m.className = 'meteor';
      const len = 90 + Math.random() * 140;
      m.style.cssText = `left:${(25 + Math.random() * 85).toFixed(1)}%;top:${(Math.random() * 38).toFixed(1)}%;` +
        `--len:${len.toFixed(0)}px;--a:${(-24 - Math.random() * 18).toFixed(1)}deg;--dist:${(260 + Math.random() * 320).toFixed(0)}px;` +
        `--d:${(0.8 + Math.random() * 0.7).toFixed(2)}s;animation-delay:${delay}ms`;
      box.appendChild(m);
      m.addEventListener('animationend', () => m.remove());
    }
    function shower(n = 24, span = 3500) {
      if (reduced) return;
      for (let i = 0; i < n; i++) one(Math.round(Math.random() * span));
    }
    function ambient() {
      setTimeout(() => {
        if (!document.hidden) Math.random() < 0.15 ? shower(4, 1200) : one();
        ambient();
      }, 5000 + Math.random() * 9000);
    }
    return { shower, start: () => !reduced && ambient() };
  })();

  /* ================= พลุ (canvas ชั้นเดียว อนุภาคไม่เกิน 300) ================= */
  const Fireworks = (() => {
    const cv = $('#fireworks'), g = cv.getContext('2d');
    const MAX = 300;
    const css = getComputedStyle(document.documentElement);
    const COLORS = ['--gold', '--pink', '--mint', '--cream'].map((v) => css.getPropertyValue(v).trim() || '#F4C46A');
    const pick = (i) => COLORS[i % 3];
    let W = 0, H = 0, raf = 0, timer = 0;
    const rockets = [], parts = [];

    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* พื้นที่ห้ามแตก: ข้อความ/ปุ่มหน้าแรก พระจันทร์ และแถบบน (พิกัดเดียวกับ canvas เพราะ #scene เต็มจอ) */
    function blocked() {
      return ['.hero', '.panel', '.share2', '.moon', '.topbar']
        .map((q) => $(q)?.getBoundingClientRect())
        .filter((r) => r && r.width);
    }
    function spot(R) {
      const bl = blocked();
      for (let i = 0; i < 14; i++) {
        const x = W * (0.06 + Math.random() * 0.88), y = H * (0.12 + Math.random() * 0.42);
        if (bl.every((r) => x + R < r.left || x - R > r.right || y + R < r.top || y - R > r.bottom)) return { x, y };
      }
      return null;
    }

    function explode(r) {
      const room = MAX - parts.length;
      const n = Math.min(room, W < 600 ? 40 : 64), c = Math.floor(Math.random() * 3), sp = Math.min(1, 0.55 + W / 1800);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.12, v = (1.3 + Math.random() * 2.2) * sp;
        parts.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, decay: 0.011 + Math.random() * 0.01, c: i % 4 ? pick(c) : pick(c + 1) });
      }
    }

    function frame() {
      g.clearRect(0, 0, W, H);
      g.globalCompositeOperation = 'lighter';
      g.lineCap = 'round';
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.vy += 0.05;
        r.x += r.vx;
        r.y += r.vy;
        g.globalAlpha = 0.85;
        g.strokeStyle = COLORS[3];
        g.lineWidth = 2;
        g.beginPath();
        g.moveTo(r.x - r.vx * 5, r.y - r.vy * 5);
        g.lineTo(r.x, r.y);
        g.stroke();
        if (r.vy >= -0.4) {
          explode(r);
          rockets.splice(i, 1);
        }
      }
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.03; // แรงโน้มถ่วง
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        g.globalAlpha = p.life;
        g.strokeStyle = p.c;
        g.lineWidth = 1.8;
        g.beginPath();
        g.moveTo(p.x - p.vx * 4, p.y - p.vy * 4); // หางจาง ๆ
        g.lineTo(p.x, p.y);
        g.stroke();
      }
      g.globalAlpha = 1;
      raf = (rockets.length || parts.length) && !document.hidden ? requestAnimationFrame(frame) : 0;
    }

    function launch() {
      if (reduced || document.hidden) return;
      if (!W) size();
      const t = spot(W < 600 ? 80 : 120);
      if (!t) return;
      rockets.push({ x: t.x + (Math.random() - 0.5) * 30, y: H, vx: 0, vy: -Math.sqrt(2 * 0.05 * (H - t.y)) });
      rockets[rockets.length - 1].vx = (t.x - rockets[rockets.length - 1].x) / (Math.abs(rockets[rockets.length - 1].vy) / 0.05);
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function loop() {
      timer = setTimeout(() => {
        launch();
        loop();
      }, 6000 + Math.random() * 6000);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && (rockets.length || parts.length)) raf = requestAnimationFrame(frame);
    });

    return {
      start() {
        if (reduced) return;
        size();
        addEventListener('resize', size);
        loop();
      },
      /* ยิงติดกัน n ลูก (ตอนลอยกระทง/ปล่อยโคมสำเร็จ) */
      salvo(n = 3) {
        for (let i = 0; i < n; i++) setTimeout(launch, i * 450);
      },
    };
  })();

  /* ================= ขอพรกับดาวตก ================= */
  function openStarWish() {
    const p = $('#popup');
    lastFocus = document.activeElement;
    p.innerHTML = `<form class="popup-card star-card" id="sf" role="dialog" aria-modal="true" aria-labelledby="sfTitle" novalidate>
      <button type="button" class="x" aria-label="ปิด">${I('x')}</button>
      <span class="star-ico">${I('star')}</span>
      <h3 id="sfTitle">ขอพรกับดาวตก</h3>
      <p class="hint">ตั้งจิตอธิษฐาน แล้วปล่อยคำขอพรไปพร้อมฝนดาวตก</p>
      <label class="field"><span class="inp">${I('pencil')}<textarea id="sfWish" maxlength="100" rows="3" placeholder="ขอให้..." aria-label="คำขอพร"></textarea></span></label>
      <div class="chips">${QUICK.slice(0, 3).map((q) => `<button type="button" class="chip">${q}</button>`).join('')}</div>
      <button type="submit" class="btn btn-gold">${I('sparkle')} อธิษฐานกับดาวตก</button>
    </form>`;
    p.hidden = false;
    const w = $('#sfWish', p);
    w.focus();
    $('.x', p).onclick = closePopup;
    $$('.chip', p).forEach((c) => (c.onclick = () => { w.value = c.textContent; w.focus(); }));
    $('#sf', p).onsubmit = (e) => {
      e.preventDefault();
      const text = clean(w.value).slice(0, 100);
      if (!text) { toast('กรุณาเขียนคำขอพร', 'pencil'); w.focus(); return; }
      closePopup();
      wishOnStars(text);
    };
  }

  function wishOnStars(text) {
    Meteor.shower(28, 4000);
    const el = document.createElement('p');
    el.className = 'star-wish';
    el.innerHTML = `${I('sparkle')}<span>${esc(text)}</span>`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5200);
    Buddy.say(`${I('star')} ดาวตกรับคำขอพรของคุณแล้ว ขอให้สมหวังนะ`, 5000);
  }

  function renderScene(rows) {
    const river = $('#riverItems'), sky = $('#skyItems');
    const mine = new Set(LoyStore.get('loy.mine', []).map(String));
    river.innerHTML = '';
    sky.innerHTML = '';
    for (const r of rows) {
      const b = document.createElement('button');
      b.type = 'button';
      const own = mine.has(String(r.id));
      b.setAttribute('aria-label', `${KIND[r.kind]?.label || ''}ของ ${r.name}${own ? ' (ของคุณ)' : ''} — แตะเพื่ออ่านคำอธิษฐาน`);
      if (r.kind === 'lantern') {
        const s = 0.5 + Math.random() * 0.6, dur = 45 + Math.random() * 35;
        b.className = 'float-l';
        b.style.cssText = `--x:${(3 + Math.random() * 88).toFixed(1)}%;--s:${s.toFixed(2)};--dur:${dur.toFixed(1)}s;--delay:${(-Math.random() * dur).toFixed(1)}s`;
        b.innerHTML = `<span class="sway" style="animation-delay:${(-Math.random() * 4).toFixed(1)}s">${ART.render('lantern', r.design)}</span>`;
        sky.appendChild(b);
      } else {
        const t = Math.random(), dur = 75 - t * 30 + Math.random() * 10;
        b.className = 'float-k';
        b.style.cssText = `--y:${(14 + t * 62).toFixed(1)}%;--s:${(0.55 + t * 0.7).toFixed(2)};--dur:${dur.toFixed(1)}s;--delay:${(-Math.random() * dur).toFixed(1)}s;z-index:${Math.round(t * 100)}`;
        // รูปที่ผู้ใช้อัปโหลด แสดงเฉพาะของตัวเอง คนอื่นเห็นเป็นดอกบัว
        const o = own ? { photo: myPhoto(r) } : {};
        b.innerHTML = `<span class="bob" style="animation-delay:${(-Math.random() * 3).toFixed(1)}s">${ART.render('krathong', r.design, o)}</span>` +
          `<span class="k-refl" aria-hidden="true" style="animation-delay:${(-Math.random() * 3).toFixed(1)}s">${ART.render('krathong', r.design, o)}</span>`;
        river.appendChild(b);
      }
      if (own) {
        b.classList.add('mine');
        b.insertAdjacentHTML('beforeend', `<span class="mine-tag" aria-hidden="true">${I('heart')}${esc(r.name)}</span>`);
      }
      b.addEventListener('click', () => showPopup(r));
    }
    paintTicker(rows);
  }

  /* ================= แถบคำอธิษฐานล่าสุด ================= */
  function paintTicker(rows) {
    const tk = $('#ticker'), track = $('#tkTrack');
    const items = rows.filter((r) => r.is_public !== false && r.name && r.wish).slice(0, 20);
    tk.hidden = !items.length;
    if (!items.length) return;
    const one = items.map((r) => `<span class="tk-item">${I('heart')}<b>${esc(r.name)}</b>: ${esc(r.wish)}</span>`).join('');
    track.innerHTML = one + `<span class="tk-copy" aria-hidden="true">${one}</span>`;
    requestAnimationFrame(() => track.style.setProperty('--dur', Math.max(30, track.scrollWidth / 2 / 45).toFixed(1) + 's'));
  }

  async function loadScene() {
    try {
      renderScene(await DB.list(40));
    } catch (e) {
      console.error(e);
    }
  }

  let counts = null;
  function paintCounts() {
    if (!counts) return;
    const fmt = (n) => n.toLocaleString('th-TH');
    $('#cntK').textContent = fmt(counts.krathong);
    $('#cntL').textContent = fmt(counts.lantern);
    const hasP = counts.people != null;
    $('#pillP').hidden = !hasP;
    if (hasP) $('#cntP').textContent = fmt(counts.people);
    const hero = $('#heroP');
    if (hero) {
      hero.hidden = !hasP;
      if (hasP) $('b', hero).textContent = fmt(counts.people);
    }
    layoutHanging();
  }
  async function refreshCounts() {
    try {
      counts = await DB.counts();
      paintCounts();
    } catch (e) {
      console.error(e);
    }
  }

  /* ================= ป๊อปอัปอ่านคำอธิษฐาน ================= */
  let lastFocus = null;
  function showPopup(r) {
    const p = $('#popup');
    lastFocus = document.activeElement;
    p.innerHTML = `<div class="popup-card ${r.kind}" role="dialog" aria-modal="true" aria-labelledby="ppTitle">
      <button type="button" class="x" aria-label="ปิด">${I('x')}</button>
      ${ART.render(r.kind, r.design, { photo: myPhoto(r) })}
      <h3 id="ppTitle">${KIND[r.kind].label}ของ ${esc(r.name)}</h3>
      <blockquote>${esc(r.wish)}</blockquote>
      <a class="btn btn-outline" href="#/w/${encodeURIComponent(r.id)}">${I('share')} ดูหน้าแชร์</a>
    </div>`;
    p.hidden = false;
    $('.x', p).focus();
    $('.x', p).onclick = closePopup;
    $('a', p).onclick = () => closePopup(false);
  }
  function closePopup(restore = true) {
    const p = $('#popup');
    if (p.hidden) return;
    p.hidden = true;
    p.innerHTML = '';
    if (restore && lastFocus) lastFocus.focus();
  }
  $('#popup').addEventListener('click', (e) => e.target.id === 'popup' && closePopup());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closePopup());

  /* ================= ส่วนประกอบ ================= */
  const stage = (kind, design, photo) =>
    `<div class="stage stage-${kind}"><div class="st-moon"></div>${kind === 'krathong' ? '<div class="st-water"></div>' : ''}
      <div class="st-item"><span class="bob">${ART.render(kind, design, { photo })}</span></div></div>`;

  /* ================= เพื่อนลอยกระทงบนสะพาน ================= */
  const buddyId = (v) => (ART.BUDDIES.some((b) => b.id === v) ? v : 'cat');

  const Buddy = (() => {
    let animal = buddyId(LoyStore.get('loy.buddy', 'cat'));
    const h = LoyStore.get('loy.hold', null);
    let hold = h && KIND[h.kind] ? { kind: h.kind, design: ART.find(h.kind, h.design).id } : { kind: 'krathong', design: 'classic' };
    let busy = false, wrap, btn, bubble, chr, bubbleTimer;
    const timers = [];

    function draw() {
      btn.innerHTML = ART.character(animal, 'idle', hold);
      chr = $('.chr', btn);
      btn.setAttribute('aria-label', `เพื่อนลอยกระทง: ${ART.BUDDIES.find((b) => b.id === animal).name} — แตะเพื่อทักทาย`);
    }
    const pose = (p) => {
      chr.classList.forEach((c) => c.startsWith('p-') && chr.classList.remove(c));
      chr.classList.add('p-' + p);
    };

    function say(html, ms) {
      bubble.innerHTML = html;
      bubble.hidden = false;
      bubble.style.animation = 'none';
      void bubble.offsetWidth;
      bubble.style.animation = '';
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => (bubble.hidden = true), ms);
    }

    const heldRect = () => $('.held', chr).getBoundingClientRect();

    function sailKrathong() {
      const r = heldRect(), m = $('.moon-reflect').getBoundingClientRect();
      const el = document.createElement('div');
      el.className = 'sail2';
      el.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;` +
        `--dx:${(m.left + m.width / 2 - (r.left + r.width / 2)).toFixed(0)}px;--dy:${(m.top + m.height * 0.2 - (r.top + r.height / 2)).toFixed(0)}px`;
      el.innerHTML = `<span class="bob">${ART.render(hold.kind, hold.design, { photo: hold.photo })}</span>`;
      const rip = document.createElement('div');
      rip.className = 'ripple2';
      rip.style.cssText = `left:${r.left + r.width / 2 + 6}px;top:${r.bottom + 10}px`;
      $('#scene').append(rip, el);
      setTimeout(() => rip.remove(), 4400);
      setTimeout(() => el.remove(), 4000);
    }

    function launchLantern() {
      const r = heldRect();
      const el = document.createElement('div');
      el.className = 'lift2';
      el.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;--dx:${(innerWidth * 0.06).toFixed(0)}px;--dy:${-(r.bottom + 80).toFixed(0)}px`;
      el.innerHTML = `<span class="sway">${ART.render(hold.kind, hold.design)}</span>`;
      $('#scene').append(el);
      setTimeout(() => el.remove(), 4600);
    }

    /* ท่าทางตอนลอยกระทง/ปล่อยโคม (~5.3 วิ) */
    function perform(kind) {
      timers.splice(0).forEach(clearTimeout);
      busy = true;
      draw();
      const at = (ms, fn) => timers.push(setTimeout(fn, ms));
      const finish = () => {
        busy = false;
        draw();
      };
      if (kind === 'lantern') {
        pose('l1'); // ถือโคมสองมือ ยังไม่จุดไฟ
        at(900, () => pose('l2')); // จุดไฟ สว่างขึ้น
        at(1900, () => pose('l3')); // ชูแขนขึ้น
        at(2400, () => { launchLantern(); chr.classList.add('gone'); });
        at(3100, () => pose('l4')); // แหงนมอง พนมมือไหว้
        at(4700, () => pose('idle'));
        at(5300, finish);
      } else {
        pose('k1'); // หลับตา ยกกระทงอธิษฐาน
        at(1000, () => pose('k2')); // ย่อตัว ยื่นกระทงลงน้ำ
        at(2000, () => { pose('k3'); sailKrathong(); chr.classList.add('gone'); });
        at(2700, () => pose('k4')); // โบกมือลา ตายิ้ม
        at(4300, () => pose('idle'));
        at(5000, finish);
      }
    }

    function blinkLoop() {
      setTimeout(() => {
        if (!busy && chr) {
          chr.classList.add('blink');
          setTimeout(() => chr.classList.remove('blink'), 160);
        }
        blinkLoop();
      }, 3000 + Math.random() * 2000);
    }

    function init() {
      const pier = document.createElement('div');
      pier.className = 'pier';
      pier.innerHTML = `${ART.pier()}<div class="pier-reflect" aria-hidden="true">${ART.pier()}</div>
        <div class="buddy-wrap"><div class="bubble" role="status" hidden></div><button type="button" class="buddy"></button></div>`;
      $('#scene').appendChild(pier);
      wrap = $('.buddy-wrap', pier);
      btn = $('.buddy', pier);
      bubble = $('.bubble', pier);
      draw();
      btn.addEventListener('click', () => {
        if (busy) return;
        if (!reduced) {
          wrap.classList.remove('hop');
          void wrap.offsetWidth;
          wrap.classList.add('hop');
        }
        say(`มาลอยกระทงกัน <a href="#/create/krathong">ลอยเลย ${I('arrowRight')}</a>`, 3500);
      });
      if (!reduced) blinkLoop();
    }

    return {
      init,
      say,
      perform,
      get animal() { return animal; },
      setAnimal(a) {
        animal = buddyId(a);
        LoyStore.set('loy.buddy', animal);
        if (!busy) draw();
      },
      hold(kind, design, photo = null) {
        hold = { kind, design, photo };
        LoyStore.set('loy.hold', { kind, design });
        if (!busy) draw();
      },
    };
  })();

  let state;
  /* รูปตรงกลางกระทงเก็บในเครื่องคนลอยเท่านั้น (ไม่อัปโหลด) คนอื่นเห็นเป็นดอกบัว */
  const PHOTO_KEEP = 12;
  function myPhoto(r) {
    if (!r || !ART.builder.usesPhoto(r.design) || !LoyStore.get('loy.mine', []).includes(String(r.id))) return null;
    return LoyStore.get('loy.photos', {})[String(r.id)] || null;
  }
  function keepPhoto(id, dataUrl) {
    const all = LoyStore.get('loy.photos', {});
    all[String(id)] = dataUrl;
    const ids = Object.keys(all);
    ids.slice(0, Math.max(0, ids.length - PHOTO_KEEP)).forEach((k) => delete all[k]);
    LoyStore.set('loy.photos', all);
  }

  const savedPhoto = () => {
    const p = LoyStore.get('loy.photo', null);
    return typeof p === 'string' && /^data:image\/(webp|jpeg);base64,/.test(p) ? p : null;
  };
  const savedBuild = () => {
    const o = ART.builder.decode(ART.builder.encode({ ...ART.builder.DEFAULT, ...LoyStore.get('loy.build', {}) })) || { ...ART.builder.DEFAULT };
    if (o.top === 'j' && !savedPhoto()) o.top = 'a';
    return o;
  };
  const freshState = (kind) => ({
    kind, design: ART.list(kind)[0].id, buddy: Buddy.animal, step: 1, name: '', wish: '', pub: true,
    mode: 'preset', preset: ART.list(kind)[0].id, build: savedBuild(), photo: savedPhoto(),
  });

  const steps = (n) =>
    `<ol class="steps">${['เลือกแบบ', 'เขียนคำอธิษฐาน', KIND[state.kind].verb]
      .map((t, i) => {
        const c = i + 1 < n ? 'done' : i + 1 === n ? 'on' : '';
        return `<li class="${c}"${c === 'on' ? ' aria-current="step"' : ''}><span class="n">${i + 1 < n ? I('check') : i + 1}</span><span class="t">${t}</span></li>`;
      })
      .join('')}</ol>`;

  /* ================= หน้าแรก ================= */
  function renderHome() {
    document.title = 'ลอยกระทงออนไลน์';
    view.innerHTML = `<section class="hero">
      <p class="eyebrow">${I('moon')} คืนวันเพ็ญ เดือนสิบสอง</p>
      <h1>ลอยกระทง ปล่อยโคม<br>ส่งคำอธิษฐานถึงฟ้าและน้ำ</h1>
      <p class="sub">เลือกกระทงหรือโคมลอยน่ารัก ๆ เขียนคำอธิษฐาน แล้วปล่อยไปพร้อมกับทุกคน</p>
      <div class="cta">
        <a class="btn btn-gold btn-lg" href="#/create/krathong">${I('lotus')} ลอยกระทง</a>
        <a class="btn btn-ghost btn-lg" href="#/create/lantern">${I('lantern')} ปล่อยโคมลอย</a>
      </div>
      <p class="people" id="heroP" hidden>${I('users')} มีผู้ร่วมลอยกระทงและปล่อยโคมแล้ว <b>-</b> คน</p>
      <p class="hint">${I('heart')} แตะกระทงหรือโคมในฉาก เพื่ออ่านคำอธิษฐานของคนอื่น</p>
    </section>`;
    paintCounts();
  }

  function renderRiver() {
    document.title = 'แม่น้ำและท้องฟ้ารวม | ลอยกระทงออนไลน์';
    view.innerHTML = `<a class="btn btn-outline back-float" href="#/">${I('arrowLeft')} กลับหน้าแรก</a>`;
  }

  /* ================= ขั้นที่ 1: เลือกแบบ ================= */
  const optHtml = (d) => {
    const sel = d.id === state.design;
    return `<button type="button" class="opt ${state.kind}${sel ? ' sel' : ''}" data-design="${d.id}" aria-pressed="${sel}">
      ${sel ? `<span class="tick">${I('check')}</span>` : ''}${ART.render(state.kind, d.id)}<span class="nm">${d.name}</span></button>`;
  };

  const buddyOptHtml = (b) => {
    const sel = b.id === state.buddy;
    return `<button type="button" class="opt buddy-opt${sel ? ' sel' : ''}" data-buddy="${b.id}" aria-pressed="${sel}">
      ${sel ? `<span class="tick">${I('check')}</span>` : ''}${ART.character(b.id, 'idle', null)}<span class="nm">${b.name}</span></button>`;
  };

  /* ================= โหมดสร้างกระทงเอง ================= */
  const BUILD_GROUPS = [
    ['base', 'ฐานกระทง'],
    ['top', 'ตรงกลาง'],
    ['flower', 'ดอกไม้รอบกระทง'],
    ['deco', 'ของประดับ'],
  ];
  const DECO_ICON = { a: 'x', b: 'sparkle', c: 'heart', d: 'butterfly' };

  const photoThumb = () =>
    state.photo ? `<img class="ph-thumb" src="${state.photo}" alt="">` : `<span class="sw-ic ph-add">${I('upload')}</span>`;

  /* ย่อรูปเป็นสี่เหลี่ยมจัตุรัส 256px ตัดตรงกลาง แล้วแปลงเป็น webp (ไม่รองรับ = jpeg) */
  async function shrinkPhoto(file) {
    if (!file || !/^image\//.test(file.type)) throw new Error('not image');
    if (file.size > 20e6) throw new Error('too big');
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((ok, no) => {
        const i = new Image();
        i.onload = () => ok(i);
        i.onerror = no;
        i.src = url;
      });
      const S = 256, m = Math.min(img.naturalWidth, img.naturalHeight);
      const c = document.createElement('canvas');
      c.width = c.height = S;
      c.getContext('2d').drawImage(img, (img.naturalWidth - m) / 2, (img.naturalHeight - m) / 2, m, m, 0, 0, S, S);
      const webp = c.toDataURL('image/webp', 0.85);
      return webp.startsWith('data:image/webp') ? webp : c.toDataURL('image/jpeg', 0.85);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  const pickFile = () =>
    new Promise((res) => {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'image/*';
      inp.onchange = () => res(inp.files[0] || null);
      inp.click();
    });

  function builderHtml() {
    const { parts, DEFAULT, encode } = ART.builder, o = state.build;
    const thumb = (key, k, v) => {
      if (key === 'top' && k === 'j') return photoThumb();
      if (key === 'base' || key === 'top') return ART.render('krathong', encode({ ...DEFAULT, candle: 'n', incense: 'n', [key]: k }));
      if (key === 'flower') {
        const c = v.c;
        return `<span class="sw" style="background:${c.length > 1 ? `conic-gradient(${c.map((x, i) => `${x} ${(i / c.length) * 100}% ${((i + 1) / c.length) * 100}%`).join(',')})` : c[0]}"></span>`;
      }
      return `<span class="sw-ic">${I(DECO_ICON[k])}</span>`;
    };
    const group = ([key, title]) =>
      `<fieldset class="bgrp bgrp-${key}"><legend>${title}</legend><div class="brow">` +
      Object.entries(parts[key]).map(([k, v]) =>
        `<button type="button" class="bo${o[key] === k ? ' sel' : ''}" data-k="${key}" data-v="${k}" aria-pressed="${o[key] === k}">${thumb(key, k, v)}<span class="nm">${v.name}</span></button>`
      ).join('') + `</div></fieldset>`;
    const sw = (id, key, label) =>
      `<label class="switch"><input type="checkbox" id="${id}" data-k="${key}"${o[key] === 'y' ? ' checked' : ''}><span class="track"></span><span>${label}</span></label>`;
    return `<div class="builder" id="builder">
      ${BUILD_GROUPS.map(group).join('')}
      <p class="ph-note" id="phNote"${o.top === 'j' ? '' : ' hidden'}>${I('upload')} <span>แตะ "รูปของฉัน" อีกครั้งเพื่อเปลี่ยนรูป · รูปเก็บไว้ในเครื่องนี้เท่านั้น ไม่ถูกอัปโหลด คุณเห็นคนเดียว คนอื่นจะเห็นเป็นดอกบัว</span>
        ${state.photo ? `<button type="button" class="linkbtn" id="phDel">ลบรูป</button>` : ''}</p>
      <div class="b-extra">${sw('bCandle', 'candle', 'จุดเทียน')}${sw('bIncense', 'incense', 'ปักธูป')}
        <button type="button" class="btn btn-outline btn-sm" id="bRand">${I('shuffle')} สุ่มแบบ</button></div>
    </div>`;
  }

  function bindBuilder() {
    const box = $('#builder');
    const apply = () => {
      state.design = ART.builder.encode(state.build);
      LoyStore.set('loy.build', state.build);
      $$('.bo', box).forEach((b) => {
        const on = state.build[b.dataset.k] === b.dataset.v;
        b.classList.toggle('sel', on);
        b.setAttribute('aria-pressed', on);
      });
      $('#bCandle').checked = state.build.candle === 'y';
      $('#bIncense').checked = state.build.incense === 'y';
      $('#pv').innerHTML = stage(state.kind, state.design, state.photo);
      $('#pvName').textContent = ART.find(state.kind, state.design).name;
      $('#phNote').hidden = state.build.top !== 'j';
      Buddy.hold(state.kind, state.design, state.photo);
    };
    async function choosePhoto() {
      const file = await pickFile();
      if (!file) return;
      try {
        state.photo = await shrinkPhoto(file);
      } catch (err) {
        console.error(err);
        toast('ใช้รูปนี้ไม่ได้ ลองรูปอื่นนะ', 'x');
        return;
      }
      LoyStore.set('loy.photo', state.photo);
      state.build.top = 'j';
      renderChoose();
    }
    box.addEventListener('click', (e) => {
      if (e.target.closest('#phDel')) {
        state.photo = null;
        try { localStorage.removeItem('loy.photo'); } catch {}
        state.build.top = 'a';
        renderChoose();
        return;
      }
      const b = e.target.closest('.bo');
      if (!b) return;
      if (b.dataset.k === 'top' && b.dataset.v === 'j' && (!state.photo || state.build.top === 'j')) {
        choosePhoto();
        return;
      }
      state.build[b.dataset.k] = b.dataset.v;
      apply();
    });
    box.addEventListener('change', (e) => {
      if (!e.target.dataset.k) return;
      state.build[e.target.dataset.k] = e.target.checked ? 'y' : 'n';
      apply();
    });
    $('#bRand').addEventListener('click', () => {
      const pick = (o) => { const k = Object.keys(o); return k[Math.floor(Math.random() * k.length)]; };
      const p = ART.builder.parts;
      const tops = Object.fromEntries(Object.entries(p.top).filter(([k]) => k !== 'j' || state.photo));
      state.build = { base: pick(p.base), top: pick(tops), flower: pick(p.flower), deco: pick(p.deco), candle: Math.random() < 0.8 ? 'y' : 'n', incense: Math.random() < 0.6 ? 'y' : 'n' };
      apply();
    });
  }

  function renderChoose() {
    const list = ART.list(state.kind);
    const building = state.kind === 'krathong' && state.mode === 'build';
    if (building) state.design = ART.builder.encode(state.build);
    const cur = ART.find(state.kind, state.design);
    state.design = cur.id;
    Buddy.hold(state.kind, state.design, state.photo);
    document.title = `เลือก${KIND[state.kind].label} | ลอยกระทงออนไลน์`;
    view.innerHTML = `<section class="panel">
      ${steps(1)}
      <h2 class="title">เลือก${KIND[state.kind].label}ที่ชอบ</h2>
      <div class="orn"></div>
      <div class="seg seg-kind" role="tablist" aria-label="ประเภท">
        ${['krathong', 'lantern'].map((k) => `<button type="button" role="tab" aria-selected="${k === state.kind}" data-kind="${k}">${I(KIND[k].icon)} ${KIND[k].label}</button>`).join('')}
      </div>
      ${state.kind === 'krathong' ? `<div class="seg seg-mode" role="tablist" aria-label="วิธีเลือกกระทง">
        <button type="button" role="tab" aria-selected="${!building}" data-mode="preset">${I('lotus')} แบบสำเร็จรูป</button>
        <button type="button" role="tab" aria-selected="${building}" data-mode="build">${I('pencil')} สร้างกระทงเอง</button>
      </div>` : ''}
      <div class="create-layout">
        <div>
          ${building ? builderHtml() : `<div class="grid" id="grid">${list.map(optHtml).join('')}</div>`}
          <div class="buddy-pick">
            <h3 class="bp-title">${I('heart')} เลือกเพื่อนลอยกระทง</h3>
            <div class="bp-grid" id="bpGrid">${ART.BUDDIES.map(buddyOptHtml).join('')}</div>
          </div>
        </div>
        <aside class="preview-wrap">
          <div id="pv">${stage(state.kind, cur.id, state.photo)}</div>
          <p class="pv-name" id="pvName">${cur.name}</p>
          <button type="button" class="btn btn-gold btn-lg" id="next">ถัดไป ${I('arrowRight')}</button>
        </aside>
      </div>
    </section>`;

    $$('.seg-kind button').forEach((b) =>
      b.addEventListener('click', () => {
        if (b.dataset.kind === state.kind) return;
        state.kind = b.dataset.kind;
        state.mode = 'preset';
        state.design = state.preset = ART.list(state.kind)[0].id;
        history.replaceState(null, '', '#/create/' + state.kind);
        renderChoose();
      })
    );
    $$('.seg-mode button').forEach((b) =>
      b.addEventListener('click', () => {
        if (b.dataset.mode === state.mode) return;
        state.mode = b.dataset.mode;
        state.design = state.mode === 'build' ? ART.builder.encode(state.build) : state.preset;
        renderChoose();
        $(`.seg-mode [data-mode="${state.mode}"]`).focus();
      })
    );
    if (building) bindBuilder();
    else $('#grid').addEventListener('click', (e) => {
      const b = e.target.closest('.opt');
      if (!b) return;
      state.design = state.preset = b.dataset.design;
      $('#grid').innerHTML = list.map(optHtml).join('');
      $(`.opt[data-design="${state.design}"]`).focus();
      $('#pv').innerHTML = stage(state.kind, state.design);
      $('#pvName').textContent = ART.find(state.kind, state.design).name;
      Buddy.hold(state.kind, state.design, state.photo);
    });
    $('#bpGrid').addEventListener('click', (e) => {
      const b = e.target.closest('.buddy-opt');
      if (!b) return;
      state.buddy = buddyId(b.dataset.buddy);
      Buddy.setAnimal(state.buddy);
      $('#bpGrid').innerHTML = ART.BUDDIES.map(buddyOptHtml).join('');
      $(`.buddy-opt[data-buddy="${state.buddy}"]`).focus();
    });
    $('#next').addEventListener('click', () => {
      state.step = 2;
      renderWish();
      scrollTo(0, 0);
    });
  }

  /* ================= ขั้นที่ 2: เขียนคำอธิษฐาน ================= */
  function renderWish() {
    const k = KIND[state.kind];
    const goLabel = `${I('flame')} ${k.go}`;
    document.title = `เขียนคำอธิษฐาน | ลอยกระทงออนไลน์`;
    view.innerHTML = `<section class="panel">
      ${steps(2)}
      <h2 class="title">เขียนคำอธิษฐาน</h2>
      <div class="orn"></div>
      <form class="wish-layout" id="wf" novalidate>
        <div class="wish-pv">${stage(state.kind, state.design, state.photo)}<p class="pv-name">${ART.find(state.kind, state.design).name}</p></div>
        <div>
          <label class="field"><span class="lbl">ชื่อของคุณ</span>
            <span class="inp">${I('user')}<input id="fName" maxlength="40" autocomplete="nickname" placeholder="เช่น น้องมะลิ" value="${esc(state.name)}"></span>
          </label>
          <label class="field"><span class="lbl">คำอธิษฐาน</span>
            <span class="inp">${I('pencil')}<textarea id="fWish" maxlength="150" rows="4" placeholder="ขอให้...">${esc(state.wish)}</textarea></span>
            <span class="count" id="cnt">0/150</span>
          </label>
          <div class="chips" aria-label="คำอธิษฐานสำเร็จรูป">${QUICK.map((q) => `<button type="button" class="chip">${q}</button>`).join('')}</div>
          <label class="switch"><input type="checkbox" id="fPub"${state.pub ? ' checked' : ''}><span class="track"></span>
            <span>แสดงใน${state.kind === 'krathong' ? 'แม่น้ำ' : 'ท้องฟ้า'}รวม ให้คนอื่นแตะอ่านได้</span></label>
          <div class="actions">
            <button type="button" class="btn btn-outline" id="back">${I('arrowLeft')} ย้อนกลับ</button>
            <button type="submit" class="btn btn-gold btn-lg" id="go">${goLabel}</button>
          </div>
        </div>
      </form>
    </section>`;

    const name = $('#fName'), wish = $('#fWish'), cnt = $('#cnt');
    const upd = () => {
      cnt.textContent = `${wish.value.length}/150`;
      state.name = name.value;
      state.wish = wish.value;
    };
    name.addEventListener('input', upd);
    wish.addEventListener('input', upd);
    upd();
    $$('.chip').forEach((c) =>
      c.addEventListener('click', () => {
        const v = wish.value.trim();
        wish.value = (v ? v + ' ' + c.textContent : c.textContent).slice(0, 150);
        upd();
        wish.focus();
      })
    );
    $('#fPub').addEventListener('change', (e) => (state.pub = e.target.checked));
    $('#back').addEventListener('click', () => {
      state.step = 1;
      renderChoose();
    });

    $('#wf').addEventListener('submit', async (e) => {
      e.preventDefault();
      const n = clean(name.value).slice(0, 40), w = clean(wish.value).slice(0, 150);
      if (!n) { toast('กรุณาใส่ชื่อของคุณ', 'user'); name.focus(); return; }
      if (!w) { toast('กรุณาเขียนคำอธิษฐาน', 'pencil'); wish.focus(); return; }
      const wait = COOLDOWN - (Date.now() - LoyStore.get('loy.last', 0));
      if (wait > 0) { toast(`รออีก ${Math.ceil(wait / 1000)} วินาที แล้วค่อย${k.verb}อีกครั้งนะ`, 'moon'); return; }

      const go = $('#go');
      go.disabled = true;
      go.innerHTML = `${I('moon')} กำลังส่ง...`;
      try {
        const rec = await DB.add({ kind: state.kind, design: state.design, buddy: buddyId(state.buddy), name: n, wish: w, is_public: state.pub });
        LoyStore.set('loy.last', Date.now());
        LoyStore.set('loy.mine', [...LoyStore.get('loy.mine', []), String(rec.id)].slice(-50));
        if (ART.builder.usesPhoto(rec.design) && state.photo) keepPhoto(rec.id, state.photo);
        release(rec);
      } catch (err) {
        console.error(err);
        toast('บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง', 'x');
        go.disabled = false;
        go.innerHTML = goLabel;
      }
    });
  }

  /* ================= ขั้นที่ 3: ปล่อย ================= */
  function release(rec) {
    document.body.classList.add('releasing');
    view.innerHTML = '';
    const ms = reduced ? 1800 : 6000;
    Buddy.hold(rec.kind, rec.design, myPhoto(rec));
    if (!reduced) Buddy.perform(rec.kind);
    Fireworks.salvo(3);
    Buddy.say(`${I('sparkle')} ขอให้คำอธิษฐานของคุณเป็นจริง`, ms - 300);
    setTimeout(() => {
      document.body.classList.remove('releasing');
      location.hash = '#/w/' + rec.id;
      loadScene();
      refreshCounts();
    }, ms);
  }

  /* ================= หน้าแชร์ ================= */
  async function renderShare(id) {
    view.innerHTML = `<div class="loading">${I('moon')} กำลังโหลด...</div>`;
    let r = null;
    try {
      r = await DB.get(id);
    } catch (e) {
      console.error(e);
    }
    if (location.hash !== '#/w/' + id) return;
    if (!r) {
      document.title = 'ไม่พบข้อมูล | ลอยกระทงออนไลน์';
      view.innerHTML = `<section class="panel narrow">
        <h2>ไม่พบกระทงหรือโคมนี้</h2>
        <p class="hint">ลิงก์อาจไม่ถูกต้อง${DB.remote ? '' : ' หรือข้อมูลถูกเก็บไว้ในเครื่องอื่น (โหมดทดลอง)'}</p>
        <a class="btn btn-gold" href="#/create/krathong">${I('lotus')} ลอยกระทงของคุณ</a>
      </section>`;
      return;
    }
    const k = KIND[r.kind] || KIND.krathong;
    const mine = LoyStore.get('loy.mine', []).includes(String(r.id));
    const url = location.href.split('#')[0] + '#/w/' + r.id;
    const text = `ร่วม${k.verb}ออนไลน์กับ ${r.name}`;
    const d = new Date(r.created_at);
    const when = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });
    document.title = `${k.label}ของ ${r.name} | ลอยกระทงออนไลน์`;

    const dname = ART.find(r.kind, r.design).name;
    const code = 'LK' + (d.getFullYear() + 543) + '-' + String(r.id).replace(/[^0-9a-z]/gi, '').slice(-6).toUpperCase().padStart(5, '0');
    const thaiNum = (n) => String(n).replace(/\d/g, (c) => '๐๑๒๓๔๕๖๗๘๙'[c]);

    view.innerHTML = `<section class="share2">
      ${mine ? `<div class="sh-banner">
        <span class="sh-check">${I('check')}</span>
        <div class="sh-bt">
          <h2>${k.verb}ออนไลน์ บันทึกสำเร็จแล้ว <span class="badge-ok">สำเร็จ ๑๐๐%</span></h2>
          <p>คำอธิษฐานและ${k.label}ของคุณได้ล่องสู่สายน้ำและท้องฟ้าเรียบร้อยแล้ว</p>
        </div>
        <span class="sh-live"><i></i> ล่องอยู่บนสายน้ำ</span>
      </div>` : ''}

      <article class="sh-card">
        <span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span>
        <div class="sh-meta">
          <span class="chip">${I('user')} ผู้ร่วม${k.verb}: <b>${esc(r.name)}</b></span>
          <span class="chip">${I('moon')} คืนเพ็ญเดือน ${thaiNum(12)}</span>
        </div>
        <div class="sh-stage">
          ${stage(r.kind, r.design, myPhoto(r))}
          <div class="st-buddy" title="${esc(ART.BUDDIES.find((b) => b.id === buddyId(r.buddy)).name)}">${ART.character(buddyId(r.buddy), 'idle', null)}</div>
          <span class="chip chip-float">${I('flame')} ${k.label === 'กระทง' ? 'ลอยแล้ว' : 'ปล่อยแล้ว'}</span>
          <span class="chip chip-name"><i class="dot"></i> ${esc(dname)}</span>
        </div>
        <div class="sh-quote">
          <p class="ql">${I('heart')} คำอธิษฐานและคำขอพร</p>
          <blockquote>“${esc(r.wish)}”</blockquote>
        </div>
        <div class="sh-foot">
          <dl>
            <div><dt>วันที่${k.verb}</dt><dd>${when}</dd></div>
            <div><dt>รหัสดิจิทัลประจำ${k.label}</dt><dd class="mono">${esc(code)}</dd></div>
          </dl>
          <span class="sh-seal">${I(k.icon)}<small>คืนวันลอยกระทง<br>${d.getFullYear() + 543}</small></span>
        </div>
        <p class="sh-eco">${I('leaf')} <span><b>นวัตกรรมสีเขียว:</b> ${k.verb}ออนไลน์ ไม่สร้างขยะในแม่น้ำและไม่เสี่ยงไฟไหม้ ร่วมรักษ์สิ่งแวดล้อมไปด้วยกัน</span></p>
      </article>

      <aside class="sh-side">
        <div class="sh-panel">
          <div class="sh-head">
            <span class="sh-ico pink">${I('share')}</span>
            <div><h3>ส่งต่อบุญและคำอธิษฐาน</h3><p>Share your blessing with loved ones</p></div>
          </div>
          <label class="sh-lbl" for="shareUrl">ลิงก์การ์ดคำอธิษฐานเฉพาะคุณ</label>
          <div class="sh-link">
            ${I('link')}<input id="shareUrl" readonly value="${esc(url)}">
            <button type="button" class="btn btn-gold btn-sm" id="copy">${I('copy')} คัดลอกลิงก์</button>
          </div>
          <p class="sh-lbl">แชร์ตรงไปยังโซเชียลมีเดีย</p>
          <div class="sh-socials">
            <a class="sh-soc" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}">${I('facebook')}<span>Facebook</span></a>
            <a class="sh-soc" target="_blank" rel="noopener" href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}">${I('line')}<span>LINE</span></a>
            <a class="sh-soc" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}">${I('xlogo')}<span>X (Twitter)</span></a>
            ${navigator.share ? `<button type="button" class="sh-soc" id="nativeShare">${I('share')}<span>แอปอื่น</span></button>` : ''}
          </div>
          <button type="button" class="btn sh-dl" id="dl">${I('download')} บันทึกรูปภาพการ์ดความละเอียดสูง</button>
        </div>

        <div class="sh-panel">
          <div class="sh-head">
            <span class="sh-ico gold">${I('sparkle')}</span>
            <div><h3>ร่วมสืบสานประเพณีแม่น้ำและท้องฟ้าร่วมใจ</h3><p class="pk">${mine ? 'ชวนเพื่อนมาร่วมกัน' : 'สำหรับผู้มาเยือนผ่านลิงก์'}</p></div>
          </div>
          <p class="sh-txt">${mine
            ? `ส่งลิงก์ให้คนที่คุณรัก แล้วชวนกันมา${k.verb}ร่วมกันบนแม่น้ำและท้องฟ้าเดียวกัน โดยไม่สร้างมลภาวะให้ธรรมชาติ`
            : `คุณกำลังรับชมคำอธิษฐานของ <b>${esc(r.name)}</b> ร่วมส่งกระทงหรือโคมลอยของคุณสู่สายน้ำและท้องฟ้าเดียวกันได้ทันที โดยไม่สร้างมลภาวะให้ธรรมชาติ`}</p>
          <a class="btn btn-gold sh-cta" href="#/create/${r.kind}">${mine ? `${I('refresh')} ${k.again}` : `${I(k.icon)} ร่วมส่งคำอธิษฐานของคุณบ้าง`}</a>
        </div>

        <div class="sh-panel sh-row">
          ${mine
            ? `<a class="btn btn-outline btn-sm" href="#/create/${r.kind === 'krathong' ? 'lantern' : 'krathong'}">${I(r.kind === 'krathong' ? 'lantern' : 'lotus')} ${r.kind === 'krathong' ? 'ปล่อยโคมต่อ' : 'ลอยกระทงต่อ'}</a>`
            : `<a class="btn btn-outline btn-sm" href="#/create/krathong">${I('refresh')} ลอยกระทง / ปล่อยโคม</a>`}
          <a class="btn btn-outline btn-sm" href="#/river">${I('waves')} ดูแม่น้ำและท้องฟ้ารวม</a>
        </div>
      </aside>
    </section>`;

    $('#copy').addEventListener('click', () => copy(url));
    $('#dl').addEventListener('click', () => downloadCard(r, when));
    $('#nativeShare')?.addEventListener('click', () => navigator.share({ title: document.title, text, url }).catch(() => {}));
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const i = $('#shareUrl');
      i.select();
      document.execCommand('copy');
    }
    toast('คัดลอกลิงก์แล้ว', 'check');
  }

  /* ================= ดาวน์โหลดรูปการ์ด ================= */
  function loadImg(svg) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }
  function wrapText(g, text, maxW) {
    const parts = window.Intl?.Segmenter
      ? [...new Intl.Segmenter('th', { granularity: 'word' }).segment(text)].map((s) => s.segment)
      : [...text];
    const lines = [];
    let line = '';
    for (const p of parts) {
      if (g.measureText(line + p).width > maxW && line) {
        lines.push(line.trim());
        line = p;
      } else line += p;
    }
    if (line.trim()) lines.push(line.trim());
    return lines;
  }
  async function downloadCard(r, when) {
    const W = 1080, H = 1350;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d');
    try {
      await Promise.all([document.fonts.load('500 64px Mitr'), document.fonts.load('400 40px Prompt')]);
    } catch {}

    const bg = g.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#0B1A33');
    bg.addColorStop(0.5, '#1B2457');
    bg.addColorStop(1, '#2C2560');
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    for (let i = 0; i < 120; i++) {
      g.fillStyle = `rgba(255,244,221,${(Math.random() * 0.7 + 0.1).toFixed(2)})`;
      g.beginPath();
      g.arc(Math.random() * W, Math.random() * 560, Math.random() * 2 + 0.4, 0, 7);
      g.fill();
    }
    const mg = g.createRadialGradient(820, 210, 0, 820, 210, 240);
    mg.addColorStop(0, 'rgba(255,244,221,.5)');
    mg.addColorStop(1, 'rgba(255,244,221,0)');
    g.fillStyle = mg;
    g.fillRect(560, 0, 520, 460);
    g.fillStyle = '#FFF4DD';
    g.beginPath();
    g.arc(820, 210, 86, 0, 7);
    g.fill();

    if (r.kind === 'krathong') {
      const wg = g.createLinearGradient(0, 560, 0, H);
      wg.addColorStop(0, '#2A3C78');
      wg.addColorStop(1, '#0B1A33');
      g.fillStyle = wg;
      g.fillRect(0, 560, W, H - 560);
      g.strokeStyle = 'rgba(255,244,221,.16)';
      g.lineWidth = 3;
      for (let y = 600; y < 780; y += 46) {
        g.beginPath();
        g.moveTo(80, y);
        g.lineTo(W - 80, y);
        g.stroke();
      }
    }
    try {
      const ph = myPhoto(r);
      const img = await loadImg(ART.render(r.kind, r.design, ph ? { photo: ph } : {}));
      const iw = r.kind === 'krathong' ? 560 : 360, ih = iw * ART.ratio(r.kind);
      const x0 = (W - iw) / 2, y0 = r.kind === 'krathong' ? 760 - ih : 150;
      g.drawImage(img, x0, y0, iw, ih);
      // วาดรูปตรงกลางทับลง canvas อีกชั้น ให้คมและอยู่ในกรอบวงกลมแน่นอน
      if (ph) {
        const pi = await new Promise((ok, no) => {
          const i = new Image();
          i.onload = () => ok(i);
          i.onerror = no;
          i.src = ph;
        }).catch(() => null);
        if (pi) {
          const { cx, cy, r: pr } = ART.builder.PHOTO, k = iw / 200;
          g.save();
          g.beginPath();
          g.arc(x0 + cx * k, y0 + cy * k, pr * k, 0, 7);
          g.clip();
          g.drawImage(pi, x0 + (cx - pr) * k, y0 + (cy - pr) * k, pr * 2 * k, pr * 2 * k);
          g.restore();
          g.strokeStyle = '#F4C46A';
          g.lineWidth = 3 * k;
          g.beginPath();
          g.arc(x0 + cx * k, y0 + cy * k, (pr + 2) * k, 0, 7);
          g.stroke();
        }
      }
    } catch (e) {
      console.error(e);
    }

    g.fillStyle = 'rgba(11,26,51,.78)';
    g.strokeStyle = 'rgba(244,196,106,.6)';
    g.lineWidth = 2;
    g.beginPath();
    g.roundRect ? g.roundRect(60, 800, W - 120, 480, 40) : g.rect(60, 800, W - 120, 480);
    g.fill();
    g.stroke();

    g.textAlign = 'center';
    g.fillStyle = '#F4C46A';
    g.font = '400 34px Prompt, sans-serif';
    g.fillText(`${KIND[r.kind].label}ของ`, W / 2, 870);
    g.fillStyle = '#FFF4DD';
    g.font = '500 62px Mitr, sans-serif';
    g.fillText(r.name, W / 2, 945, W - 200);
    g.font = '400 40px Prompt, sans-serif';
    wrapText(g, `“${r.wish}”`, W - 220).slice(0, 4).forEach((l, i) => g.fillText(l, W / 2, 1025 + i * 56));
    g.fillStyle = 'rgba(255,244,221,.7)';
    g.font = '300 28px Prompt, sans-serif';
    g.fillText(`คืนวันลอยกระทง · ${when}`, W / 2, 1245);
    g.fillStyle = '#F4C46A';
    g.font = '500 30px Mitr, sans-serif';
    g.fillText('ลอยกระทงออนไลน์', W / 2, H - 24);

    const save = (b) => {
      if (!b) return toast('สร้างรูปไม่สำเร็จ', 'x');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = `loykrathong-${r.id}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
      toast('ดาวน์โหลดรูปแล้ว', 'download');
    };
    try {
      c.toBlob(save);
    } catch (e) {
      console.error(e);
      save(null);
    }
  }

  /* ================= Router ================= */
  function route() {
    closePopup(false);
    if (document.activeElement?.matches?.('.logo')) document.activeElement.blur();
    const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    const page = parts[0] || 'home';
    document.body.dataset.view = ['create', 'w', 'river'].includes(page) ? page : 'home';
    if (page === 'create') {
      state = freshState(parts[1] === 'lantern' ? 'lantern' : 'krathong');
      renderChoose();
    } else if (page === 'w' && parts[1]) renderShare(decodeURIComponent(parts[1]));
    else if (page === 'river') renderRiver();
    else renderHome();
    scrollTo(0, 0);
  }

  /* ================= เริ่มต้น ================= */
  ICONS.hydrate();
  buildSky();
  Buddy.init();
  Meteor.start();
  buildRiverDecor();
  FishJump.start();
  Fireworks.start();
  $('#starBtn').addEventListener('click', openStarWish);
  Sound.init();
  $('#mode').hidden = DB.remote;
  const footH = () => document.documentElement.style.setProperty('--foot-h', $('.foot').offsetHeight + 'px');
  footH();
  document.addEventListener('visibilitychange', () => document.body.classList.toggle('tab-hidden', document.hidden));
  addEventListener('resize', footH);
  window.addEventListener('hashchange', route);
  route();
  loadScene();
  refreshCounts();
})();
