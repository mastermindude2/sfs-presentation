(() => {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s)), fx = window.SFSExperience;
  const invite = 'https://classroom.google.com/c/ODQ2OTIzODA3MjM0?cjc=sgvedclk';
  let page = 'home', mission = [], answers = [], locked = false, generation = 0, timers = [];
  const later = (fn, ms) => { const g = generation; timers.push(setTimeout(() => { if (g === generation) fn(); }, ms)); };
  function clearTimers() { generation++; timers.forEach(clearTimeout); timers = []; }
  function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(el.timer); el.timer = setTimeout(() => el.classList.remove('show'), 4000); }

  // One opt-in mix: UI cues, resonant pads, filtered noise and a spatial echo.
  let audio, master, compressor, echo, echoGain, wet, soundOn = false, soundBusy = false, volume = .28, lastCue = 0;
  const pads = [];
  const audioButton = $('#sfsSoundToggle'); audioButton.setAttribute('aria-pressed', 'false');
  function createAudio() {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) throw Error('Audio is unavailable');
    audio = new AC(); master = audio.createGain(); compressor = audio.createDynamicsCompressor();
    master.gain.value = volume; master.connect(compressor); compressor.connect(audio.destination);
    echo = audio.createDelay(1); echo.delayTime.value = .24; echoGain = audio.createGain(); echoGain.gain.value = .2; wet = audio.createGain(); wet.gain.value = .24;
    echo.connect(echoGain); echoGain.connect(echo); echo.connect(wet); wet.connect(master);
    [55, 82.4, 110].forEach((freq, i) => { const o = audio.createOscillator(), g = audio.createGain(); o.frequency.value = freq; g.gain.value = .014 / (i + 1); o.connect(g); g.connect(master); o.start(); pads.push(o); });
  }
  function tone(freq, duration, delay, gain = .07, type = 'sine', pan = 0) {
    const t = audio.currentTime + delay, o = audio.createOscillator(), g = audio.createGain(); o.type = type; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(freq * .995, t + duration);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + duration);
    o.connect(g); g.connect(echo);
    if (audio.createStereoPanner) { const p = audio.createStereoPanner(); p.pan.value = pan; g.connect(p); p.connect(master); } else g.connect(master);
    o.start(t); o.stop(t + duration + .03);
  }
  function noise(duration, gain, bend = true) {
    const b = audio.createBuffer(1, Math.ceil(audio.sampleRate * duration), audio.sampleRate), data = b.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.sin(i / data.length * Math.PI) ** 2;
    const src = audio.createBufferSource(), filter = audio.createBiquadFilter(), g = audio.createGain(); src.buffer = b; filter.type = 'bandpass'; filter.frequency.setValueAtTime(150, audio.currentTime); if (bend) filter.frequency.exponentialRampToValueAtTime(2400, audio.currentTime + duration); g.gain.value = gain; src.connect(filter); filter.connect(g); g.connect(master); src.start();
  }
  function filmClick(kind) {
    const t=audio.currentTime;const count=kind==='core'?16:kind==='warp'?24:kind==='splice'?2:1;
    for(let j=0;j<count;j++){const buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*.045),audio.sampleRate),d=buffer.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.exp(-i/(audio.sampleRate*.006));const src=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();src.buffer=buffer;filter.type='highpass';filter.frequency.value=kind==='splice'?1800:800;gain.gain.value=count>2?.07:.1;src.connect(filter);filter.connect(gain);gain.connect(master);src.start(t+j/18);}
  }
  function cue(kind = 'tap', x = innerWidth / 2) {
    if (!soundOn || !audio || document.hidden) return;
    if (kind === 'hover' && performance.now() - lastCue < 160) return;
    lastCue = performance.now(); if(['core','warp','scan','splice','crew'].includes(kind)) filmClick(kind); const pan = Math.max(-.75, Math.min(.75, x / innerWidth * 1.5 - .75));
    const notes = { hover: [[659, .12, 0, .018]], tap: [[440, .14, 0, .045], [880, .16, .03, .024]], role: [[294, .23, 0], [440, .3, .06]], crew: [[330, .3, 0], [495, .38, .08]], section: [[164.8, .65, 0, .03], [247, .75, .13, .022]], scan: [[220, .15, 0], [587, .22, .06]], reveal: [[110, .8, 0], [329.6, .8, .09], [493.9, .85, .19], [659.2, 1, .28]], core: [[73.4, .9, 0], [220, .75, .12], [440, 1, .25]], warp: [[65, 1.2, 0], [130, 1, .14], [520, .6, .3]] };
    for (const [n, d, offset, gain] of notes[kind] || notes.tap) tone(n, d, offset, gain || .065, 'sine', pan);
    if (['warp', 'core', 'reveal'].includes(kind)) noise(kind === 'warp' ? 1.1 : .5, .08);
  }
  audioButton.addEventListener('click', async () => {
    if (soundBusy) return; soundBusy = true;
    try { if (!audio) createAudio(); soundOn = !soundOn; if (soundOn) { await audio.resume(); master.gain.setTargetAtTime(volume, audio.currentTime, .08); cue('reveal'); } else { master.gain.setValueAtTime(0, audio.currentTime); await audio.suspend(); }
      audioButton.textContent = soundOn ? 'Sound On' : 'Sound Off'; audioButton.setAttribute('aria-pressed', String(soundOn));
    } catch { soundOn = false; audioButton.textContent = 'Sound Off'; audioButton.setAttribute('aria-pressed', 'false'); toast('Audio could not start in this browser. The visual experience is still available.'); } finally { soundBusy = false; }
  });
  const label = document.createElement('label'); label.className = 'sound-volume'; label.innerHTML = 'Volume <input type="range" min="0" max="100" value="28" aria-label="Sound volume">'; audioButton.after(label);
  label.querySelector('input').addEventListener('input', e => { volume = Number(e.target.value) / 100; if (soundOn) master.gain.setTargetAtTime(volume, audio.currentTime, .04); });
  document.addEventListener('visibilitychange', () => { if (!audio) return; if (document.hidden) audio.suspend(); else if (soundOn) audio.resume().catch(() => {}); });
  fx.on('section', ({ section }) => { const base = { hero: 55, about: 65.4, roles: 73.4, process: 61.7, join: 55, crew: 58.3, finder: 73.4 }[section] || 55; if (audio) pads.forEach((p, i) => p.frequency.setTargetAtTime(base * [1, 1.5, 2][i], audio.currentTime, .8)); cue('section'); });
  fx.on('cue', ({ kind, x }) => cue(kind, x));

  function motionUI() { const paused = fx.state.paused; $('#motionToggle').textContent = paused ? 'Resume motion' : 'Pause motion'; $('#motionToggle').setAttribute('aria-pressed', String(paused)); }
  motionUI(); fx.on('motion', motionUI); $('#motionToggle').addEventListener('click', () => fx.setPaused(!fx.state.paused));
  $('#qualityToggle').addEventListener('click', e => { fx.state.quiet = !fx.state.quiet; document.body.classList.toggle('low-fx', fx.state.quiet); e.currentTarget.textContent = fx.state.quiet ? 'FX: Quiet' : 'FX: Full'; e.currentTarget.setAttribute('aria-pressed', String(fx.state.quiet)); fx.emit('quality'); });

  const pages = { home: $('#sfsHomePage'), crew: $('#sfsCrewPage'), finder: $('#sfsFinderPage') };
  function closeMenu() { $('#navigation').classList.remove('open'); $('.menu-toggle').setAttribute('aria-expanded', 'false'); }
  function route(initial = false) {
    const hash = location.hash || '#hero'; page = ['#crew-page', '#crewSpotlight'].includes(hash) ? 'crew' : hash === '#role-finder' ? 'finder' : 'home';
    for (const [key, element] of Object.entries(pages)) element.classList.toggle('hidden-page', key !== page);
    closeMenu(); document.title = (page === 'crew' ? 'Meet the Crew' : page === 'finder' ? 'Find Your Role' : 'Sinclair Film Studios') + ' — SFS';
    $$('.sfs-nav a').forEach(a => { a.removeAttribute('aria-current'); if (a.getAttribute('href') === hash) a.setAttribute('aria-current', 'page'); });
    fx.setSection(page === 'home' ? hash.slice(1) : page); fx.emit('route', { page });
    if (!initial) { fx.burst(innerWidth * .65, innerHeight * .4, 1.6); cue('section'); }
    requestAnimationFrame(() => { const el = document.getElementById(hash.slice(1)); if (el && !el.closest('.hidden-page')) el.scrollIntoView({ behavior: initial || fx.state.paused ? 'instant' : 'smooth', block: 'start' }); else scrollTo({ top: 0, behavior: 'instant' }); });
  }
  addEventListener('hashchange', () => route()); route(true);
  $('.menu-toggle').addEventListener('click', () => { const opened = $('#navigation').classList.toggle('open'); $('.menu-toggle').setAttribute('aria-expanded', String(opened)); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', () => { if (a.getAttribute('href') === location.hash) route(); }));

  const visits = new Set(), words = { actor: 'ACT.', writer: 'WRITE.', camera: 'FILM.', editor: 'EDIT.', design: 'DESIGN.', crew: 'BUILD.' };
  $$('.role-tabs button').forEach((b, i) => { b.setAttribute('aria-pressed', String(i === 0)); b.addEventListener('click', () => {
    $$('.role-tabs button').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    const [title, desc] = roleData[b.dataset.role]; $('#roleOutput').innerHTML = `<p class="mini">Now showing</p><h3>${title}</h3><p>${desc}</p>`;
    $('#deptNumber').textContent = String(i + 1).padStart(2, '0'); $('#deptWord').textContent = words[b.dataset.role]; visits.add(b.dataset.role);
    if (visits.size === 6) discover('route'); cue('role'); fx.emit('department', { index: i });
  }); });

  function startQuiz() { clearTimers(); mission = createMission(); answers = []; locked = false; $('#finderIntro').classList.remove('active'); $('#finderResult').classList.remove('active', 'result-ready'); $('#scanCutscene').classList.remove('active'); $('#finderQuiz').classList.add('active'); question(); cue('scan'); }
  function question() {
    const n = answers.length, q = mission[n]; locked = false; $('#finderCount').textContent = `Question ${n + 1} / 10`; $('#finderMode').textContent = ['Getting to know you', 'Following your interests', 'Connecting the pieces'][n < 3 ? 0 : n < 7 ? 1 : 2];
    $('#finderProgress').style.width = `${n * 10}%`; $('.finder-progress').setAttribute('aria-valuenow', n); $('#finderQuestion').textContent = q.q; $('#finderOptions').replaceChildren();
    q.a.forEach((a, i) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'finder-option'; button.textContent = a.t; button.addEventListener('click', () => choose(i)); $('#finderOptions').append(button); });
    $('#finderBack').disabled = n === 0; $('#finderQuestion').focus({ preventScroll: true });
  }
  function choose(i) { if (locked) return; locked = true; answers.push(i); $$('.finder-option').forEach(b => b.disabled = true); $('#finderBack').disabled = true; $('#finderProgress').style.width = `${answers.length * 10}%`; $('.finder-progress').setAttribute('aria-valuenow', answers.length); cue('scan'); later(() => answers.length === 10 ? result() : question(), fx.state.paused ? 0 : 160); }
  function result() {
    const { ranked, tied } = scoreMission(mission, answers), top = ranked[0], detail = finderRoleDetails[top.role];
    $('#finderQuiz').classList.remove('active'); $('#finderResult').classList.add('active');
    $('#resultRole').textContent = tied.length > 1 ? 'A creative blend.' : detail.title;
    $('#resultDesc').textContent = tied.length > 1 ? `Your strongest interests are ${tied.map(r => finderRoleDetails[r].title).join(' + ')}. You can explore more than one department.` : detail.desc;
    $('#resultTagline').textContent = tied.length > 1 ? 'Every great film brings different instincts together.' : detail.line;
    $('#resultBars').innerHTML = ranked.slice(0, 5).map(r => `<div class="bar-row"><span>${finderRoleDetails[r.role].title}</span><div class="bar-track"><div class="bar-fill" style="width:${r.affinity}%"></div></div><span>${r.affinity}%</span></div>`).join('');
    $('#scoreNote').textContent = 'Interest scores show how often you chose a role when it appeared. All ten roles get equal opportunities. This is a short interest quiz, not an aptitude test; ties are shared matches.';
    $('#resultEvidence').innerHTML = ranked.filter(r => r.score > 0).slice(0, 3).map(r => `<article><b>${finderRoleDetails[r.role].title}</b><p>${finderRoleDetails[r.role].desc}</p><small>You chose: ${r.evidence.map(e => e.a).join(' · ')}</small></article>`).join('');
    $('#scanRolesStrip').innerHTML = ranked.slice(0, 5).map(r => `<span class="scan-role-pill">${finderRoleDetails[r.role].title}</span>`).join('');
    const ready = () => { $('#scanCutscene').classList.remove('active'); $('#finderResult').classList.add('result-ready'); $('#resultRole').focus({ preventScroll: true }); fx.burst(innerWidth / 2, innerHeight / 2, 2); cue('reveal'); };
    if (fx.state.paused) return ready();
    $('#scanCutscene').classList.add('active');
    ['Following your choices', 'Connecting your interests', 'Your name in the credits'].forEach((t, i) => later(() => { $('#scanPhaseTitle').textContent = t; $('#scanPhaseText').textContent = 'Finding where you might enjoy creating.'; $('#scanMeterFill').style.width = `${(i + 1) / 3 * 100}%`; cue('scan'); }, i * 550)); later(ready, 1750);
  }
  $('#startFinder').addEventListener('click', startQuiz); $('#tryAgain').addEventListener('click', startQuiz); $('#finderBack').addEventListener('click', () => { if (locked || !answers.length) return; answers.pop(); question(); });

  function selectCrew(index, scroll = true) { $$('.crew-spot-card').forEach((e, i) => e.classList.toggle('active', i === index)); $$('[data-crew-select]').forEach(b => { const active = Number(b.dataset.crewSelect) === index; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); }); fx.emit('crew-selected', { index }); if (scroll) $('#crewSpotlight').scrollIntoView({ behavior: fx.state.paused ? 'instant' : 'smooth', block: 'start' }); cue('crew'); }
  $$('[data-crew-select]').forEach(b => b.addEventListener('click', () => selectCrew(Number(b.dataset.crewSelect)))); fx.on('crew-picked', ({ index }) => selectCrew(index)); selectCrew(0, false);
  $('#crewPauseBtn').setAttribute('aria-pressed', 'false'); $('#crewPauseBtn').addEventListener('click', e => { fx.state.crewPaused = !fx.state.crewPaused; e.currentTarget.textContent = fx.state.crewPaused ? 'Resume film' : 'Pause film'; e.currentTarget.setAttribute('aria-pressed', String(fx.state.crewPaused)); });

  // Different content families have their own spring stiffness and cue.
  const springs = new Map();
  $$('.story-card,.scene-card,.sfs-button,.crew-portrait-stage,.department-art').forEach((el, index) => {
    const spring = { el, x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, k: 70 + index % 4 * 20 }; springs.set(el, spring);
    el.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' || fx.state.paused) return; const r = el.getBoundingClientRect(); spring.tx = (e.clientX - r.left - r.width / 2) / r.width * 4; spring.ty = (e.clientY - r.top - r.height / 2) / r.height * 4; });
    el.addEventListener('pointerleave', () => { spring.tx = 0; spring.ty = 0; });
  });
  let sectionCheck = 0, wordTime = 0, word = 0;
  fx.tick((dt, state) => {
    for (const sp of springs.values()) { if (state.paused) { sp.el.style.transform = ''; continue; } if (Math.abs(sp.x) + Math.abs(sp.y) + Math.abs(sp.tx) + Math.abs(sp.ty) < .01) continue;
      sp.vx += ((sp.tx - sp.x) * sp.k - sp.vx * 15) * dt; sp.vy += ((sp.ty - sp.y) * sp.k - sp.vy * 15) * dt; sp.x += sp.vx * dt; sp.y += sp.vy * dt;
      sp.el.style.transform = `perspective(900px) rotateX(${-sp.y}deg) rotateY(${sp.x}deg) translate3d(${sp.x * .5}px,${sp.y * .5}px,0)`;
    }
    sectionCheck += dt;
    if (sectionCheck > .22) { sectionCheck = 0; if (page === 'home') { const sections = $$('#sfsHomePage section[id]'); let nearest = sections[0], distance = Infinity; for (const el of sections) { const r = el.getBoundingClientRect(), d = Math.abs((r.top + r.bottom) / 2 - innerHeight / 2); if (d < distance) { nearest = el; distance = d; } } if (nearest) fx.setSection(nearest.id); } }
    if (!state.paused && page === 'home') { wordTime += dt; if (wordTime > 4) { wordTime = 0; $('#rotatingWord').textContent = ['movie.', 'story.', 'premiere.', 'universe.'][++word % 4]; } }
  });
  document.addEventListener('pointerover', e => { const el = e.target.closest('button,a,.story-card,.scene-card'); if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return; cue('hover', e.clientX); });
  document.addEventListener('click', e => { const el = e.target.closest('button,a'); if (!el || el.id === 'sfsSoundToggle') return; const r = el.getBoundingClientRect(); fx.burst(e.detail ? e.clientX : r.x + r.width / 2, e.detail ? e.clientY : r.y + r.height / 2, .7); cue('tap', r.x + r.width / 2); });
  addEventListener('scroll', () => { const max = document.documentElement.scrollHeight - innerHeight; $('#sfsProgress').style.width = `${max > 0 ? scrollY / max * 100 : 0}%`; }, { passive: true });
  const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target); } }), { threshold: .12 }); $$('.reveal').forEach(el => observer.observe(el));

  const found = new Set(), secrets = [
    ['core', 'First screening', 'A little light, a strip of film, and suddenly another world.', 'The projector is waiting for its first screening.'],
    ['warp', 'Opening night', 'Every film deserves an opening worth remembering.', 'There is an opening sequence waiting to roll.'],
    ['signal', 'Three takes', 'One for the idea. One for the courage. One for the film.', 'The studio mark likes a third take.'],
    ['route', 'The whole production', 'You explored every department. Now bring them together.', 'Visit every department on set.'],
    ['credit', 'After the credits', 'The ending is only another place to begin.', 'Stay until the very end.']
  ];
  function drawLog() { $('#discoveryCount').textContent = found.size; $('#discoveryList').innerHTML = secrets.map(([id, title, message, hint]) => `<li class="${found.has(id) ? 'found' : ''}">${found.has(id) ? title : 'Undiscovered'}<br><small>${found.has(id) ? message : hint}</small></li>`).join(''); }
  function discover(id) { if (found.has(id)) return; const secret = secrets.find(x => x[0] === id); if (!secret) return; found.add(id); drawLog(); toast(`${secret[1]} — ${secret[2]}`); cue('reveal'); if (found.size === 5) fx.emit('warp'); }
  drawLog(); fx.on('discover', ({ id }) => discover(id));
  const dialog = $('#discoveryDialog'); $('#logButton').addEventListener('click', () => dialog.showModal()); $('.dialog-close').addEventListener('click', () => dialog.close()); dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  let logoClicks = 0, logoTimer; $('#signalLogo').addEventListener('click', () => { clearTimeout(logoTimer); if (++logoClicks === 3) { discover('signal'); logoClicks = 0; } logoTimer = setTimeout(() => logoClicks = 0, 1700); });
  $('#endCredit').addEventListener('click', () => discover('credit'));
  $('#warpButton').addEventListener('click', () => { discover('warp'); fx.emit('warp'); cue('warp'); if (!fx.state.paused) { document.body.classList.add('warping'); setTimeout(() => document.body.classList.remove('warping'), 1500); } });
  $('#copyInvite').addEventListener('click', async () => { try { await navigator.clipboard.writeText(invite); $('#copyStatus').textContent = 'Invite copied. See you on set.'; } catch { $('#copyStatus').textContent = `Copy this invite: ${invite}`; } });
  document.body.dataset.appReady = 'true';
})();
