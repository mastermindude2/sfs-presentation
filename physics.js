/* The shared clock and particle field deliberately have no 3D dependency. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const state = { paused: reduced.matches, quiet: false, crewPaused: false, section: 'hero', time: 0, warp: 0,
    pointer: { x: innerWidth * .72, y: innerHeight * .48, active: false, down: false }, scrollVelocity: 0 };
  const subscribers = new Set(), listeners = new Map();
  const api = window.SFSExperience = {
    state,
    on(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    emit(name, detail = {}) { for (const fn of listeners.get(name) || []) fn(detail); },
    tick(fn) { subscribers.add(fn); return () => subscribers.delete(fn); },
    setPaused(value) { state.paused = value; document.documentElement.classList.toggle('motion-paused', value); api.emit('motion', { paused: value }); },
    setSection(value) { if (value === state.section) return; state.section = value; api.emit('section', { section: value }); },
    burst(x = innerWidth / 2, y = innerHeight / 2, strength = 1) { api.emit('burst', { x, y, strength }); }
  };
  api.setPaused(state.paused);
  reduced.addEventListener('change', e => api.setPaused(e.matches));
  let last = 0, scrollLast = scrollY, scrollImpulse = 0;
  document.addEventListener('pointermove', e => { Object.assign(state.pointer, { x: e.clientX, y: e.clientY, active: true }); }, { passive: true });
  document.addEventListener('pointerdown', e => { Object.assign(state.pointer, { x: e.clientX, y: e.clientY, active: true, down: true }); api.burst(e.clientX, e.clientY, .5); }, { passive: true });
  document.addEventListener('pointerup', () => { state.pointer.down = false; }, { passive: true });
  document.addEventListener('pointercancel', () => { state.pointer.down = false; state.pointer.active = false; }, { passive: true });
  document.addEventListener('pointerout', e => { if (!e.relatedTarget) state.pointer.active = false; }, { passive: true });
  addEventListener('scroll', () => { scrollImpulse += scrollY - scrollLast; scrollLast = scrollY; }, { passive: true });
  function frame(now) {
    const dt = Math.min((now - last) / 1000 || 1 / 60, .04); last = now;
    if (!document.hidden) {
      state.scrollVelocity += (scrollImpulse - state.scrollVelocity) * (1 - Math.exp(-9 * dt)); scrollImpulse *= Math.exp(-8 * dt);
      if (!state.paused) { state.time += dt; state.warp = Math.max(0, state.warp - dt * .7); }
      for (const fn of subscribers) fn(dt, state);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  const canvas = document.getElementById('starfield'), ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width = 0, height = 0, stars = [], bursts = [], comets = [], cometDue = 5, palette = [137, 186, 255];
  const colors = { hero: [140, 184, 255], about: [197, 154, 255], roles: [111, 230, 244], process: [224, 184, 255], join: [156, 221, 255], crew: [194, 152, 255], finder: [120, 229, 236] };
  function resize() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.6); canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.min(650, Math.max(230, Math.floor(width * height / 2100))) }, (_, i) => {
      const x = Math.random() * width, y = Math.random() * height;
      return { x, y, ax: x, ay: y, vx: 0, vy: 0, depth: .18 + Math.random() * .82, size: .4 + Math.random() * 1.4, phase: Math.random() * 6.28, rate: .4 + Math.random() * 1.3, arm: i % 3, seed: Math.random() };
    });
    canvas.dataset.ready = 'true';
  }
  resize(); addEventListener('resize', resize);
  api.on('burst', ({ x, y, strength }) => {
    if (state.paused) return;
    bursts.push({ x, y, age: 0, strength });
    if (bursts.length > 8) bursts.shift();
    for (const s of stars) { const dx = s.x - x, dy = s.y - y, d = Math.hypot(dx, dy) + 20; if (d < 260) { s.vx += dx / d * 140 * strength * (1 - d / 260); s.vy += dy / d * 140 * strength * (1 - d / 260); } }
  });
  api.on('warp', () => { if (!state.paused) state.warp = 2; api.burst(width * .64, height * .45, 2); });
  function haze(cx, cy, radius, rgb, alpha) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius); g.addColorStop(0, `rgba(${rgb},${alpha})`); g.addColorStop(.45, `rgba(${rgb},${alpha * .3})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(0, 0, width, height);
  }
  api.tick((dt, s) => {
    ctx.clearRect(0, 0, width, height);
    const t = s.time, target = colors[s.section] || colors.hero;
    palette = palette.map((v, i) => v + (target[i] - v) * (1 - Math.exp(-dt * 1.5)));
    const rgb = palette.map(Math.round).join(',');
    const cx = width * (.65 + Math.sin(t * .035) * .07), cy = height * (.43 + Math.cos(t * .04) * .06);
    haze(cx, cy, Math.max(width, height) * .66, '71,51,155', s.quiet ? .13 : .26);
    haze(width * .13, height * .75, height * .72, '30,113,157', .14);
    haze(width * .85, height * .12, height * .7, '136,39,131', .1);
    let index = 0;
    for (const p of stars) {
      index++; if (s.quiet && index % 2) continue;
      const px = p.x, py = p.y;
      if (!s.paused) {
        let tx = p.ax + Math.sin(t * .12 + p.phase) * 18 * p.depth, ty = p.ay + Math.cos(t * .1 + p.phase) * 14;
        if (['about','roles','process','crew','finder','join'].includes(s.section) && index % 3 !== 0) {
          // Stars assemble into the two perforated edges of a flowing strip of film.
          const u=p.seed*1.3-.15,edge=p.arm===0?-1:1;
          tx=u*width;
          const wave=Math.sin(u*6.28+t*.12)*height*.18;
          ty=height*.52+wave+edge*(s.section==='process'?40:65)+(p.depth-.5)*14;
          if(s.section==='finder'){const col=Math.floor(p.seed*10),row=edge;tx=width*.12+col*width*.078+(p.depth-.5)*12;ty=height*.5+row*height*.28+Math.sin(t*.15+col)*8;}
        }
        let fx = (tx - p.x) * .52, fy = (ty - p.y) * .52 - s.scrollVelocity * p.depth * 2.1;
        if (s.pointer.active) {
          const dx = s.pointer.x - p.x, dy = s.pointer.y - p.y, d2 = dx * dx + dy * dy + 1600, d = Math.sqrt(d2);
          if (d < 250) { const force = (s.pointer.down ? 13000 : -5200) * p.depth / d2; fx += dx * force - (s.pointer.down ? dy * force * .7 : 0); fy += dy * force + (s.pointer.down ? dx * force * .7 : 0); }
        }
        if (s.warp) { fx += (p.x - width * .64) * s.warp * 7; fy += (p.y - height * .45) * s.warp * 7; }
        p.vx = (p.vx + fx * dt) * Math.exp(-1.8 * dt); p.vy = (p.vy + fy * dt) * Math.exp(-1.8 * dt);
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (Math.abs(p.x - width / 2) > width * 1.5 || Math.abs(p.y - height / 2) > height * 1.5) { p.x = p.ax; p.y = p.ay; p.vx = 0; p.vy = 0; }
      }
      const twinkle = .48 + .52 * Math.pow(.5 + .5 * Math.sin(t * p.rate + p.phase), 2);
      const alpha = .25 + twinkle * p.depth * .65, size = p.size * (.6 + p.depth * .65);
      ctx.fillStyle = `rgba(${rgb},${alpha})`;
      if (!s.paused && (Math.abs(p.vx) + Math.abs(p.vy) > 20)) { ctx.strokeStyle = `rgba(${rgb},${alpha * .35})`; ctx.lineWidth = size * .7; ctx.beginPath(); ctx.moveTo(px - p.vx * .05, py - p.vy * .05); ctx.lineTo(p.x, p.y); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI * 2); ctx.fill();
      if (p.depth > .93) { ctx.strokeStyle = `rgba(217,238,255,${alpha * .45})`; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(p.x - size * 4, p.y); ctx.lineTo(p.x + size * 4, p.y); ctx.moveTo(p.x, p.y - size * 4); ctx.lineTo(p.x, p.y + size * 4); ctx.stroke(); }
    }
    if (s.pointer.active && !s.quiet) {
      const close = stars.filter(p => p.depth > .5 && Math.hypot(p.x - s.pointer.x, p.y - s.pointer.y) < 175).slice(0, 7);
      close.forEach((p, i) => { const next = close[i + 1]; if (!next) return; const opacity = .13 * (1 - Math.hypot(p.x - s.pointer.x, p.y - s.pointer.y) / 175); ctx.strokeStyle = `rgba(${rgb},${opacity})`; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(next.x, next.y); ctx.stroke(); });
    }
    if (!s.paused) {
      cometDue -= dt;
      if (cometDue <= 0 && !s.quiet) { comets.push({ x: Math.random() * width * .7, y: Math.random() * height * .45, life: 0 }); cometDue = 5 + Math.random() * 8; }
      for (const c of comets) { c.life += dt; c.x += dt * 190; c.y += dt * 85; const a = Math.sin(Math.min(1, c.life / 1.8) * Math.PI) * .65; const g = ctx.createLinearGradient(c.x - 95, c.y - 43, c.x, c.y); g.addColorStop(0, 'transparent'); g.addColorStop(1, `rgba(195,224,255,${a})`); ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(c.x - 95, c.y - 43); ctx.lineTo(c.x, c.y); ctx.stroke(); }
      comets = comets.filter(c => c.life < 1.8);
      for (const b of bursts) { b.age += dt; ctx.strokeStyle = `rgba(${rgb},${Math.max(0, .32 - b.age * .24)})`; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(b.x, b.y, b.age * 240, b.age * 150, -.3, 0, Math.PI * 2); ctx.stroke(); }
      bursts = bursts.filter(b => b.age < 1.4);
    }
    canvas.dataset.frames = String((Number(canvas.dataset.frames) || 0) + 1);
  });
})();
