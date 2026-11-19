/* Guitar Theory course: shared engine.
   Widgets (write them in a lesson's HTML, this file brings them to life):
     <div class="fretboard" data-frets="12" data-labels="none|naturals|all|C,E,G"
          data-marks="6:3:G,5:2" data-flats data-game="find" data-pool="naturals|all|C,D,E"
          data-strings="6,5" data-rounds="10"></div>
     <div class="chords" data-chords="C:x32010, G:320003, F:1-3-3-2-1-1"></div>
     <button class="play" data-notes="C4 D4 E4" data-gap="0.4">Hear it</button>
     <button class="play" data-strum="x32010">Strum C</button>
     <button class="play" data-progression="x32010 x32010 xx0232 320003" data-gap="1.1">Play</button>
     <script type="application/json" id="quiz">{ ... }</script>   (renders into <div id="quiz-root">)
*/
(function(){
  'use strict';
  const REPO = 'sattuttle83/songbook';
  const SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const TUNING = [64,59,55,50,45,40];           // string 1 (high e) to string 6 (low E), as MIDI numbers
  const STRING_NAMES = ['e','B','G','D','A','E'];
  const NATURALS = ['C','D','E','F','G','A','B'];
  const SVGNS = 'http://www.w3.org/2000/svg';

  const name = (midi, flats) => (flats ? FLAT : SHARP)[((midi % 12) + 12) % 12];
  function pcOf(n){
    const m = /^\s*([A-Ga-g])([#b]?)\s*$/.exec(n || ''); if(!m) return null;
    const base = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1].toUpperCase()];
    return (base + (m[2]==='#'?1:m[2]==='b'?11:0)) % 12;
  }
  function parseNote(s){
    const m = /^([A-Ga-g])([#b]?)(-?\d)$/.exec((s||'').trim()); if(!m) return null;
    return (parseInt(m[3],10)+1)*12 + pcOf(m[1]+m[2]);
  }
  function parseShape(s){ // "x32010" or "1-3-3-2-1-1" or "x,10,12,..." -> [fret or null] for strings 6..1
    s = (s||'').trim();
    const parts = /[-,\s]/.test(s) ? s.split(/[-,\s]+/) : s.split('');
    return parts.slice(0,6).map(p => /^[xX]$/.test(p) ? null : parseInt(p,10));
  }
  const el = (tag, attrs, parent) => {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  /* ---------- Sound: plucked-string synth (Karplus-Strong) ---------- */
  let ctx = null; const cache = {};
  function audio(){
    if(!ctx){ const AC = window.AudioContext || window.webkitAudioContext; if(!AC) return null; ctx = new AC(); }
    if(ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function pluckBuffer(midi){
    if(cache[midi]) return cache[midi];
    const c = audio(), sr = c.sampleRate, f = 440 * Math.pow(2, (midi-69)/12);
    const len = Math.floor(sr * 2.4), N = Math.max(2, Math.round(sr / f));
    const buf = c.createBuffer(1, len, sr), d = buf.getChannelData(0);
    const ring = new Float32Array(N); let lp = 0;
    for(let i=0;i<N;i++){ lp = lp*0.5 + (Math.random()*2-1)*0.5; ring[i] = lp; }
    const damp = 0.9965 - Math.max(0, (midi-64))*0.0004;
    let idx = 0;
    for(let i=0;i<len;i++){
      const a = ring[idx], b = ring[(idx+1)%N];
      ring[idx] = 0.5*(a+b)*damp; d[i] = a; idx = (idx+1)%N;
    }
    const fade = Math.floor(sr*0.08);
    for(let i=0;i<fade;i++) d[len-1-i] *= i/fade;
    return (cache[midi] = buf);
  }
  function pluck(midi, when=0, vol=0.45){
    const c = audio(); if(!c) return;
    const s = c.createBufferSource(), g = c.createGain();
    s.buffer = pluckBuffer(midi); g.gain.value = vol;
    s.connect(g).connect(c.destination);
    s.start(c.currentTime + 0.02 + when);
  }
  function strum(shape, when=0){
    const frets = parseShape(shape); let k = 0;
    frets.forEach((f, i) => { if(f == null || isNaN(f)) return; pluck(TUNING[5-i] + f, when + k*0.03, 0.32); k++; });
  }
  function playNotes(list, gap=0.45){
    list.forEach((n, i) => { const m = parseNote(n); if(m != null) pluck(m, i*gap); });
    return list.length * gap;
  }
  function playProgression(shapes, gap=1.0){
    shapes.forEach((s, i) => strum(s, i*gap));
    return shapes.length * gap;
  }
  window.Guitar = { pluck, strum, playNotes, playProgression, parseNote, name };

  /* ---------- Play buttons ---------- */
  function wirePlay(btn){
    btn.addEventListener('click', () => {
      const gap = parseFloat(btn.dataset.gap || '') || null; let dur = 1.5;
      if(btn.dataset.notes) dur = playNotes(btn.dataset.notes.trim().split(/\s+/), gap || 0.45);
      else if(btn.dataset.strum) strum(btn.dataset.strum);
      else if(btn.dataset.progression) dur = playProgression(btn.dataset.progression.trim().split(/\s+/), gap || 1.0);
      btn.classList.add('playing'); setTimeout(() => btn.classList.remove('playing'), dur*1000 + 600);
    });
  }

  /* ---------- Fretboard ---------- */
  function fretboard(box){
    const frets = Math.min(15, parseInt(box.dataset.frets || '12', 10));
    const flats = box.hasAttribute('data-flats');
    const labels = (box.dataset.labels || 'none').trim();
    const game = box.dataset.game || '';
    const limitStrings = box.dataset.strings ? box.dataset.strings.split(',').map(n => parseInt(n,10)) : [1,2,3,4,5,6];
    const marks = {};
    (box.dataset.marks || '').split(',').map(s => s.trim()).filter(Boolean).forEach(m => {
      const [s, f, lab] = m.split(':'); marks[s + ':' + f] = lab || '';
    });
    let labelPCs = null;
    if(labels === 'all') labelPCs = new Set([...Array(12).keys()]);
    else if(labels === 'naturals') labelPCs = new Set(NATURALS.map(pcOf));
    else if(labels !== 'none') labelPCs = new Set(labels.split(',').map(pcOf).filter(x => x != null));

    const W = 1000, top = 26, sp = 36, H = top + sp*5 + 46, nutX = 74;
    const xs = [nutX]; const ratio = 0.965;
    let w0 = (W - nutX - 18) * (1 - ratio) / (1 - Math.pow(ratio, frets));
    for(let f=1; f<=frets; f++){ xs.push(xs[f-1] + w0); w0 *= ratio; }
    const fx = f => f === 0 ? nutX - 30 : (xs[f-1] + xs[f]) / 2;
    const sy = s => top + (s-1)*sp;

    const svg = el('svg', {viewBox:`0 0 ${W} ${H}`, role:'img', 'aria-label':'Guitar fretboard'});
    el('rect', {x:nutX, y:top-12, width:xs[frets]-nutX, height:sp*5+24, rx:4, fill:css('--wood')}, svg);
    [3,5,7,9,15].filter(f => f <= frets).forEach(f => el('circle', {cx:fx(f), cy:top+sp*2.5, r:7, fill:css('--wood-dark')}, svg));
    if(frets >= 12){ el('circle',{cx:fx(12),cy:top+sp*1.5,r:7,fill:css('--wood-dark')},svg); el('circle',{cx:fx(12),cy:top+sp*3.5,r:7,fill:css('--wood-dark')},svg); }
    for(let f=1; f<=frets; f++){
      el('line', {x1:xs[f], x2:xs[f], y1:top-12, y2:top+sp*5+12, stroke:css('--fret'), 'stroke-width':3}, svg);
      const t = el('text', {x:fx(f), y:H-8, 'text-anchor':'middle', 'font-size':15, fill:css('--muted'), 'font-family':'JetBrains Mono, monospace'}, svg);
      t.textContent = f;
    }
    el('rect', {x:nutX-5, y:top-12, width:9, height:sp*5+24, fill:css('--ink'), rx:2}, svg);
    for(let s=1; s<=6; s++){
      el('line', {x1:nutX-44, x2:xs[frets], y1:sy(s), y2:sy(s), stroke:css('--string'), 'stroke-width':0.9 + s*0.45}, svg);
      const t = el('text', {x:12, y:sy(s)+6, 'font-size':17, fill:css('--muted'), 'font-family':'JetBrains Mono, monospace', 'font-weight':700}, svg);
      t.textContent = STRING_NAMES[s-1];
    }
    const t0 = el('text', {x:fx(0), y:H-8, 'text-anchor':'middle', 'font-size':13, fill:css('--muted'), 'font-family':'JetBrains Mono, monospace'}, svg);
    t0.textContent = 'open';

    const dots = {};
    function showDot(s, f, label, color, temp){
      const key = s+':'+f; let g = dots[key];
      if(!g){
        g = el('g', {class:'dot'}, svg);
        el('circle', {cx:fx(f), cy:sy(s), r:15}, g);
        el('text', {x:fx(f), y:sy(s)+5, 'text-anchor':'middle', 'font-size':label.length > 2 ? 11 : 14, fill:'#fff'}, g);
        dots[key] = g;
      }
      g.querySelector('circle').setAttribute('fill', color);
      g.querySelector('text').textContent = label;
      g.style.display = '';
      if(temp){ clearTimeout(g._t); g._t = setTimeout(() => { g.style.display = 'none'; restore(s,f); }, 1300); }
    }
    function baseLabel(s, f){
      const k = s+':'+f;
      if(k in marks) return {label: marks[k] || name(TUNING[s-1]+f, flats), color: css('--accent')};
      if(labelPCs && labelPCs.has((TUNING[s-1]+f) % 12)) return {label: name(TUNING[s-1]+f, flats), color: '#596175'};
      return null;
    }
    function restore(s, f){ const b = baseLabel(s,f); if(b) showDot(s,f,b.label,b.color,false); }
    if(!game) for(let s=1;s<=6;s++) for(let f=0;f<=frets;f++) restore(s,f);

    // tap targets (on top)
    const hits = el('g', {}, svg);
    for(let s=1;s<=6;s++) for(let f=0;f<=frets;f++){
      const x0 = f === 0 ? nutX-56 : xs[f-1], x1 = f === 0 ? nutX-4 : xs[f];
      const r = el('rect', {x:x0, y:sy(s)-sp/2, width:x1-x0, height:sp, fill:'transparent', style:'cursor:pointer'}, hits);
      r.addEventListener('pointerdown', e => { e.preventDefault(); tap(s, f); });
    }

    const cap = document.createElement('div'); cap.className = 'fb-cap';
    box.appendChild(svg); box.appendChild(cap);

    let target = null, round = 0, firstTry = 0, missedThis = false;
    const rounds = parseInt(box.dataset.rounds || '10', 10);
    const poolSpec = (box.dataset.pool || 'naturals').trim();
    const pool = poolSpec === 'all' ? SHARP.slice() : poolSpec === 'naturals' ? NATURALS.slice() : poolSpec.split(',').map(x => x.trim());

    function tap(s, f){
      const midi = TUNING[s-1] + f;
      pluck(midi);
      if(game === 'find' && target != null){
        if(!limitStrings.includes(s)){ const long = ['high e','B','G','D','A','low E'];
          flash(`Stay on the ${limitStrings.map(n => long[n-1]).join(' / ')} string${limitStrings.length>1?'s':''} for this one`, 'no'); return; }
        if(midi % 12 === pcOf(target)){
          showDot(s, f, name(midi, flats), css('--good'), true);
          if(!missedThis) firstTry++;
          flash('Yep! ' + name(midi, flats) + ' — string ' + s + ', fret ' + f, 'ok');
          setTimeout(nextTarget, 750);
        } else {
          missedThis = true;
          showDot(s, f, name(midi, flats), css('--bad'), true);
          flash('That one\'s ' + name(midi, flats) + '. Keep hunting.', 'no');
        }
      } else if(!baseLabel(s,f)){
        showDot(s, f, name(midi, flats), css('--accent'), true);
      }
    }
    function flash(msg, cls){ const fl = cap.querySelector('.fb-flash'); if(fl){ fl.textContent = msg; fl.className = 'fb-flash ' + (cls||''); } }
    function nextTarget(){
      if(round >= rounds){ endGame(); return; }
      round++; missedThis = false;
      let t; do { t = pool[Math.floor(Math.random()*pool.length)]; } while(pool.length > 1 && t === target);
      target = t;
      cap.innerHTML = `<span class="fb-game">Find: <b>${t}</b></span><span>${round} of ${rounds} · ${firstTry} first try</span><span class="fb-flash"></span>`;
    }
    function endGame(){
      target = null;
      cap.innerHTML = `<span class="fb-game">${firstTry} of ${rounds} on the first try${firstTry >= rounds*0.8 ? ' — nice pickin\'!' : ''}</span>`;
      const b = document.createElement('button'); b.className = 'ghost'; b.textContent = 'Go again';
      b.onclick = () => { round = 0; firstTry = 0; nextTarget(); }; cap.appendChild(b);
    }
    if(game === 'find'){
      cap.innerHTML = `<span class="fb-game">Find-the-note game</span>`;
      const b = document.createElement('button'); b.textContent = 'Start';
      b.onclick = () => { audio(); nextTarget(); }; cap.appendChild(b);
    } else {
      cap.innerHTML = `<span>Tap anywhere on the neck to hear that note and see its name.</span>`;
    }
  }

  /* ---------- Chord diagrams ---------- */
  function chordBox(spec){
    const i = spec.indexOf(':'); const nm = spec.slice(0, i).trim(), shape = spec.slice(i+1).trim();
    const frets = parseShape(shape);
    const played = frets.filter(f => f != null && f > 0);
    const maxF = played.length ? Math.max(...played) : 0, minF = played.length ? Math.min(...played) : 0;
    const base = maxF > 5 ? minF : 1;
    const W = 120, H = 150, l = 18, r = 102, t = 34, fh = 22, gap = (r-l)/5;
    const svg = el('svg', {viewBox:`0 0 ${W} ${H}`});
    if(base === 1) el('rect', {x:l, y:t-4, width:r-l, height:5, fill:css('--ink')}, svg);
    for(let k=0;k<=5;k++) el('line', {x1:l, x2:r, y1:t+k*fh, y2:t+k*fh, stroke:css('--fret'), 'stroke-width':1.5}, svg);
    for(let s=0;s<6;s++) el('line', {x1:l+s*gap, x2:l+s*gap, y1:t, y2:t+5*fh, stroke:css('--string'), 'stroke-width':1.3}, svg);
    if(base > 1){ const tx = el('text', {x:r+4, y:t+fh*0.7, 'font-size':11, fill:css('--muted')}, svg); tx.textContent = base + 'fr'; }
    frets.forEach((f, s) => {
      const x = l + s*gap;
      if(f == null || isNaN(f)){ const tx = el('text', {x, y:t-10, 'text-anchor':'middle', 'font-size':13, fill:css('--muted')}, svg); tx.textContent = '×'; }
      else if(f === 0){ el('circle', {cx:x, cy:t-14, r:4.5, fill:'none', stroke:css('--ink'), 'stroke-width':1.5}, svg); }
      else el('circle', {cx:x, cy:t + (f-base+0.5)*fh, r:8, fill:css('--accent')}, svg);
    });
    const div = document.createElement('div'); div.className = 'chord';
    div.innerHTML = `<div class="name">${nm}</div>`; div.appendChild(svg);
    div.insertAdjacentHTML('beforeend', '<div class="hint">tap to strum</div>');
    div.addEventListener('click', () => strum(shape));
    return div;
  }

  /* ---------- Quiz ---------- */
  function store(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch(e){ return fallback; } }
  function save(key, val){ try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  function quiz(data, root){
    const answers = [];
    root.className = 'quiz';
    root.innerHTML = `<div class="kicker">Check yourself</div><h2>${esc(data.title || 'Quiz')}</h2>
      <p class="lede">One try per question. Your score tells tomorrow's lesson what to go back over.</p>`;
    data.questions.forEach((q, qi) => {
      const box = document.createElement('div'); box.className = 'q';
      box.innerHTML = `<div class="qtext"><span class="qnum">${qi+1}.</span>${esc(q.q)}</div>`;
      if(q.notes || q.strum || q.progression){
        const b = document.createElement('button'); b.className = 'play ghost'; b.textContent = 'Listen';
        if(q.notes) b.dataset.notes = q.notes; if(q.strum) b.dataset.strum = q.strum; if(q.progression) b.dataset.progression = q.progression;
        if(q.gap) b.dataset.gap = q.gap; wirePlay(b); box.appendChild(b);
      }
      const ch = document.createElement('div'); ch.className = 'choices';
      q.choices.forEach((c, ci) => {
        const b = document.createElement('button'); b.className = 'choice'; b.textContent = c;
        b.onclick = () => {
          if(box.classList.contains('done')) return;
          box.classList.add('done');
          const ok = ci === q.answer;
          b.classList.add(ok ? 'right' : 'wrong');
          ch.children[q.answer].classList.add('right');
          answers[qi] = {ok, picked: c};
          if(answers.filter(Boolean).length === data.questions.length) finish();
        };
        ch.appendChild(b);
      });
      box.appendChild(ch);
      box.insertAdjacentHTML('beforeend', `<div class="explain">${esc(q.explain || '')}</div>`);
      root.appendChild(box);
    });
    const res = document.createElement('div'); res.className = 'result'; root.appendChild(res);

    function finish(){
      const total = data.questions.length, score = answers.filter(a => a.ok).length;
      const today = new Date().toLocaleDateString('en-CA');
      const missed = data.questions.map((q, i) => answers[i].ok ? null : {n:i+1, topic:q.topic, picked:answers[i].picked, answer:q.choices[q.answer]}).filter(Boolean);
      const all = store('gt-results', {});
      all[data.lesson] = {score, total, date: today, missed: missed.map(m => m.topic)};
      save('gt-results', all);
      const lines = [
        `lesson: ${data.lesson}`, `title: ${data.title || ''}`, `score: ${score}/${total}`, `date: ${today}`, '',
        'missed:', ...(missed.length ? missed.map(m => `- Q${m.n} [${m.topic}] picked "${m.picked}", answer "${m.answer}"`) : ['- none']),
        '', 'right:', ...data.questions.map((q, i) => answers[i].ok ? `- Q${i+1} [${q.topic}]` : null).filter(Boolean),
        '', 'note: (add anything you want the coach to know — what felt hard, what you want more of)'
      ];
      const url = `https://github.com/${REPO}/issues/new?title=${encodeURIComponent(`Results: Lesson ${data.lesson} — ${score}/${total}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
      const msg = score === total ? 'Clean sweep. Tomorrow moves ahead.' : score >= total*0.7 ? 'Solid. Tomorrow will touch up what you missed.' : 'No sweat — tomorrow will come back around to this before moving on.';
      res.innerHTML = `<div class="score">${score} / ${total}</div><p>${msg}</p>
        <p><a class="btn" href="${url}" target="_blank" rel="noopener">Send my score to the coach</a>
        <button class="ghost" id="retake">Retake</button></p>
        <p style="font-size:.85rem;color:var(--muted)">Sending opens a GitHub page with your results filled in. Tap <b>Create</b> (or <b>Submit new issue</b>). Add a note if something felt hard. The coach reads it before writing the next lesson.</p>`;
      res.classList.add('show');
      res.querySelector('#retake').onclick = () => quiz(data, root);
      res.scrollIntoView({behavior:'smooth', block:'center'});
    }
  }

  /* ---------- Lesson nav ---------- */
  async function lessonNav(){
    const n = parseInt(document.body.dataset.lesson || '0', 10); const nav = document.querySelector('.next-prev');
    if(!n || !nav) return;
    try {
      const list = await (await fetch('../lessons.json', {cache:'no-store'})).json();
      const i = list.findIndex(l => l.n === n);
      const prev = list[i-1], next = list[i+1];
      nav.innerHTML = (prev ? `<a class="btn ghost" href="../${prev.file}">← Lesson ${prev.n}</a>` : '<span></span>') +
                      (next ? `<a class="btn" href="../${next.file}">Lesson ${next.n} →</a>` : `<a class="btn ghost" href="../">Course home</a>`);
    } catch(e){}
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fretboard').forEach(fretboard);
    document.querySelectorAll('.chords').forEach(c => c.dataset.chords.split(',').map(s => s.trim()).filter(Boolean).forEach(s => c.appendChild(chordBox(s))));
    document.querySelectorAll('button.play').forEach(wirePlay);
    const qd = document.getElementById('quiz'), qr = document.getElementById('quiz-root');
    if(qd && qr){ try { quiz(JSON.parse(qd.textContent), qr); } catch(e){ qr.textContent = 'Quiz failed to load: ' + e.message; } }
    lessonNav();
  });
})();
