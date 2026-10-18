/* Chemsha Bongo beta: screens, game engines, storage. */
(function () {
  'use strict';
  const app = document.getElementById('app');
  const KEY = 'chemshabongo.beta.v1';
  const RANK = { chipukizi: 0, mjanja: 1, dingi: 2 };
  const LEVELS = [
    { id: 'chipukizi', name: 'Chipukizi', sw: 'Ndo unaanza. Maneno rahisi, methali maarufu, muda zaidi.', en: 'Beginner · just sprouting' },
    { id: 'mjanja', name: 'Mjanja', sw: 'Unajua mambo. Misemo ya mtaani, maswali magumu kidogo.', en: 'Amateur · street smart' },
    { id: 'dingi', name: 'Dingi', sw: 'Wewe ni mkongwe. Methali nzito, historia ya zamani, bila huruma.', en: 'Professional · the OG' }
  ];
  const AVATAR_IDS = ['simba', 'twiga', 'tembo', 'pundamilia'];

  /* ---------- state ---------- */
  function defaults() { return { profile: null, draft: null, points: 0, streakDays: 0, bestDays: 0, lastPlay: null, games: 0, best: {}, played: {} }; }
  let S = defaults();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(defaults(), JSON.parse(raw)); } catch (e) { /* storage blocked: play without saving */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }

  /* ---------- helpers ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmt = n => Number(n || 0).toLocaleString('en-US');
  const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return ymd(d); };
  const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = sel => app.querySelector(sel);
  const $$ = sel => Array.from(app.querySelectorAll(sel));

  let cleanups = [];
  function addCleanup(f) { cleanups.push(f); }
  function go(fn, ...args) {
    cleanups.splice(0).forEach(f => { try { f(); } catch (e) { /* ignore */ } });
    fn(...args);
    try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
  }
  function countdown(ms, onTick, onEnd) {
    const start = performance.now(); let raf = 0, done = false;
    const loop = t => {
      if (done) return;
      const left = Math.max(0, ms - (t - start)); onTick(left);
      if (left <= 0) { done = true; onEnd(); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const stop = () => { done = true; cancelAnimationFrame(raf); };
    addCleanup(stop);
    return stop;
  }

  function liveStreak() {
    if (!S.lastPlay) return 0;
    return (S.lastPlay === ymd(new Date()) || S.lastPlay === yesterday()) ? S.streakDays : 0;
  }
  function bumpDaily() {
    const t = ymd(new Date());
    if (S.lastPlay === t) return false;
    S.streakDays = S.lastPlay === yesterday() ? S.streakDays + 1 : 1;
    S.lastPlay = t; S.bestDays = Math.max(S.bestDays || 0, S.streakDays);
    return true;
  }
  function levelName(id) { const l = LEVELS.find(x => x.id === id); return l ? l.name : ''; }

  function avatar(p, cls) {
    p = p || S.profile; cls = cls || 'av';
    if (!p) return '';
    if (p.avatar === 'selfie' && p.selfie) return `<img class="${cls}" src="${p.selfie}" alt="Selfie ya ${esc(p.name)}">`;
    if (p.avatar === 'herufi') return `<span class="${cls} initial" role="img" aria-label="Herufi ya kwanza ya ${esc(p.name)}">${esc((p.name || '?').trim().charAt(0).toUpperCase())}</span>`;
    const a = ART.avatars[p.avatar] || ART.avatars.simba;
    return `<span class="${cls}" role="img" aria-label="Avatar ${a.name}">${a.svg}</span>`;
  }

  function pick(list, lvl, age, n, practice) {
    const r = practice ? 0 : RANK[S.profile.level] || 0;
    const a = S.profile.age || 99;
    const okAge = x => (age(x) || 0) <= a;
    let pool = list.filter(x => okAge(x) && RANK[lvl(x)] <= r && RANK[lvl(x)] >= r - 1);
    if (pool.length < n) pool = list.filter(x => okAge(x) && RANK[lvl(x)] <= Math.max(r, 1));
    if (pool.length < n) pool = list.filter(okAge);
    return shuffle(pool).slice(0, n);
  }

  function nav(cur) {
    const b = (id, label, icon) => `<button type="button" data-go="${id}" ${cur === id ? 'aria-current="page"' : ''}>${icon}${label}</button>`;
    return `<nav class="nav" aria-label="Menyu kuu">${b('home', 'Nyumbani', I.home)}${b('league', 'Ligi', I.trophy)}${b('profile', 'Wasifu', I.user)}</nav>`;
  }

  app.addEventListener('click', e => {
    const t = e.target.closest('[data-go]');
    if (!t) return;
    const r = t.dataset.go;
    if (r === 'home') go(scrHome);
    else if (r === 'league') go(scrLeague);
    else if (r === 'profile') go(scrProfile);
  });

  /* ---------- modes ---------- */
  const MODES = {
    methali: {
      name: 'Malizia Methali', en: 'Finish the proverb', cls: 'm-methali', art: () => ART.thumbMethali(),
      steps: ['Soma mwanzo wa methali.', 'Chagua neno linalokamilisha methali kabla saa haijaisha.', 'Majibu sahihi mfululizo yanaongeza bonasi. Baada ya kila jibu, soma maana yake.'],
      enSum: 'Pick the word that completes the Swahili proverb. Streaks earn bonus points.',
      start: p => startQuiz('methali', p)
    },
    geo: {
      name: 'Unaijua Dar?', en: 'Geography · know your Tanzania', cls: 'm-geo', art: () => ART.mountains(true), wide: true,
      steps: ['Utaulizwa kuhusu mkoa au mahali Tanzania.', 'Chagua jibu sahihi kati ya manne.', 'Umekwama? Ondoa majibu mawili kwa pointi 20.'],
      enSum: 'Questions about Tanzanian regions and places. Use a 50/50 hint for 20 points.',
      start: p => startQuiz('geo', p)
    },
    mazao: {
      name: 'Mazao', en: 'Guess the crop', cls: 'm-mazao', art: () => ART.crop('alizeti'),
      steps: ['Tazama picha ya zao. Kwa Mjanja na Dingi, picha imefifia kidogo.', 'Bonyeza herufi kukisia jina la zao. Kila herufi sahihi inaifanya picha iwe wazi zaidi.', 'Una matone 6 ya maji. Ukikosa yote, mmea unakauka!', 'Dokezo: linalimwa wapi, na linajulikana kwa nini. Kila dokezo ni pointi 20.'],
      enSum: 'Hangman with crops: look at the picture and guess its Swahili name letter by letter. Mjanja and Dingi pictures start slightly blurred. Hints tell you where it grows and what it is used for.',
      start: p => startMazao(p)
    },
    heads: {
      name: 'Heads Up!', en: 'Describe it without saying it', cls: 'm-heads', art: () => ART.thumbHeads(),
      steps: ['Chagua kundi: watu maarufu, historia, maeneo, vyakula au burudani.', 'Weka simu kwenye paji la uso, skrini ikiwaelekea wenzako.', 'Wenzako wanaeleza neno bila kulitaja. Bonyeza Sahihi ukipata, au Pita.', 'Una sekunde 60. Pata 5 au zaidi ushinde.'],
      enSum: 'Hold the phone to your forehead; friends describe the word without saying it. Tap Sahihi (correct) or Pita (pass).',
      start: p => go(scrHeadsPick, p)
    },
    chora: {
      name: 'Chora Tuone', en: 'Draw it, they guess it', cls: 'm-chora', art: () => ART.thumbChora(),
      steps: ['Gawanyikeni timu mbili.', 'Mchoraji ashikilie kitufe kuona neno la Kiswahili. Wengine wasitazame!', 'Chora! Timu yako ikisie kwa sauti ndani ya sekunde 60. Usiandike herufi.', 'Bonyeza Wamepata au Pita, kisha pitisha simu kwa timu nyingine.'],
      enSum: 'Pictionary for two teams on one phone. The drawer sees a Swahili word; their team guesses out loud.',
      start: p => go(scrChoraSetup, p)
    }
  };

  /* ---------- onboarding ---------- */
  function scrKaribu() {
    const d = S.draft || {};
    app.innerHTML = `${ART.band()}<form class="screen" id="f" novalidate>
      <div class="scene">${ART.mountains()}<span class="scene-label">Hatua 1 kati ya 3</span></div>
      <div class="stack">
        <h1 class="h1">Karibu Chemsha Bongo!</h1>
        <p class="lead">Methali, jiografia, mazao, Heads Up na michoro, yote kwa Kiswahili. Tujuane kidogo kwanza.</p>
      </div>
      <div class="field"><label for="in-name">Tukuite nani?</label>
        <input id="in-name" type="text" autocomplete="nickname" maxlength="20" placeholder="mf. Amani" value="${esc(d.name || '')}">
        <span class="hint">Jina hili litaonekana kwenye ligi.</span></div>
      <div class="field"><label for="in-email">Barua pepe</label>
        <input id="in-email" type="email" autocomplete="email" placeholder="jina@mfano.com" value="${esc(d.email || '')}"></div>
      <div class="field"><label for="in-age">Una miaka mingapi?</label>
        <input id="in-age" class="age" type="number" inputmode="numeric" min="5" max="100" placeholder="mf. 24" value="${esc(d.age || '')}"></div>
      <div class="note"><b>Kwa nini tunauliza umri?</b> Ili tukuletee methali, maswali na maneno yanayofaa umri wako.</div>
      <label class="check" id="consent-wrap" ${d.age && d.age < 13 ? '' : 'hidden'}><input type="checkbox" id="in-consent" ${d.consent ? 'checked' : ''}><span>Nina chini ya miaka 13, na mzazi au mlezi wangu amekubali nicheze Chemsha Bongo.</span></label>
      <p class="err" id="err" role="alert"></p>
      <button class="btn block" type="submit">Endelea</button>
      <p class="fine">Toleo la beta: taarifa zako zinabaki kwenye kifaa hiki tu.</p>
    </form>`;
    const ageIn = $('#in-age'), cw = $('#consent-wrap');
    ageIn.addEventListener('input', () => { const a = parseInt(ageIn.value, 10); cw.hidden = !(a >= 5 && a < 13); });
    $('#f').addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#in-name').value.trim(), email = $('#in-email').value.trim(), age = parseInt(ageIn.value, 10), consent = $('#in-consent').checked;
      const err = $('#err');
      if (name.length < 2) { err.textContent = 'Andika jina lenye herufi 2 au zaidi.'; $('#in-name').focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = 'Barua pepe si sahihi. Mfano: amani@mfano.com'; $('#in-email').focus(); return; }
      if (!(age >= 5 && age <= 100)) { err.textContent = 'Andika umri wako kwa namba, kati ya 5 na 100.'; ageIn.focus(); return; }
      if (age < 13 && !consent) { err.textContent = 'Tunahitaji ruhusa ya mzazi au mlezi kwa wachezaji walio chini ya miaka 13.'; return; }
      S.draft = Object.assign({}, S.draft, { name, email, age, consent: age < 13 ? consent : false });
      save(); go(scrLevel);
    });
  }

  function scrLevel() {
    const d = S.draft || {}; const cur = d.level || (d.age && d.age < 10 ? 'chipukizi' : 'mjanja');
    app.innerHTML = `${ART.band()}<form class="screen" id="f">
      <div class="topbar"><button type="button" class="iconbtn" id="back" aria-label="Rudi">${I.back}</button><span class="eyebrow">Hatua 2 kati ya 3</span><span style="width:44px"></span></div>
      <div class="stack"><h1 class="h1">Uko level gani, ${esc(d.name || '')}?</h1>
      <p class="lead">Unaweza kubadilisha baadaye kwenye Wasifu.</p></div>
      <div class="choices" role="radiogroup" aria-label="Kiwango">
        ${LEVELS.map(l => `<label class="choice"><input type="radio" name="lvl" value="${l.id}" ${l.id === cur ? 'checked' : ''}><span class="ctitle">${l.name}</span><span class="csw">${l.sw}</span><span class="cen">${l.en}</span></label>`).join('')}
      </div>
      <button class="btn block" type="submit">Endelea</button>
    </form>`;
    $('#back').addEventListener('click', () => go(scrKaribu));
    $('#f').addEventListener('submit', e => {
      e.preventDefault();
      S.draft.level = (app.querySelector('input[name="lvl"]:checked') || {}).value || 'mjanja';
      save(); go(scrAvatar, false);
    });
  }

  function scrAvatar(editing) {
    const base = editing ? S.profile : S.draft;
    let selfie = base.selfie || null;
    const cur = base.avatar || 'simba';
    const name = base.name || '';
    const tile = (id, inner, label) => `<label class="choice"><input type="radio" name="av" value="${id}" ${cur === id ? 'checked' : ''}>${inner}<span>${label}</span></label>`;
    app.innerHTML = `${ART.band()}<form class="screen" id="f">
      <div class="topbar"><button type="button" class="iconbtn" id="back" aria-label="Rudi">${I.back}</button><span class="eyebrow">${editing ? 'Badilisha picha' : 'Hatua 3 kati ya 3'}</span><span style="width:44px"></span></div>
      <div class="stack"><h1 class="h1">Chagua sura yako</h1>
      <p class="lead">Itaonekana kwenye ligi na itashangilia nawe ukishinda. Unaweza kutumia avatar au selfie.</p></div>
      <div class="avgrid" role="radiogroup" aria-label="Avatar">
        ${AVATAR_IDS.map(id => tile(id, `<span class="av">${ART.avatars[id].svg}</span>`, ART.avatars[id].name)).join('')}
        ${tile('herufi', `<span class="av initial">${esc(name.charAt(0).toUpperCase() || 'A')}</span>`, 'Herufi')}
        ${tile('selfie', `<span id="selfie-prev">${selfie ? `<img class="av" src="${selfie}" alt="Selfie yako">` : `<span class="av" style="background:var(--sky)">${I.camera}</span>`}</span>`, 'Selfie')}
      </div>
      <label class="btn ghost block selfie-btn" for="in-selfie">${I.camera} Piga au chagua selfie
        <input id="in-selfie" type="file" accept="image/*" capture="user"></label>
      <p class="fine">Selfie inabaki kwenye kifaa hiki tu. Haitumwi popote.</p>
      <p class="err" id="err" role="alert"></p>
      <button class="btn block" type="submit">${editing ? 'Hifadhi' : 'Anza kucheza'}</button>
    </form>`;
    $('#back').addEventListener('click', () => go(editing ? scrProfile : scrLevel));
    $('#in-selfie').addEventListener('change', e => {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      const img = new Image(); const url = URL.createObjectURL(f);
      img.onload = () => {
        const s = 320, c = document.createElement('canvas'); c.width = s; c.height = s;
        const m = Math.min(img.width, img.height);
        c.getContext('2d').drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s);
        selfie = c.toDataURL('image/jpeg', .82); URL.revokeObjectURL(url);
        $('#selfie-prev').innerHTML = `<img class="av" src="${selfie}" alt="Selfie yako">`;
        app.querySelector('input[name="av"][value="selfie"]').checked = true;
        $('#err').textContent = '';
      };
      img.onerror = () => { $('#err').textContent = 'Picha hii haikufunguka. Jaribu picha nyingine (JPG au PNG).'; };
      img.src = url;
    });
    $('#f').addEventListener('submit', e => {
      e.preventDefault();
      const av = (app.querySelector('input[name="av"]:checked') || {}).value || 'simba';
      if (av === 'selfie' && !selfie) { $('#err').textContent = 'Piga au chagua selfie kwanza, au chagua avatar.'; return; }
      if (editing) { S.profile.avatar = av; S.profile.selfie = selfie; save(); go(scrProfile); return; }
      S.profile = Object.assign({}, S.draft, { avatar: av, selfie });
      S.draft = null; save(); go(scrHome);
    });
  }

  /* ---------- home ---------- */
  function scrHome() {
    const p = S.profile, st = liveStreak();
    const playedToday = S.lastPlay === ymd(new Date());
    const pool = METHALI.questions.filter(q => (q.min_age || 0) <= p.age);
    const day = Math.floor(Date.now() / 864e5);
    const dq = pool[day % pool.length];
    const nudge = st === 0 ? 'Cheza mchezo mmoja leo uanze mfululizo wa siku!' : playedToday ? `Siku ${st} mfululizo. Safi sana, rudi kesho!` : `Siku ${st} mfululizo. Cheza leo usiivunje!`;
    app.innerHTML = `${ART.band()}<div class="screen">
      <header class="homehead">
        <button class="avbtn" data-go="profile" aria-label="Fungua wasifu wako">${avatar(p, 'av sm')}</button>
        <div class="who"><span class="hi">Habari, ${esc(p.name)}</span><span><span class="lvl">${levelName(p.level)}</span></span></div>
        <div class="minis"><span class="chip flame ${st > 0 ? 'on' : ''}" title="Siku mfululizo">${I.flame}${st}</span><span class="chip star" title="Pointi">${I.star}${fmt(S.points)}</span></div>
      </header>
      <h1 class="wordmark">Chemsha <span>Bongo</span></h1>
      <p class="nudge">${I.flame}${nudge}</p>
      <section class="daily" aria-label="Methali ya leo">
        <span class="eyebrow">Methali ya leo</span>
        <q>${esc(dq.text)}</q>
        <small>${esc(dq.translation_en)}</small>
      </section>
      <h2 class="h2">Michezo</h2>
      <div class="modes">
        ${Object.keys(MODES).map((id, i) => { const m = MODES[id]; return `<article class="mode ${m.cls}" style="--i:${i}">
          <h3>${m.name}</h3><p>${m.en}</p>
          <div class="acts"><button class="btn small" data-play="${id}">Cheza</button><button class="link" data-how="${id}">Jinsi ya kucheza</button>${S.best[id] ? `<span class="best">Rekodi ${fmt(S.best[id])}</span>` : ''}</div>
          <div class="art" aria-hidden="true">${m.art()}</div></article>`; }).join('')}
      </div>
      <div class="soon"><span class="eyebrow">Inakuja</span><span>Tafsiri Haraka</span><span>Bongo Flava</span><span>Jaza Pengo</span></div>
    </div>${nav('home')}`;
    $$('[data-play]').forEach(b => b.addEventListener('click', () => { const id = b.dataset.play; if (!S.played[id]) go(scrHowTo, id); else MODES[id].start(false); }));
    $$('[data-how]').forEach(b => b.addEventListener('click', () => go(scrHowTo, b.dataset.how)));
  }

  function scrHowTo(id) {
    const m = MODES[id];
    app.innerHTML = `${ART.band()}<div class="screen">
      <div class="topbar"><button class="iconbtn" data-go="home" aria-label="Rudi nyumbani">${I.back}</button><span class="eyebrow">Jinsi ya kucheza</span><span style="width:44px"></span></div>
      <div class="howart ${m.cls} ${m.wide ? 'wide' : ''}" aria-hidden="true">${id === 'geo' ? ART.mountains() : m.art()}</div>
      <h1 class="h1">${m.name}</h1>
      <ol class="steps">${m.steps.map((s, i) => `<li style="--i:${i}"><span>${s}</span></li>`).join('')}</ol>
      <p class="en-sum">${m.enSum}</p>
      <div class="btns"><button class="btn ghost" id="practice">Mazoezi</button><button class="btn" id="play">Cheza sasa</button></div>
      <p class="fine">Mazoezi ni raundi fupi bila saa wala pointi.</p>
    </div>`;
    $('#practice').addEventListener('click', () => m.start(true));
    $('#play').addEventListener('click', () => { S.played[id] = true; save(); m.start(false); });
  }

  /* ---------- quiz engine (methali + geo) ---------- */
  function startQuiz(kind, practice) {
    let items;
    if (kind === 'methali') {
      items = pick(METHALI.questions, q => q.level, q => q.min_age, practice ? 2 : 5, practice).map(q => ({
        prompt: q.prompt, answer: q.blank, options: q.options, eyebrow: 'Malizia methali',
        after: `<b class="big">${esc(q.text)}</b><span>${esc(q.meaning_sw)}</span><span class="muted">${esc(q.translation_en)} ${esc(q.meaning_en)}</span>`
      }));
    } else {
      const flat = [];
      GEO.places.forEach(pl => pl.questions.forEach(q => flat.push({ prompt: q.q, answer: q.options[0], options: q.options, eyebrow: `Unaijua ${pl.name}?`, level: q.level, en: q.en })));
      items = pick(flat, q => q.level, () => 0, practice ? 2 : 5, practice).map(q => Object.assign(q, {
        after: `<b class="big">Jibu: ${esc(q.answer)}</b><span class="muted">${esc(q.en)}</span>`
      }));
    }
    go(renderQ, { kind, mode: kind, practice, items, i: 0, score: 0, streak: 0, best: 0, correct: 0, results: [] });
  }

  function dotsHTML(G) {
    return `<div class="dots" aria-hidden="true">${G.items.map((_, k) => `<span class="${k < G.results.length ? (G.results[k] ? 'ok' : 'no') : k === G.i ? 'now' : ''}"></span>`).join('')}</div>`;
  }
  function topbar(G, label) {
    return `<div class="topbar"><button class="iconbtn" data-go="home" aria-label="Toka kwenye mchezo">${I.x}</button><span class="count">${label}</span><span class="chip flame ${G.streak > 1 ? 'on' : ''}" id="stk" title="Majibu sahihi mfululizo">${I.flame}${G.streak}</span></div>`;
  }
  function popStreak(G) {
    const el = $('#stk'); if (!el) return;
    el.innerHTML = `${I.flame}${G.streak}`; el.classList.toggle('on', G.streak > 1);
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = 'bump .5s';
  }
  function floater(host, text) {
    if (!host) return; const f = document.createElement('span'); f.className = 'floater'; f.textContent = text; host.appendChild(f);
    setTimeout(() => f.remove(), 1200);
  }

  function renderQ(G) {
    const q = G.items[G.i];
    const opts = shuffle(q.options);
    const T = 20000;
    const promptHTML = G.kind === 'methali' ? esc(q.prompt).replace('___', '<span class="blank" id="blank">&nbsp;</span>') : esc(q.prompt);
    app.innerHTML = `${ART.band()}<div class="screen">
      ${topbar(G, `${G.i + 1} / ${G.items.length}`)}
      ${dotsHTML(G)}
      ${G.practice ? '<span class="tag">Mazoezi · hakuna saa wala pointi</span>' : '<div class="timer" id="timer" aria-hidden="true"><i id="tbar"></i></div>'}
      ${G.kind === 'geo' ? `<div class="scene">${ART.mountains()}<span class="scene-label">${esc(q.eyebrow)}</span></div>` : ''}
      <div class="qcard" id="qcard"><span class="eyebrow">${G.kind === 'methali' ? 'Malizia methali' : 'Jiografia'}</span><p class="qtext">${promptHTML}</p></div>
      <div class="opts" id="opts">${opts.map((o, k) => `<button class="opt" style="--i:${k}" data-o="${esc(o)}"><span>${esc(o)}</span></button>`).join('')}</div>
      <div id="qfoot" class="stack"><button class="link" id="hint">Ondoa majibu mawili (−20)</button></div>
    </div>`;
    let stopT = null, startAt = performance.now(), hintUsed = false, answered = false;
    if (!G.practice) {
      const bar = $('#tbar'), tm = $('#timer');
      stopT = countdown(T, left => { bar.style.width = (left / T * 100) + '%'; tm.classList.toggle('low', left < 5000); }, () => answer(null));
    }
    $$('.opt').forEach(b => b.addEventListener('click', () => answer(b.dataset.o)));
    $('#hint').addEventListener('click', () => {
      if (hintUsed || answered) return; hintUsed = true;
      shuffle($$('.opt').filter(b => b.dataset.o !== q.answer)).slice(0, 2).forEach(b => { b.disabled = true; b.classList.add('gone'); });
      $('#hint').remove();
    });
    function answer(choice) {
      if (answered) return; answered = true; if (stopT) stopT();
      const ok = choice === q.answer;
      $$('.opt').forEach(b => {
        b.disabled = true;
        if (b.dataset.o === q.answer) { b.classList.add('correct'); b.insertAdjacentHTML('beforeend', I.check); }
        else if (b.dataset.o === choice) { b.classList.add('wrong'); b.insertAdjacentHTML('beforeend', I.x); }
      });
      if (G.kind === 'methali') { const bl = $('#blank'); bl.textContent = q.answer; bl.classList.add('fill'); }
      let pts = 0;
      if (ok) {
        G.streak++; G.best = Math.max(G.best, G.streak); G.correct++;
        const elapsed = performance.now() - startAt;
        pts = 100 + Math.min(100, (G.streak - 1) * 20) + (G.practice ? 0 : Math.round(50 * Math.max(0, T - elapsed) / T)) - (hintUsed ? 20 : 0);
        if (G.practice) pts = 0;
        G.score += pts;
        if (pts) floater($('#qcard'), `+${pts}`);
      } else G.streak = 0;
      popStreak(G);
      G.results.push(ok);
      const last = G.i === G.items.length - 1;
      const head = ok ? (G.streak > 2 ? `Moto! Majibu ${G.streak} mfululizo` : 'Sahihi!') : choice === null ? 'Muda umekwisha!' : 'Hapana, si hilo.';
      $('#qfoot').innerHTML = `<div class="feedback ${ok ? '' : 'bad'}"><b>${head}</b>${q.after}</div><button class="btn block" id="next">${last ? 'Ona matokeo' : 'Endelea'}</button>`;
      $('#next').focus({ preventScroll: true });
      $('#next').addEventListener('click', () => {
        if (last) go(scrResults, { mode: G.mode, practice: G.practice, score: G.score, correct: G.correct, total: G.items.length, best: G.best, win: G.correct >= Math.ceil(G.items.length * .6) });
        else { G.i++; go(renderQ, G); }
      });
    }
  }

  /* ---------- mazao (hangman) ---------- */
  const LETTERS = 'ABCDEFGHIJKLMNOPRSTUVWYZ'.split('');
  function startMazao(practice) {
    const items = practice ? MAZAO.crops.filter(c => c.id === 'ndizi') : pick(MAZAO.crops, c => c.level, () => 0, 3, false);
    go(renderCrop, { kind: 'mazao', mode: 'mazao', practice, items, i: 0, score: 0, correct: 0, streak: 0, best: 0, results: [] });
  }
  function renderCrop(G) {
    const c = G.items[G.i], word = c.word, need = Array.from(new Set(word.split('')));
    const R = { got: new Set(), miss: new Set(), max: 6, hints: 0, done: false };
    app.innerHTML = `${ART.band()}<div class="screen">
      ${topbar(G, G.practice ? 'Mazoezi' : `Zao ${G.i + 1} / ${G.items.length}`)}
      ${dotsHTML(G)}
      <div class="crop" id="crop">${ART.crop(c.id)}<div class="drops" id="drops" aria-label="Matone ya maji yaliyobaki">${Array.from({ length: R.max }, () => I.drop).join('')}</div></div>
      <div class="slots" id="slots" aria-live="polite">${word.split('').map(() => '<span class="slot"></span>').join('')}</div>
      <div class="hints">
        <button class="hint" id="h-wapi">Linalimwa wapi? <span>Dokezo · −20</span></button>
        <button class="hint" id="h-nini">Linajulikana kwa nini? <span>Dokezo · −20</span></button>
      </div>
      <div class="kbd" id="kbd">${LETTERS.map(l => `<button class="key" data-k="${l}" aria-label="Herufi ${l}">${l}</button>`).join('')}</div>
      <div id="foot" class="stack"></div>
    </div>`;
    const svg = $('#crop svg');
    function paint() {
      const slots = $$('.slot');
      word.split('').forEach((ch, k) => { if (R.got.has(ch) && !slots[k].textContent) { slots[k].textContent = ch; slots[k].classList.add('show'); } });
      const frac = need.filter(ch => R.got.has(ch)).length / need.length;
      const startBlur = G.practice ? 0 : ({ chipukizi: 0, mjanja: 3, dingi: 6 }[S.profile.level] || 0);
      svg.style.filter = R.done || !startBlur ? 'none' : `blur(${(startBlur * (1 - frac)).toFixed(1)}px)`;
      $$('#drops svg').forEach((d, k) => d.classList.toggle('gone', k >= R.max - R.miss.size));
    }
    function openHint(id, text) {
      const b = $(id); if (b.classList.contains('open')) return;
      b.classList.add('open'); b.querySelector('span').textContent = text; R.hints++;
    }
    $('#h-wapi').addEventListener('click', () => { if (!R.done) openHint('#h-wapi', c.wapi); });
    $('#h-nini').addEventListener('click', () => { if (!R.done) openHint('#h-nini', c.nini); });
    function guess(l) {
      if (R.done || R.got.has(l) || R.miss.has(l)) return;
      const key = app.querySelector(`.key[data-k="${l}"]`);
      if (word.includes(l)) { R.got.add(l); key.classList.add('hit'); } else { R.miss.add(l); key.classList.add('miss'); }
      key.disabled = true; paint();
      const won = need.every(ch => R.got.has(ch)), lost = R.miss.size >= R.max;
      if (won || lost) finish(won);
    }
    function finish(won) {
      R.done = true; $$('.key').forEach(k => { k.disabled = true; });
      const slots = $$('.slot');
      word.split('').forEach((ch, k) => { if (!slots[k].textContent) { slots[k].textContent = ch; slots[k].classList.add('show', 'missed'); } });
      svg.style.filter = 'none';
      $('#crop').classList.add(won ? 'win' : 'wilt');
      let pts = 0;
      if (won) {
        G.streak++; G.best = Math.max(G.best, G.streak); G.correct++;
        pts = G.practice ? 0 : Math.max(20, 100 + 15 * (R.max - R.miss.size) + Math.min(100, (G.streak - 1) * 20) - 20 * R.hints);
        G.score += pts; if (pts) floater($('#crop'), `+${pts}`);
      } else G.streak = 0;
      popStreak(G); G.results.push(won);
      const last = G.i === G.items.length - 1;
      $('#foot').innerHTML = `<div class="feedback ${won ? '' : 'bad'}"><b class="big">${won ? `Safi! Ni ${c.word.toLowerCase()}.` : `Mmea umekauka! Jibu: ${c.word.toLowerCase()}.`}</b><span><b>Wapi:</b> ${esc(c.wapi)}</span><span><b>Kwa nini:</b> ${esc(c.nini)}</span><span class="muted">${esc(c.en)}: ${esc(c.en_fact)}</span></div><button class="btn block" id="next">${last ? 'Ona matokeo' : 'Zao linalofuata'}</button>`;
      $('#next').addEventListener('click', () => {
        if (last) go(scrResults, { mode: 'mazao', practice: G.practice, score: G.score, correct: G.correct, total: G.items.length, best: G.best, win: G.correct >= Math.ceil(G.items.length * .6) });
        else { G.i++; go(renderCrop, G); }
      });
    }
    $$('.key').forEach(k => k.addEventListener('click', () => guess(k.dataset.k)));
    const onKey = e => { const l = (e.key || '').toUpperCase(); if (l.length === 1 && LETTERS.includes(l)) guess(l); };
    document.addEventListener('keydown', onKey); addCleanup(() => document.removeEventListener('keydown', onKey));
    paint();
  }

  /* ---------- heads up ---------- */
  function scrHeadsPick(practice) {
    app.innerHTML = `${ART.band()}<form class="screen" id="f">
      <div class="topbar"><button type="button" class="iconbtn" data-go="home" aria-label="Rudi nyumbani">${I.back}</button><span class="eyebrow">Heads Up!${practice ? ' · Mazoezi' : ''}</span><span style="width:44px"></span></div>
      <h1 class="h1">Chagua kundi</h1>
      <div class="choices" role="radiogroup" aria-label="Kundi">
        ${HEADSUP.decks.map((d, i) => `<label class="choice"><input type="radio" name="deck" value="${d.id}" ${i === 0 ? 'checked' : ''}><span class="ctitle">${d.name}</span><span class="cen">${d.en} · maneno ${d.words.length}</span></label>`).join('')}
      </div>
      <button class="btn block" type="submit">Endelea</button>
    </form>`;
    $('#f').addEventListener('submit', e => { e.preventDefault(); const id = app.querySelector('input[name="deck"]:checked').value; go(scrHeadsReady, HEADSUP.decks.find(d => d.id === id), practice); });
  }
  function scrHeadsReady(deck, practice) {
    app.innerHTML = `${ART.band()}<div class="screen">
      <div class="topbar"><button class="iconbtn" data-go="home" aria-label="Rudi nyumbani">${I.x}</button><span class="eyebrow">${esc(deck.name)}</span><span style="width:44px"></span></div>
      <div class="hu"><span class="cat">Jitayarishe</span><span class="word">Simu kichwani!</span><span>Skrini iwaelekee wenzako. Wao wanaeleza, wewe unakisia.</span></div>
      <div id="cd" class="stack"><button class="btn block" id="go">Tayari, anza</button></div>
    </div>`;
    $('#go').addEventListener('click', () => {
      let n = 3; const cd = $('#cd');
      const tick = () => {
        if (n === 0) { go(scrHeadsPlay, deck, practice); return; }
        cd.innerHTML = `<div class="bigcount" aria-live="assertive">${n}</div>`; n--;
        const t = setTimeout(tick, 800); addCleanup(() => clearTimeout(t));
      };
      tick();
    });
  }
  function scrHeadsPlay(deck, practice) {
    const words = shuffle(deck.words), T = practice ? 30000 : 60000, log = [];
    let i = 0, over = false;
    app.innerHTML = `${ART.band()}<div class="screen">
      <div class="topbar"><button class="iconbtn" data-go="home" aria-label="Toka kwenye mchezo">${I.x}</button><span class="count" id="secs">${T / 1000}</span><span class="chip star" id="got">${I.check}0</span></div>
      <div class="timer" id="timer" aria-hidden="true"><i id="tbar"></i></div>
      <div class="hu flip" id="card"><span class="cat">${esc(deck.name)}</span><span class="word" id="word" aria-live="polite">${esc(words[0])}</span></div>
      <div class="btns"><button class="btn sun" id="pass">${I.skip} Pita</button><button class="btn leaf" id="ok">${I.check} Sahihi</button></div>
      <p class="fine">Kwenye app kamili utainamisha simu. Kwa beta, bonyeza vitufe.</p>
    </div>`;
    const card = $('#card'), bar = $('#tbar'), tm = $('#timer');
    countdown(T, left => { bar.style.width = (left / T * 100) + '%'; tm.classList.toggle('low', left < 10000); $('#secs').textContent = Math.ceil(left / 1000); }, end);
    function next(ok) {
      if (over) return;
      log.push({ w: words[i % words.length], ok });
      $('#got').innerHTML = `${I.check}${log.filter(x => x.ok).length}`;
      card.classList.remove('flip', 'ok', 'pass'); void card.offsetWidth; card.classList.add(ok ? 'ok' : 'pass');
      i++;
      if (i >= words.length) { end(); return; }
      setTimeout(() => { if (over) return; card.classList.remove('ok', 'pass'); $('#word').textContent = words[i]; void card.offsetWidth; card.classList.add('flip'); }, 260);
    }
    $('#ok').addEventListener('click', () => next(true));
    $('#pass').addEventListener('click', () => next(false));
    function end() {
      if (over) return; over = true;
      const correct = log.filter(x => x.ok).length;
      const extra = `<div class="stack" style="width:100%"><span class="eyebrow">Maneno ya raundi</span><ul class="wordlist">${log.map(x => `<li class="${x.ok ? '' : 'p'}">${x.ok ? I.check : I.skip}${esc(x.w)}</li>`).join('') || '<li class="p">Hakuna neno lililochezwa</li>'}</ul></div>`;
      go(scrResults, { mode: 'heads', practice, score: practice ? 0 : correct * 60, correct, total: log.length, best: correct, win: correct >= (practice ? 2 : 5), extra, again: () => go(scrHeadsReady, deck, practice) });
    }
  }

  /* ---------- chora tuone ---------- */
  function scrChoraSetup(practice) {
    app.innerHTML = `${ART.band()}<form class="screen" id="f">
      <div class="topbar"><button type="button" class="iconbtn" data-go="home" aria-label="Rudi nyumbani">${I.back}</button><span class="eyebrow">Chora Tuone${practice ? ' · Mazoezi' : ''}</span><span style="width:44px"></span></div>
      <h1 class="h1">Timu zenu</h1>
      <div class="field"><label for="t1">Timu ya kwanza</label><input id="t1" maxlength="16" value="Simba"></div>
      <div class="field"><label for="t2">Timu ya pili</label><input id="t2" maxlength="16" value="Chui"></div>
      ${practice ? '<p class="note">Mazoezi: zamu moja tu ya kuchora, bila pointi.</p>' : `<div class="field"><label for="turns">Zamu kwa kila timu</label><input id="turns" class="age" type="number" min="1" max="5" value="2"></div>`}
      <button class="btn block" type="submit">Anza</button>
    </form>`;
    $('#f').addEventListener('submit', e => {
      e.preventDefault();
      const t1 = $('#t1').value.trim() || 'Simba', t2 = $('#t2').value.trim() || 'Chui';
      const per = practice ? 1 : Math.min(5, Math.max(1, parseInt(($('#turns') || {}).value, 10) || 2));
      const words = pick(CHORA.words, w => w.level, () => 0, Math.min(CHORA.words.length, practice ? 1 : per * 2 + 4), practice);
      go(scrChoraHandoff, { practice, teams: [{ name: t1, score: 0 }, { name: t2, score: 0 }], turn: 0, total: practice ? 1 : per * 2, words, w: 0 });
    });
  }
  function teamsHTML(G) {
    return `<div class="teams">${G.teams.map((t, k) => `<div class="team ${G.turn % 2 === k ? 'now' : ''}"><span>${esc(t.name)}</span><b>${t.score}</b></div>`).join('')}</div>`;
  }
  function scrChoraHandoff(G) {
    const team = G.teams[G.turn % 2], word = G.words[G.w % G.words.length];
    app.innerHTML = `${ART.band()}<div class="screen">
      <div class="topbar"><button class="iconbtn" data-go="home" aria-label="Toka kwenye mchezo">${I.x}</button><span class="count">Zamu ${G.turn + 1} / ${G.total}</span><span style="width:44px"></span></div>
      ${teamsHTML(G)}
      <h1 class="h1">Zamu ya ${esc(team.name)}</h1>
      <p class="lead">Mpe simu mchoraji. Wengine wasitazame!</p>
      <div class="wordbox"><span class="eyebrow" style="color:var(--sun)">Neno lako</span><span class="w hide" id="w">${esc(word.word)}</span><span class="muted" style="color:#CFC6B4" id="wen">Shikilia kitufe kuona neno</span></div>
      <button class="btn ghost block holdbtn" id="hold">${I.eye} Shikilia kuona neno</button>
      <button class="btn block" id="start" disabled>Anza kuchora</button>
    </div>`;
    const w = $('#w'), hold = $('#hold'), start = $('#start'), wen = $('#wen');
    const show = e => { e.preventDefault(); w.classList.remove('hide'); wen.textContent = `${word.en} · ${levelName(word.level)}`; start.disabled = false; };
    const hide = () => { w.classList.add('hide'); wen.textContent = 'Shikilia kitufe kuona neno tena'; };
    hold.addEventListener('pointerdown', show); hold.addEventListener('pointerup', hide); hold.addEventListener('pointerleave', hide); hold.addEventListener('pointercancel', hide);
    hold.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') show(e); });
    hold.addEventListener('keyup', hide);
    start.addEventListener('click', () => go(scrChoraDraw, G));
  }
  function scrChoraDraw(G) {
    const team = G.teams[G.turn % 2], word = G.words[G.w % G.words.length], T = 60000;
    const colors = [['#24211C', 'Nyeusi'], ['#C2362B', 'Nyekundu'], ['#2E7D4F', 'Kijani'], ['#3F7F91', 'Bluu'], ['#F2C230', 'Njano']];
    app.innerHTML = `${ART.band()}<div class="screen">
      <div class="topbar"><button class="iconbtn" data-go="home" aria-label="Toka kwenye mchezo">${I.x}</button><span class="count" id="secs">60</span><button class="iconbtn holdbtn" id="peek" aria-label="Shikilia kuona neno">${I.eye}</button></div>
      <div class="timer" id="timer" aria-hidden="true"><i id="tbar"></i></div>
      <p class="lead" id="peekline" style="text-align:center"><b>${esc(team.name)}</b> wanakisia. Shikilia jicho kuona neno.</p>
      <div class="pad"><canvas id="pad" aria-label="Ubao wa kuchora"></canvas></div>
      <div class="tools"><div class="swatches">${colors.map((c, k) => `<button class="swatch" style="background:${c[0]}" data-c="${c[0]}" aria-label="Rangi ${c[1]}" aria-pressed="${k === 0}"></button>`).join('')}</div>
      <div class="swatches"><button class="iconbtn" id="undo" aria-label="Rudisha mstari wa mwisho">${I.undo}</button><button class="iconbtn" id="clear" aria-label="Futa mchoro wote">${I.trash}</button></div></div>
      <div class="btns"><button class="btn sun" id="pass">Pita</button><button class="btn leaf" id="got">Wamepata!</button></div>
    </div>`;
    const canvas = $('#pad'), ctx = canvas.getContext('2d');
    let strokes = [], cur = null, color = colors[0][0];
    function size() {
      const r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); redraw();
    }
    function redraw() {
      const r = canvas.getBoundingClientRect(); ctx.clearRect(0, 0, r.width, r.height);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      strokes.forEach(s => {
        ctx.strokeStyle = s.c; ctx.lineWidth = 6; ctx.beginPath();
        s.p.forEach((pt, k) => k ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]));
        if (s.p.length === 1) ctx.lineTo(s.p[0][0] + .1, s.p[0][1]);
        ctx.stroke();
      });
    }
    const pos = e => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    canvas.addEventListener('pointerdown', e => { e.preventDefault(); try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } cur = { c: color, p: [pos(e)] }; strokes.push(cur); redraw(); });
    canvas.addEventListener('pointermove', e => { if (!cur) return; cur.p.push(pos(e)); const p = cur.p, a = p[p.length - 2], b = p[p.length - 1]; ctx.strokeStyle = cur.c; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => canvas.addEventListener(t, () => { cur = null; }));
    $$('.swatch').forEach(b => b.addEventListener('click', () => { color = b.dataset.c; $$('.swatch').forEach(x => x.setAttribute('aria-pressed', String(x === b))); }));
    $('#undo').addEventListener('click', () => { strokes.pop(); redraw(); });
    $('#clear').addEventListener('click', () => { strokes = []; redraw(); });
    const peek = $('#peek'), line = $('#peekline'), lineHTML = line.innerHTML;
    const showW = e => { e.preventDefault(); line.innerHTML = `Neno: <b>${esc(word.word)}</b>`; };
    const hideW = () => { line.innerHTML = lineHTML; };
    peek.addEventListener('pointerdown', showW); ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => peek.addEventListener(t, hideW));
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(size); ro.observe(canvas); addCleanup(() => ro.disconnect()); } else size();
    const bar = $('#tbar'), tm = $('#timer');
    let ended = false;
    const stop = countdown(T, left => { bar.style.width = (left / T * 100) + '%'; tm.classList.toggle('low', left < 10000); $('#secs').textContent = Math.ceil(left / 1000); }, () => endTurn(false, true));
    $('#got').addEventListener('click', () => endTurn(true));
    $('#pass').addEventListener('click', () => endTurn(false));
    function endTurn(ok, timeout) {
      if (ended) return; ended = true; stop();
      if (ok) team.score++;
      G.log = G.log || []; G.log.push({ team: team.name, w: word.word, ok });
      G.turn++; G.w++;
      const note = ok ? `${team.name} wamepata: ${word.word}!` : timeout ? `Muda umekwisha. Neno lilikuwa ${word.word}.` : `Mmepita. Neno lilikuwa ${word.word}.`;
      if (G.turn >= G.total) {
        const [a, b] = G.teams, tie = a.score === b.score, winner = a.score > b.score ? a : b;
        const extra = `<div class="stack" style="width:100%">${teamsHTML({ teams: G.teams, turn: tie ? -1 : G.teams.indexOf(winner) })}<ul class="wordlist">${G.log.map(x => `<li class="${x.ok ? '' : 'p'}">${x.ok ? I.check : I.skip}${esc(x.w)} · ${esc(x.team)}</li>`).join('')}</ul></div>`;
        const correct = G.log.filter(x => x.ok).length;
        go(scrResults, { mode: 'chora', practice: G.practice, score: G.practice ? 0 : correct * 50, correct, total: G.log.length, best: correct, win: correct > 0, title: G.practice ? null : tie ? 'Sare!' : `${winner.name} wameshinda!`, extra, again: () => go(scrChoraSetup, G.practice) });
      } else {
        app.querySelector('.screen').insertAdjacentHTML('beforeend', `<div class="feedback ${ok ? '' : 'bad'}"><b class="big">${esc(note)}</b></div>`);
        const t = setTimeout(() => go(scrChoraHandoff, G), 1300); addCleanup(() => clearTimeout(t));
      }
    }
  }

  /* ---------- results ---------- */
  function scrResults(r) {
    const p = S.profile; let dayUp = false;
    if (!r.practice) {
      S.points += r.score; S.games++; S.best[r.mode] = Math.max(S.best[r.mode] || 0, r.score);
      dayUp = bumpDaily();
    }
    S.played[r.mode] = true; save();
    const title = r.title || (r.practice ? (r.win ? 'Umeiweza!' : 'Mazoezi yamekwisha') : r.win ? `Hongera, ${p.name}!` : `Pole, ${p.name}!`);
    const sub = r.practice ? 'Sasa uko tayari kucheza kwa pointi.' : r.win ? 'Umeshinda raundi hii. Sherehe!' : 'Kila mwanzo ni mzito. Jaribu tena!';
    app.innerHTML = `${ART.band()}<div class="screen">
      <div class="celebrate ${r.win ? '' : 'calm'}">
        ${avatar(p, 'av big')}
        <h1 class="h1">${esc(title)}</h1>
        <p class="lead">${sub}</p>
        <div class="stats">
          <div class="stat" style="--i:0"><b>+${fmt(r.score)}</b><span>Pointi</span></div>
          <div class="stat" style="--i:1"><b>${r.correct}/${r.total}</b><span>Sahihi</span></div>
          <div class="stat" style="--i:2"><b>${r.best}</b><span>${r.mode === 'heads' || r.mode === 'chora' ? 'Maneno' : 'Mfululizo bora'}</span></div>
        </div>
        ${dayUp ? `<div class="dayup">${I.flame}<span>Siku ${S.streakDays} mfululizo! ${S.streakDays > 1 ? 'Endelea hivyo.' : 'Rudi kesho uiongeze.'}</span></div>` : ''}
        ${r.extra || ''}
      </div>
      <div class="btns"><button class="btn ghost" data-go="home">Nyumbani</button><button class="btn" id="again">${r.practice ? 'Cheza kwa pointi' : 'Cheza tena'}</button></div>
      ${!r.practice ? '<button class="link" data-go="league" style="align-self:center">Ona nafasi yako kwenye ligi</button>' : ''}
    </div>`;
    $('#again').addEventListener('click', () => {
      if (r.practice) { S.played[r.mode] = true; save(); MODES[r.mode].start(false); }
      else if (r.again) r.again(); else MODES[r.mode].start(false);
    });
    if (r.win) confetti();
  }

  /* ---------- league ---------- */
  const SAMPLE = [['Zawadi_K', 9315], ['Baraka_M', 8940], ['Nuru.O', 8610], ['Juma_Dar', 7420], ['Wanjiru254', 6900], ['Salim_Mombasa', 6120], ['Rehema.T', 5480], ['Kibwana_TZ', 4975], ['Neema_Arusha', 4410], ['Omari.J', 3980], ['Halima_Znz', 3620], ['Elia_Mbeya', 3205], ['Furaha.K', 2870], ['Daudi_Iringa', 2595], ['Asha.M', 2390], ['Musa_Mwanza', 2120], ['Imani_D', 1800], ['Tumaini.S', 1450], ['Pendo.L', 980]];
  function scrLeague() {
    const p = S.profile;
    const rows = SAMPLE.map(([n, pt], k) => ({ n, pt, av: AVATAR_IDS[k % 4] })).concat([{ n: p.name, pt: S.points, me: true }]).sort((a, b) => b.pt - a.pt);
    const now = new Date(), end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const days = Math.ceil((end - now) / 864e5);
    const month = ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'][now.getMonth()];
    app.innerHTML = `${ART.band()}<div class="screen">
      <div class="stack"><span class="eyebrow">Msimu wa beta</span><h1 class="h1">Ligi ya ${month}</h1>
      <p class="lead">Mchujo unaanza tarehe 1. Siku ${days} zimebaki. Wachezaji 16 wa juu wanaingia mchujo.</p></div>
      <div class="table" role="list">
        ${rows.map((r, k) => `${k === 16 ? '<div class="cutline">Mstari wa mchujo</div>' : ''}<div class="lrow ${r.me ? 'me' : ''} ${k < 3 ? 'top' : ''}" role="listitem"><span class="n">${k + 1}</span>${r.me ? avatar(p, 'av xs') : `<span class="av xs">${ART.avatars[r.av].svg}</span>`}<span class="nm">${r.me ? `Wewe · ${esc(r.n)}` : esc(r.n)}</span><span class="pt">${fmt(r.pt)}</span></div>`).join('')}
      </div>
      <p class="fine">Wachezaji wengine ni wa mfano kwa toleo la beta.</p>
    </div>${nav('league')}`;
  }

  /* ---------- profile ---------- */
  function scrProfile() {
    const p = S.profile;
    app.innerHTML = `${ART.band()}<div class="screen">
      <div class="celebrate calm" style="padding-top:0">${avatar(p, 'av big')}<h1 class="h1">${esc(p.name)}</h1><span class="lvl">${levelName(p.level)}</span></div>
      <button class="btn ghost block" id="chav">${I.camera} Badilisha avatar au selfie</button>
      <div class="stats">
        <div class="stat"><b>${fmt(S.points)}</b><span>Pointi</span></div>
        <div class="stat"><b>${liveStreak()}</b><span>Siku mfululizo</span></div>
        <div class="stat"><b>${S.bestDays || 0}</b><span>Rekodi ya siku</span></div>
      </div>
      <dl class="ptable"><dt>Barua pepe</dt><dd>${esc(p.email)}</dd><dt>Umri</dt><dd>Miaka ${esc(p.age)}${p.age < 13 ? ' · ruhusa ya mzazi' : ''}</dd><dt>Michezo</dt><dd>${S.games}</dd></dl>
      <h2 class="h2">Kiwango</h2>
      <div class="choices" role="radiogroup" aria-label="Kiwango">
        ${LEVELS.map(l => `<label class="choice"><input type="radio" name="lvl" value="${l.id}" ${l.id === p.level ? 'checked' : ''}><span class="ctitle">${l.name}</span><span class="cen">${l.en}</span></label>`).join('')}
      </div>
      <div id="danger" class="stack"><button class="link" id="wipe">Futa data yangu na uanze upya</button></div>
    </div>${nav('profile')}`;
    $('#chav').addEventListener('click', () => go(scrAvatar, true));
    $$('input[name="lvl"]').forEach(r => r.addEventListener('change', () => { S.profile.level = r.value; save(); }));
    $('#wipe').addEventListener('click', () => {
      $('#danger').innerHTML = `<div class="confirm"><b>Futa kila kitu?</b><span>Pointi, mfululizo, selfie na wasifu wako vitafutwa kwenye kifaa hiki.</span><div class="btns"><button class="btn ghost small" id="no">Hapana</button><button class="btn small" id="yes">Ndiyo, futa</button></div></div>`;
      $('#no').addEventListener('click', () => go(scrProfile));
      $('#yes').addEventListener('click', () => { S = defaults(); save(); try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } go(scrKaribu); });
    });
  }

  /* ---------- confetti ---------- */
  function confetti() {
    if (reduced()) return;
    const c = document.getElementById('confetti'); if (!c) return;
    const ctx = c.getContext('2d'), dpr = window.devicePixelRatio || 1;
    const W = c.clientWidth, H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = ['#C2362B', '#F2C230', '#2E7D4F', '#3F7F91', '#FBE4DE'];
    const parts = Array.from({ length: 140 }, () => ({ x: W / 2 + (Math.random() - .5) * 80, y: H * .35, vx: (Math.random() - .5) * 11, vy: -Math.random() * 12 - 4, s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: cols[Math.floor(Math.random() * cols.length)] }));
    const t0 = performance.now(); let raf;
    const step = t => {
      ctx.clearRect(0, 0, W, H);
      parts.forEach(q => { q.vy += .32; q.vx *= .99; q.x += q.vx; q.y += q.vy; q.r += q.vr; ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.r); ctx.fillStyle = q.c; ctx.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); ctx.restore(); });
      if (t - t0 < 3200) raf = requestAnimationFrame(step); else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(step);
    addCleanup(() => { cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H); });
  }

  /* ---------- boot ---------- */
  if (S.profile) go(scrHome);
  else if (S.draft && S.draft.level) go(scrAvatar, false);
  else if (S.draft && S.draft.name) go(scrLevel);
  else go(scrKaribu);
})();
