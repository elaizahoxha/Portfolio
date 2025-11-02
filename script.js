/* ================================
   ELAIZA PORTFOLIO — script.js
   ================================ */

/* start at top unless anchor */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('load', () => { if (!location.hash) window.scrollTo(0, 0); });

/* year (guarded) */
{ const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear(); }

/* reveal-on-scroll (once) */
const sections = document.querySelectorAll('section');
function revealOnScroll(){
  const t = window.innerHeight * 0.85;
  sections.forEach(s=>{
    const top = s.getBoundingClientRect().top;
    if(top < t && !s.classList.contains('visible')) s.classList.add('visible');
  });
}
window.addEventListener('scroll', revealOnScroll, {passive:true});
window.addEventListener('load', revealOnScroll);

/* hero typewriter (guarded) */
{ const typewriterText = "Hi, I’m Elaiza";
  const typeEl = document.getElementById('typewriter');
  let i = 0, fwd = true;
  (function type(){
    if(!typeEl) return;
    if(fwd){
      if(i < typewriterText.length){ typeEl.textContent += typewriterText[i++]; setTimeout(type,100); }
      else { fwd = false; setTimeout(type,1200); }
    }else{
      if(i > 0){ typeEl.textContent = typewriterText.substring(0, --i); setTimeout(type,60); }
      else { fwd = true; setTimeout(type,800); }
    }
  })();
}

/* particles (guarded) */
if (window.tsParticles) {
  tsParticles.load("tsparticles", {
    particles:{ number:{value:80, density:{enable:true, area:800}}, color:{value:"#fff"},
      shape:{type:"circle"}, opacity:{value:0.5, random:true}, size:{value:3, random:true},
      move:{enable:true, speed:1, outModes:"out"} },
    interactivity:{events:{onHover:{enable:true, mode:"repulse"}}, modes:{repulse:{distance:100, duration:0.4}}},
    detectRetina:true
  });
}

/* progress bar (guarded) */
const bar = document.querySelector('.scrollbar span');
function updateBar(){
  if(!bar) return;
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / Math.max(1,(h.scrollHeight - h.clientHeight));
  bar.style.width = (scrolled * 100) + '%';
}
window.addEventListener('scroll', updateBar, {passive:true}); updateBar();

/* services: tabs + slider + 3D tilt + auto-rotate + swipe */
(function(){
  const cards = Array.from(document.querySelectorAll('.services__cards .card'));
  if (!cards.length) return;

  const tabs   = Array.from(document.querySelectorAll('.services__nav button'));
  const nav    = document.getElementById('svc-nav');
  const slider = nav ? nav.querySelector('.slider') : null;
  const title  = document.getElementById('svc-title');
  const copy   = document.getElementById('svc-copy');

  function activate(idx){
    if (idx == null) return;
    tabs.forEach(b => b.classList.toggle('active', b.dataset.idx === String(idx)));
    cards.forEach(c => c.classList.toggle('active', c.dataset.idx === String(idx)));

    if(nav && slider){
      const btn = tabs[idx];
      if(btn){
        const {left, width} = btn.getBoundingClientRect();
        const {left:nLeft} = nav.getBoundingClientRect();
        slider.style.width = width + 'px';
        slider.style.transform = `translateX(${left - nLeft}px)`;
      }
    }
    if(title && copy){
      const c = cards[idx];
      if(c){
        const h = c.querySelector('h3'); const p = c.querySelector('p');
        if(h) title.textContent = h.textContent;
        if(p) copy.textContent  = p.textContent;
      }
    }
  }

  tabs.forEach((btn,i)=> btn.addEventListener('click', ()=> activate(i)));
  function initialIdx(){
    const active = tabs.findIndex(b => b.classList.contains('active'));
    return active >= 0 ? active : Math.min(1, tabs.length-1);
  }
  window.addEventListener('load', ()=> activate(initialIdx()));
  window.addEventListener('resize', ()=> activate(tabs.findIndex(b=>b.classList.contains('active'))));

  /* 3D tilt + glare */
  const MAX = 8;
  cards.forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width, py = (e.clientY - r.top)/r.height;
      card.style.setProperty('--rx', ((.5 - py) * (MAX*2)).toFixed(2) + 'deg');
      card.style.setProperty('--ry', ((px - .5) * (MAX*2)).toFixed(2) + 'deg');
      card.style.setProperty('--mx', (px*100).toFixed(1) + '%');
      card.style.setProperty('--my', (py*100).toFixed(1) + '%');
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.setProperty('--rx','0deg'); card.style.setProperty('--ry','0deg');
    });
  });

  /* auto-rotate (pause on hover) */
  let idx = initialIdx();
  let timer;
  const start = ()=> { stop(); timer = setInterval(()=> { idx = (idx+1)%cards.length; activate(idx); }, 4000); };
  const stop  = ()=> { if(timer){ clearInterval(timer); timer=null; } };
  const area = document.querySelector('.services');
  if(area){ area.addEventListener('mouseenter', stop); area.addEventListener('mouseleave', start); }
  start();

  /* swipe */
  let sx=null, sy=null;
  if(area){
    area.addEventListener('touchstart', e=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY; }, {passive:true});
    area.addEventListener('touchend', e=>{
      if(sx===null) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if(Math.abs(dx)>40 && Math.abs(dy)<50){ stop(); idx = (idx + (dx<0?1:-1) + cards.length) % cards.length; activate(idx); start(); }
      sx=sy=null;
    }, {passive:true});
  }
})();

/* project tabs */
document.querySelectorAll('.projects-nav button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const tab = btn.dataset.tab;
    document.querySelectorAll('.projects-nav button').forEach(b=>b.classList.toggle('active', b===btn));
    document.querySelectorAll('.project-tab').forEach(p=>p.classList.toggle('active', p.dataset.tab===tab));
  });
});

/* carousels (robust) */
document.querySelectorAll('.carousel').forEach(carousel=>{
  const imgs = Array.from(carousel.querySelectorAll('img'));
  if (!imgs.length) return;
  let idx = imgs.findIndex(i=>i.classList.contains('active'));
  if (idx < 0) { idx = 0; imgs[0].classList.add('active'); }
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  function show(i){
    imgs[idx].classList.remove('active');
    idx = (i + imgs.length) % imgs.length;
    imgs[idx].classList.add('active');
  }
  prev?.addEventListener('click', ()=>show(idx-1));
  next?.addEventListener('click', ()=>show(idx+1));
});

/* workflow stagger */
(function(){
  const section = document.getElementById('process');
  if(!section) return;
  function go(){
    const t = window.innerHeight * 0.85;
    if(section.getBoundingClientRect().top < t){
      const steps = document.querySelectorAll('.process-steps .step-box');
      steps.forEach((s,i)=> setTimeout(()=> s.classList.add('visible'), i*400));
      window.removeEventListener('scroll', go);
    }
  }
  window.addEventListener('scroll', go, {passive:true}); go();
})();

/* kinetic headlines */
(function(){
  document.querySelectorAll('[data-split]').forEach(h=>{
    const t = h.textContent.trim();
    h.innerHTML = t.replace(/\S/g, (m,i)=>`<span class="k" style="--i:${i}">${m}</span>`);
  });
  const io = new IntersectionObserver((es)=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }});
  }, {threshold:.6});
  document.querySelectorAll('.k-headline').forEach(h=>io.observe(h));
})();

/* parallax */
window.addEventListener('scroll', ()=>{
  const y = window.scrollY;
  document.querySelectorAll('[data-parallax]').forEach(el=>{
    const s = parseFloat(el.dataset.parallax || 0.05);
    el.style.transform = `translate3d(0, ${y*s}px, 0)`;
  });
}, {passive:true});

/* back to top */
const toTop = document.querySelector('.to-top');
function toggleTop(){ if(!toTop) return; (window.scrollY>600) ? toTop.classList.add('show') : toTop.classList.remove('show'); }
window.addEventListener('scroll', toggleTop, {passive:true}); toggleTop();
toTop?.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

/* simple page transition for same-origin navigations */
document.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    const newTab = a.target === '_blank' || a.hasAttribute('download');
    const isHash = href && href.startsWith('#');
    const isExternal = href && /^(https?:)?\/\//.test(href) && !href.includes(location.host);
    if (!href || newTab || isHash || isExternal) return;
    e.preventDefault();
    document.documentElement.classList.add('page-exit');
    setTimeout(()=> { window.location.href = href; }, 280);
  });
});
window.addEventListener('pageshow', ()=> { document.documentElement.classList.remove('page-exit'); });

/* ==========================================================
   PIN MAKER (Pinterest Lab) — Compact + Cuter Tiles
   ========================================================== */
(function(){
  const root = document.querySelector('#playground.pin-lab');
  if(!root) return;

  const $ = sel => root.querySelector(sel);
  const $$ = sel => [...root.querySelectorAll(sel)];
  const msg = $('#pin-msg');

  const ideaEl = $('#pin-idea');
  const goalEl = $('#pin-goal');
  const styleEl = $('#pin-style');
  const kwEl = $('#pin-keywords');
  const lenChips = $$('#len-chips .chip');

  const genBtn = $('#pin-generate');
  const copyAllBtn = $('#pin-copy-all');

  const list = $('#variant-list');
  const masonry = $('#masonry');

  const ppTitle = $('#pp-title');
  const ppDesc  = $('#pp-desc');
  const ppScore = $('#pp-score');
  const ppLabel = $('#pp-label');
  const ppImage = $('#pp-image');
  const scoreTable = $('#score-table');

  let lengthPref = 'short';
  lenChips.forEach(b => b.addEventListener('click', ()=>{
    lenChips.forEach(x => x.classList.toggle('active', x===b));
    lengthPref = b.dataset.len;
  }));

  function splitKeywords(s){ return (s||'').split(',').map(t=>t.trim()).filter(Boolean).slice(0,8); }
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
  function clampLen(str, target){
    if(target==='short') return str.length>58 ? str.slice(0,56).trim() + '…' : str;
    if(target==='medium') return str.length>74 ? str.slice(0,72).trim() + '…' : str;
    return str.length>92 ? str.slice(0,90).trim() + '…' : str;
  }
  function shuffle(arr, seed=0){
    const a = [...arr];
    for(let i=a.length-1;i>0;i--){
      const j = (Math.abs(Math.sin(i+seed))*10000|0) % (i+1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const VOICE = {
    cute: { heads: ['Cozy','Soft','Pastel','Rainy day','Pink','Calm','Warm'],
            verbs: ['setup','ideas','tips','checklist','guide','essentials','aesthetic'],
            closers: ['study ritual','focus routine','desk inspo','productivity boost'] },
    editorial: { heads: ['Editorial','Minimal','Clean','Refined','Practical'],
                 verbs: ['guide','framework','workflow','setup','principles'],
                 closers: ['study system','focus method','desk layout'] },
    pinterest: { heads: ['Pinterest','Board-worthy','Trending','Inspo-ready'],
                 verbs: ['ideas','tricks','how to','setup','checklist'],
                 closers: ['save for later','pin-first workflow','quick wins'] }
  };

  const GOAL_HINT = {
    saves:   { label:'goal fit: saves',   weight:{aesthetic:0.50, specificity:0.30, length:0.20}, len:{short:[38,60], medium:[45,70], long:[55,90]} },
    clicks:  { label:'goal fit: clicks',  weight:{aesthetic:0.20, specificity:0.55, length:0.25}, len:{short:[32,56], medium:[40,68], long:[48,86]} },
    follows: { label:'goal fit: follows', weight:{aesthetic:0.35, specificity:0.35, length:0.30}, len:{short:[36,58], medium:[42,70], long:[50,88]} }
  };

  function within(v, lo, hi){ return Math.max(0, Math.min(1,(v - lo) / Math.max(1,(hi - lo)))); }
  function scoreTitle(title, goal, keywords){
    const g = GOAL_HINT[goal];
    const lens = g.len[lengthPref];
    const lenScore = within(title.length, lens[0], lens[1]);
    const specScore = Math.min(1, keywords.filter(k=> title.toLowerCase().includes(k.toLowerCase())).length / Math.max(1, Math.min(4, keywords.length)));
    const aestheticScore = /cozy|pastel|pink|rain|soft|clean|minimal|calm|warm|fall|sweater|boots/i.test(title) ? 1 : 0.5;
    const w = g.weight;
    const total = Math.max(0, Math.min(1, w.length*lenScore + w.specificity*specScore + w.aesthetic*aestheticScore));
    return { total, lenScore, specScore, aestheticScore, weights:w };
  }

  function makeTitle(idea, goal, style, kws){
    const v = VOICE[style];
    const head = pick(v.heads), verb = pick(v.verbs), closer = pick(v.closers);
    const k1 = kws[0] || '', k2 = kws[1] || '';
    let base = (goal==='clicks')
      ? `${head} ${k1 || 'study desk'} ${verb}: ${k2 || 'focus'} tips`
      : (goal==='follows')
      ? `${head} ${k1 || 'study'} ${verb} • ${closer}`
      : `${head} ${k1 || 'cozy study'} ${verb} • ${closer}`;
    const bits = (idea||'').split(/[.,;|]/).map(s=>s.trim()).filter(Boolean);
    if(bits[0] && base.length < 72) base = base.replace(/tips|ideas|setup|guide|workflow|framework/i, m => `${m} • ${bits[0].toLowerCase()}`);
    return clampLen(base, lengthPref);
  }

  function makeDesc(idea, goal, style, kws){
    const kwLine = kws.slice(0,4).join(' • ');
    let lineA='', lineB='';
    if(goal==='clicks'){ lineA=`Simple steps to go from inspo to action—clear, quick, and realistic.`; lineB=`See the full breakdown + resources inside.`; }
    else if(goal==='follows'){ lineA=`More cozy setups, routines, and weekly study inspo on my profile.`; lineB=`Save this and follow for new ideas each week.`; }
    else { lineA=`Soft, practical ideas you can copy today for a calm focus space.`; lineB=`Save for later • ${kwLine}`; }
    let desc = `${lineA} ${lineB}`;
    if(lengthPref==='short') desc = lineA;
    if(lengthPref==='long' && idea && desc.length < 180){
      const extra = ` ${capitalize(idea.split(/[.!?]/)[0] || '').trim()}.`;
      desc += extra;
    }
    return desc;
  }

  function renderVariant(idx, title, desc, scoreObj, goal){
    const li = document.createElement('li');
    li.className = 'variant';
    li.innerHTML = `
      <div class="v-title">${title}</div>
      <div class="v-desc">${desc}</div>
      <div class="v-score">${GOAL_HINT[goal].label} • ${(scoreObj.total*100|0)}%</div>
      <div class="v-actions">
        <button class="btn ghost v-copy-title">Copy Title</button>
        <button class="btn ghost v-copy-desc">Copy Description</button>
        <button class="btn v-copy-both">Copy Both</button>
      </div>
    `;
    li.querySelector('.v-copy-title').addEventListener('click', ()=>copyText(title, 'Title copied'));
    li.querySelector('.v-copy-desc').addEventListener('click', ()=>copyText(desc, 'Description copied'));
    li.querySelector('.v-copy-both').addEventListener('click', ()=>copyText(`${title}\n\n${desc}`, 'Title + description copied'));
    return li;
  }

  function flash(text){ if(!msg) return; msg.textContent = text; setTimeout(()=> msg.textContent='', 1500); }
  async function copyText(text, note){ try{ await navigator.clipboard.writeText(text); flash(note); } catch{ flash('Copy blocked by browser'); } }

  function updatePreview(title, desc, scoreObj, goal){
    if(ppTitle) ppTitle.textContent = title;
    if(ppDesc)  ppDesc.textContent = desc;
    if(ppScore) ppScore.style.setProperty('--pct', (scoreObj.total*100|0) + '%');
    if(ppLabel) ppLabel.textContent = `${GOAL_HINT[goal].label} • ${(scoreObj.total*100|0)}%`;
    if(scoreTable){
      const w = scoreObj.weights;
      scoreTable.innerHTML = `
        <span class="score-pill">Length fit: ${(scoreObj.lenScore*100|0)}% (w ${Math.round(w.length*100)}%)</span>
        <span class="score-pill">Specificity: ${(scoreObj.specScore*100|0)}% (w ${Math.round(w.specificity*100)}%)</span>
        <span class="score-pill">Aesthetic: ${(scoreObj.aestheticScore*100|0)}% (w ${Math.round(w.aesthetic*100)}%)</span>
      `;
    }
  }

  function fillMasonry(bestTitle, kws, style, scoreObj){
    if(!masonry) return;
    masonry.innerHTML = '';
    const count = 8;
    for(let i=0;i<count;i++){
      const t = document.createElement('div'); t.className = `tile ${style}`;
      const hue = (i*14) % 360; t.style.filter = `hue-rotate(${hue}deg)`;

      const title = document.createElement('div');
      title.className = 't-title';
      title.textContent = i % 2 === 0 ? bestTitle : clampLen(bestTitle, 'medium');

      const badges = document.createElement('div'); badges.className = 't-badges';
      (kws.slice(i%2, i%2+3).length ? kws.slice(i%2, i%2+3) : ['inspo','easy','quick']).forEach(k=>{
        const s = document.createElement('span'); s.textContent = k; badges.appendChild(s);
      });

      const bar = document.createElement('div'); bar.className = 't-score';
      const fill = document.createElement('i');
      const jitter = Math.max(0, Math.min(1, scoreObj.total + (Math.sin(i)*0.05)));
      fill.style.setProperty('--pct', (jitter*100|0) + '%');
      bar.appendChild(fill);

      t.appendChild(title); t.appendChild(badges); t.appendChild(bar);
      masonry.appendChild(t);
    }
  }

  function generate(){
    const idea = ideaEl?.value.trim() || '';
    const goal = goalEl?.value || 'saves';
    const style = styleEl?.value || 'cute';
    const kws = splitKeywords(kwEl?.value || '');

    // slim gradient banner in preview
    const tint = style==='editorial' ? 'color-mix(in oklab, var(--accent) 6%, white)'
               : style==='pinterest' ? 'color-mix(in oklab, var(--accent) 12%, white)'
               : 'color-mix(in oklab, var(--accent) 16%, white)';
    if (ppImage) {
      ppImage.style.background =
        `radial-gradient(120% 70% at 20% 10%, ${tint}, transparent 60%),
         linear-gradient(135deg, #fff, color-mix(in oklab, var(--accent) 10%, #f5f1f6))`;
    }

    if(list) list.innerHTML = '';
    const variants = [];
    for(let i=0;i<3;i++){
      const t = makeTitle(idea, goal, style, shuffle(kws, i));
      const d = makeDesc(idea, goal, style, kws);
      const s = scoreTitle(t, goal, kws);
      variants.push({title:t, desc:d, score:s});
      if(list) list.appendChild(renderVariant(i, t, d, s, goal));
    }

    variants.sort((a,b)=> b.score.total - a.score.total);
    const best = variants[0];
    updatePreview(best.title, best.desc, best.score, goal);
    fillMasonry(best.title, kws, style==='cute' ? 'cute' : style, best.score);
    lastBatch = variants;
  }

  let lastBatch = null;
  genBtn?.addEventListener('click', generate);
  copyAllBtn?.addEventListener('click', async ()=>{
    if(!lastBatch){ flash('Generate first'); return; }
    const text = lastBatch.map((v,i)=>`Variant ${i+1}\n${v.title}\n\n${v.desc}\n`).join('\n');
    try{ await navigator.clipboard.writeText(text); flash('All variants copied'); } catch{ flash('Copy blocked by browser'); }
  });

  // starter content
  if(ideaEl) ideaEl.value = 'Cozy study desk with pink sweater + matcha on a rainy day; 3 quick focus tips';
  if(kwEl)   kwEl.value = 'cozy study, pink sweater, matcha, rainy day, focus tips';
  generate();
})();

/* ===========================================
   Pinterest Trend Cluster Map — v2 Logic
   =========================================== */
(function(){
  const root = document.querySelector('#playground.trend-lab.v2');
  if(!root) return;

  function loadD3(){
    return new Promise((resolve, reject)=>{
      if (window.d3) return resolve(window.d3);
      const s = document.createElement('script');
      s.src = 'https://d3js.org/d3.v7.min.js';
      s.onload = () => resolve(window.d3);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  const $ = sel => root.querySelector(sel);
  const seedEl = $('#seed-topic'), goalEl = $('#goal'), styleEl = $('#style'), kwEl = $('#keywords');
  const weekEl = $('#week'), weekLabel = $('#week-label'), playBtn = $('#play');
  const demoBtn = $('#load-demo'), shuffleBtn = $('#shuffle'), resetBtn = $('#reset');
  const importBtn = $('#import-trends'), importBox = $('#import-box');
  const svg = root.querySelector('#cluster-svg'), tooltip = root.querySelector('#tooltip');
  const sugTerm = root.querySelector('#selected-term'), sugList = root.querySelector('#sug-list'), copySug = root.querySelector('#copy-sug');

  const COLORS = {study:'#AC859C', fashion:'#C5CC82', food:'#97A13B', decor:'#D6E6E7', other:'#E0A3BB'};
  const colorFor = g => COLORS[g] || COLORS.other;
  function parseKeywords(v){ return (v||'').split(',').map(s=>s.trim()).filter(Boolean).slice(0,8); }
  function words(s){ return s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); }
  function jaccard(a,b){ const A=new Set(words(a)), B=new Set(words(b)); let i=0; for(const v of A) if(B.has(v)) i++; return i/(A.size+B.size-i||1); }
  const clamp01 = x => Math.max(0,Math.min(1,x));
  const cap = s => s.charAt(0).toUpperCase()+s.slice(1);

  function withSeries(term, base, group){
    const arr=[base]; for(let i=1;i<12;i++){ const prev=arr[i-1]; const step=(Math.random()*14-7); arr.push(Math.max(20, Math.min(100, prev+step))); }
    return { term, score:arr[11], group, series:arr };
  }
  const DEMO = [
    withSeries('cozy study',78,'study'),
    withSeries('dorm decor',64,'decor'),
    withSeries('fall outfits',90,'fashion'),
    withSeries('pink sweater',72,'fashion'),
    withSeries('matcha recipes',70,'food'),
    withSeries('rainy day desk',65,'study'),
    withSeries('study routine',74,'study'),
    withSeries('small room desk',60,'decor'),
    withSeries('capsule wardrobe',68,'fashion'),
    withSeries('matcha latte art',58,'food'),
    withSeries('study timer tips',61,'study'),
    withSeries('fall boots',76,'fashion'),
    withSeries('neutral dorm',62,'decor'),
    withSeries('pastel notes',59,'study'),
    withSeries('matcha whisk',54,'food')
  ];

  const GOAL = {
    saves:{ w:{spec:.45,len:.30,aes:.25}, len:[38,70], label:'saves'},
    clicks:{ w:{spec:.55,len:.25,aes:.20}, len:[32,65], label:'clicks'},
    follows:{ w:{spec:.35,len:.30,aes:.35}, len:[36,70], label:'follows'}
  };
  function titleFor(term, goal, style, kws){
    const glue = style==='editorial' ? ' — ' : ' • ';
    const k1 = kws[0] ? `${glue}${kws[0]}` : '';
    const base = style==='editorial' ? `${cap(term)}: a quick guide` : `${cap(term)} ideas${k1}`;
    const [lo,hi]=GOAL[goal].len; return base.length>hi?base.slice(0,hi-1)+'…':base;
  }
  function descFor(term, goal, kws){
    const kw = kws.slice(0,3).join(' • ');
    if(goal==='clicks') return `From inspo to action. See full breakdown + resources. ${kw?('• '+kw):''}`;
    if(goal==='follows') return `Weekly inspo around ${term}. Save & follow for new ideas. ${kw?('• '+kw):''}`;
    return `Soft, practical ideas around ${term} you can copy today. Save for later. ${kw?('• '+kw):''}`;
  }
  function scoreFor(text, goal, kws){
    const g = GOAL[goal], [lo,hi]=g.len;
    const len = clamp01((text.length-lo)/Math.max(1,hi-lo));
    const spec = Math.min(1, kws.filter(k=>text.toLowerCase().includes(k.toLowerCase())).length / Math.max(1, Math.min(4, kws.length)));
    const aes = /cozy|pastel|pink|clean|minimal|warm|fall|rain|matcha/i.test(text) ? 1 : .5;
    return clamp01(g.w.spec*spec + g.w.len*len + g.w.aes*aes);
  }

  let sim, zoom, rootG, gLink, gNode, hullG, d3s;
  let data = DEMO;
  let week = 11, playing = false, rafId = null;

  function buildLinks(nodes){
    const links=[];
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i], b=nodes[j];
        const sim=jaccard(a.term,b.term);
        if(a.group===b.group && sim>0.08) links.push({source:a.id,target:b.id,w:.6+sim});
        else if(sim>.22) links.push({source:a.id,target:b.id,w:.4+sim});
      }
    }
    return links;
  }

  function drawSparklines(series){
    const w=120,h=30;
    const max=Math.max(...series), min=Math.min(...series);
    const pts=series.map((v,i)=>{
      const x=(i/(series.length-1))*w;
      const y=h - ((v-min)/(max-min||1))*h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return `<svg width="${w}" height="${h}"><polyline fill="none" stroke="#AC859C" stroke-width="2" points="${pts}"/></svg>`;
  }

  function showTip(html, ev){
    tooltip.innerHTML = html;
    tooltip.style.left = ev.clientX + 'px';
    tooltip.style.top = ev.clientY + 'px';
    tooltip.classList.add('show');
    tooltip.setAttribute('aria-hidden','false');
  }
  function hideTip(){ tooltip.classList.remove('show'); tooltip.setAttribute('aria-hidden','true'); }

  async function initGraph(raw){
    d3s = await loadD3();
    data = raw.map((d,i)=> ({...d, id:i}));
    const links = buildLinks(data);

    const svgSel = d3s.select(svg); svgSel.selectAll('*').remove();
    rootG = svgSel.append('g');
    hullG = rootG.append('g').attr('class','hull');

    gLink = rootG.append('g').attr('stroke','#e9e9e9').selectAll('line')
      .data(links).enter().append('line')
      .attr('class','link').attr('stroke-width', d=>d.w);

    gNode = rootG.append('g').selectAll('g')
      .data(data).enter().append('g').attr('class','node')
      .call(drag())
      .on('mouseenter', (e,d)=>{
        const spark = drawSparklines(d.series);
        showTip(`${d.term} • wk${week+1}: ${Math.round(d.series[week])}<br/>${spark}`, e);
      })
      .on('mousemove', (e)=>{ tooltip.style.left=e.clientX+'px'; tooltip.style.top=e.clientY+'px'; })
      .on('mouseleave', hideTip)
      .on('click', (_,d)=> renderIdeas(d.term));

    gNode.append('circle').attr('class','ring');
    gNode.append('circle').attr('class','main');
    gNode.append('text').attr('text-anchor','middle').attr('dy','.35em');

    sim = d3s.forceSimulation(data)
      .force('link', d3s.forceLink(links).id(d=>d.id).distance(d=> 38 + (140 - d.w*30)))
      .force('charge', d3s.forceManyBody().strength(-160))
      .force('center', d3s.forceCenter(500, 310))
      .force('collide', d3s.forceCollide().radius(d=> radiusFor(d)+6))
      .on('tick', tick);

    zoom = d3s.zoom().scaleExtent([0.6, 2.4]).on('zoom', (e)=> rootG.attr('transform', e.transform));
    svgSel.call(zoom);

    updateVisuals();
  }

  function drag(){
    function started(event, d){ if(!event.active) sim.alphaTarget(0.3).restart(); d.fx=d.x; d.fy=d.y; }
    function dragged(event, d){ d.fx=event.x; d.fy=event.y; }
    function ended(event, d){ if(!event.active) sim.alphaTarget(0); d.fx=null; d.fy=null; }
    return d3s.drag().on('start', started).on('drag', dragged).on('end', ended);
  }

  function momentumFor(d){
    const prev = Math.max(0, week-1);
    const m = (d.series[week] - d.series[prev]) / 25;
    return Math.max(1, Math.min(8, Math.abs(m)*8));
  }
  function radiusFor(d){
    const v = d.series[week];
    return 10 + (v - 20) * 0.25;
  }

  function updateVisuals(){
    gNode.each(function(d){
      const r = radiusFor(d);
      const ringW = momentumFor(d);
      const grp = d.group;
      const node = d3s.select(this);
      node.select('circle.main')
        .attr('r', r)
        .attr('fill', colorFor(grp))
        .each(function(){ this.style.setProperty('--nodeColor', colorFor(grp)); });
      node.select('circle.ring')
        .attr('r', r + ringW*0.55)
        .each(function(){ this.style.setProperty('--ringW', ringW+'px'); });
      node.select('text')
        .text(d.term.length>16 ? d.term.slice(0,14)+'…' : d.term);
    });

    const groups = Array.from(new Set(data.map(d=>d.group)));
    hullG.selectAll('*').remove();
    groups.forEach(g=>{
      const pts = data.filter(d=>d.group===g).map(d=>[d.x, d.y]);
      if(pts.length<3) return;
      const hull = d3s.polygonHull(pts);
      if(!hull) return;
      hullG.append('path')
        .attr('d', 'M'+hull.join('L')+'Z')
        .attr('style', `--hue:${colorFor(g)}`);
    });

    if(weekLabel) weekLabel.textContent = `Week ${week+1}`;
  }

  function tick(){
    gLink.attr('x1', d=>d.source.x).attr('y1', d=>d.source.y)
         .attr('x2', d=>d.target.x).attr('y2', d=>d.target.y);
    gNode.attr('transform', d=>`translate(${d.x},${d.y})`);
  }

  function renderIdeas(term){
    const kws = parseKeywords(kwEl?.value || '');
    const g = goalEl?.value || 'saves', s = styleEl?.value || 'cute';
    const variants = [
      {label:'Checklist', t: `${cap(term)} checklist — quick wins`, d: descFor(term, g, kws)},
      {label:'How-to',    t: `How to ${term} (3 easy steps)`,     d: descFor(term, g, kws)},
      {label:'Before/After', t: `${cap(term)} before → after`,    d: descFor(term, g, kws)},
    ].map(v => ({...v, score: Math.round(scoreFor(v.t, g, kws)*100)}));

    if(sugTerm) sugTerm.textContent = term;
    if(sugList){
      sugList.innerHTML = '';
      variants.forEach(v=>{
        const li = document.createElement('li');
        li.innerHTML = `<div class="t">${v.t} — <span style="opacity:.7">${v.label}</span> • ${v.score}%</div><div class="d">${v.d}</div>`;
        sugList.appendChild(li);
      });
    }
    if(copySug){
      copySug.onclick = async ()=>{
        const txt = variants.map((v,i)=>`Variant ${i+1} (${v.label}, ${v.score}%)\n${v.t}\n\n${v.d}\n`).join('\n');
        try{ await navigator.clipboard.writeText(txt); }catch{}
      };
    }
  }

  function setWeek(v){
    week = v; if(weekEl) weekEl.value = v; updateVisuals();
    if(tooltip?.classList.contains('show')) tooltip.classList.remove('show');
  }
  weekEl?.addEventListener('input', e=> setWeek(parseInt(e.target.value,10)));

  function tickPlay(){
    if(!playing) return;
    setWeek((week+1)%12);
    rafId = setTimeout(tickPlay, 900);
  }
  playBtn?.addEventListener('click', ()=>{
    playing = !playing;
    if(playBtn) playBtn.textContent = playing ? '❚❚ Pause' : '▶ Play';
    if(playing) tickPlay(); else clearTimeout(rafId);
  });

  demoBtn?.addEventListener('click', ()=>{
    const extra = (seedEl?.value || '').trim();
    const base = DEMO.slice();
    if(extra) base.push(withSeries(extra, 65, 'other'));
    initGraph(base);
  });
  shuffleBtn?.addEventListener('click', ()=> { if(sim) sim.alpha(0.6).restart(); });
  resetBtn?.addEventListener('click', ()=> {
    if(!d3s) return;
    const svgSel = d3s.select(svg);
    svgSel.transition().duration(300).call(zoom.transform, d3s.zoomIdentity);
  });
  importBtn?.addEventListener('click', ()=>{
    const rows = (importBox?.value||'').split('\n').map(x=>x.trim()).filter(Boolean);
    if(!rows.length) return;
    const parsed = rows.map(line=>{
      const [t, s, g='other'] = line.split(',').map(x=>x.trim());
      const base = isFinite(parseInt(s,10)) ? parseInt(s,10) : 50;
      return withSeries(t, base, (g||'other').toLowerCase());
    });
    initGraph(parsed);
  });

  initGraph(DEMO);
})();

/* ===========================================
   Design System Playground — tokens + motion
   =========================================== */
(function(){
  const root = document.querySelector('#playground.ds-playground');
  if(!root) return;

  const $ = sel => root.querySelector(sel);
  const msg = $('#ds-msg');

  const primaryEl = $('#tok-primary');
  const accentEl  = $('#tok-accent');
  const surfaceEl = $('#tok-surface');
  const inkEl     = $('#tok-ink');

  const radiusEl  = $('#tok-radius');
  const elevEl    = $('#tok-elev');
  const scaleEl   = $('#tok-scale');
  const trackEl   = $('#tok-tracking');

  const durEl     = $('#tok-dur');
  const delayEl   = $('#tok-delay');
  const easeEl    = $('#tok-ease');

  const valRadius = $('#val-radius');
  const valElev   = $('#val-elev');
  const valScale  = $('#val-scale');
  const valTrack  = $('#val-track');
  const valDur    = $('#val-dur');
  const valDelay  = $('#val-delay');

  const playBtn   = $('#motion-play');
  const exportBtn = $('#export-css');

  const wall = root.querySelector('.ds-wall');

  function setCSS(varName, value){
    document.documentElement.style.setProperty(varName, value);
    pulse();
  }

  let morphTimer=null;
  function pulse(){
    if(!wall) return;
    wall.classList.remove('morph');
    void wall.offsetWidth;
    wall.classList.add('morph');
    clearTimeout(morphTimer);
    morphTimer = setTimeout(()=> wall.classList.remove('morph'), 500);
  }

  primaryEl?.addEventListener('input', e => setCSS('--ds-primary', e.target.value));
  accentEl ?.addEventListener('input', e => setCSS('--ds-accent', e.target.value));
  surfaceEl?.addEventListener('input', e => setCSS('--ds-surface', e.target.value));
  inkEl    ?.addEventListener('input', e => setCSS('--ds-ink', e.target.value));

  radiusEl?.addEventListener('input', e=>{
    if(valRadius) valRadius.textContent = e.target.value + 'px';
    setCSS('--ds-radius', e.target.value + 'px');
  });

  elevEl?.addEventListener('input', e=>{
    if(valElev) valElev.textContent = e.target.value;
    const y = e.target.value;
    setCSS('--ds-shadow', `0 ${Math.round(y/2)}px ${Math.round(y*1.4)}px rgba(0,0,0,.12)`);
  });

  scaleEl?.addEventListener('input', e=>{
    if(valScale) valScale.textContent = Number(e.target.value).toFixed(2);
    setCSS('--ds-scale', e.target.value);
  });

  trackEl?.addEventListener('input', e=>{
    if(valTrack) valTrack.textContent = Number(e.target.value).toFixed(3);
    setCSS('--ds-track', e.target.value + 'em');
  });

  durEl?.addEventListener('input', e=>{
    if(valDur) valDur.textContent = e.target.value + 'ms';
    setCSS('--ds-dur', e.target.value + 'ms');
  });
  delayEl?.addEventListener('input', e=>{
    if(valDelay) valDelay.textContent = e.target.value + 'ms';
    setCSS('--ds-delay', e.target.value + 'ms');
  });
  easeEl?.addEventListener('change', e=> setCSS('--ds-ease', e.target.value));

  playBtn?.addEventListener('click', ()=>{
    const blob = root.querySelector('.hero-blob');
    if(blob){
      blob.style.transform = 'translateY(-6px) rotate(4deg)';
      setTimeout(()=> blob.style.transform = '', 260);
    }
    const card = root.querySelector('.ui-card');
    if(card){
      card.style.transform = 'translateY(-4px) scale(1.01)';
      setTimeout(()=> card.style.transform = '', 260);
    }
    root.querySelectorAll('.ui-btn').forEach((b,i)=>{
      setTimeout(()=>{ b.style.transform = 'translateY(-1px)'; setTimeout(()=> b.style.transform = '', 220); }, i*60);
    });
  });

  const open = root.querySelector('#open-modal');
  const close = root.querySelector('#close-modal');
  const modal = root.querySelector('#demo-modal');

  open?.addEventListener('click', ()=> modal?.setAttribute('aria-hidden','false'));
  close?.addEventListener('click', ()=> modal?.setAttribute('aria-hidden','true'));
  modal?.addEventListener('click', (e)=>{ if(e.target === modal) modal.setAttribute('aria-hidden','true'); });

  async function copy(text){
    try{ await navigator.clipboard.writeText(text); if(msg){ msg.textContent = 'Copied!'; setTimeout(()=> msg.textContent='', 1200); } }
    catch{ if(msg){ msg.textContent = 'Copy blocked'; setTimeout(()=> msg.textContent='', 1200); } }
  }
  exportBtn?.addEventListener('click', ()=>{
    const styles = getComputedStyle(document.documentElement);
    const vars = [
      '--ds-primary','--ds-accent','--ds-surface','--ds-ink',
      '--ds-radius','--ds-shadow','--ds-ease','--ds-delay','--ds-dur','--ds-track','--ds-scale'
    ].map(v => `  ${v}: ${styles.getPropertyValue(v).trim()};`).join('\n');
    const block = `:root{\n${vars}\n}`;
    copy(block);
  });

  pulse();
})();

/* =========================
   Art-Meets-Interface (AMI)
   — flower builder (VERTICAL STEM)
   ========================= */
(function(){
  const tempo = document.getElementById('ami-tempo');
  const soft = document.getElementById('ami-soft');
  const bright = document.getElementById('ami-bright');
  const play = document.getElementById('ami-play');
  const bloom = document.querySelector('.ami-bloom');

  // guard if AMI section isn't on page
  if(!document.querySelector('.ami')) return;

  // ---- tiny synth beeps (kept) ----
  if(play && bloom){
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    function tone(freq, time, type='sine', gain=0.08){
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type; osc.frequency.value = freq; g.gain.value = gain;
      osc.connect(g); g.connect(ctx.destination);
      osc.start(); setTimeout(()=> osc.stop(), time);
    }
    function updateBloom(){
      const s = (soft?.value|0) / 100;
      const b = (bright?.value|0) / 100;
      const a = 0.25 + s*0.35;
      bloom.style.background =
        `radial-gradient(100px 60px at 20% 40%, rgba(226,140,160,${a}), transparent 60%),
         radial-gradient(120px 80px at 70% 60%, rgba(141,180,160,${0.15 + b*0.35}), transparent 60%)`;
    }
    ['input','change'].forEach(evt=>{
      tempo?.addEventListener(evt, updateBloom);
      soft?.addEventListener(evt, updateBloom);
      bright?.addEventListener(evt, updateBloom);
    });
    updateBloom();
    play.addEventListener('click', ()=>{
      const bpm = (tempo?.value|0) || 90;
      const interval = Math.max(120, 60000 / bpm);
      const s = (soft?.value|0) / 100;
      const b = (bright?.value|0) / 100;
      const notes = [220, 247, 262, 294, 330].map(n => n + Math.round(b*40));
      let i=0;
      for(let k=0;k<6;k++){
        setTimeout(()=>{
          tone(notes[i%notes.length], 120 + s*200, s>0.6?'sine':'triangle', 0.05 + s*0.08);
          i++;
        }, k*interval);
      }
    });
  }

  // ---- microcopy tone chips (kept) ----
  const copyOut = document.getElementById('ami-copy');
  const chips = document.querySelectorAll('.ami-copy-controls .ami-chip');
  const toneMap = {
    calm: "Take your time. I’ll follow your pace.",
    warm: "You’re doing great—want to try the next step?",
    brisk: "All set. Continue when ready.",
    encouraging: "Small steps count. Ready for one more?"
  };
  chips.forEach(ch=>{
    ch.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('is-active'));
      ch.classList.add('is-active');
      if(copyOut) copyOut.textContent = toneMap[ch.dataset.tone] || "Ready when you are.";
    });
  });

  // ---- Ikebana toy: petals + VERTICAL stem -> flower ----
  const stage = document.getElementById('ami-stage');
  const addPetalBtn = document.getElementById('ami-add-petal');
  const addStemBtn  = document.getElementById('ami-add-stem');
  const clearBtn    = document.getElementById('ami-clear');
  if(!stage) return;

  function rand(min,max){ return Math.random()*(max-min)+min }
  const FLOWERS = []; // each: {cx, cy, stemEl, petals: []}

  function makePetal(){
    const el = document.createElement('div');
    el.className = 'piece petal';
    el.style.position = 'absolute';
    el.style.width = '46px';
    el.style.height = '30px';
    el.style.borderRadius = '50% 50% 48% 52% / 55% 45% 55% 45%';
    el.style.background = 'linear-gradient(180deg, rgba(227,181,197,.85), rgba(251,244,246,.9))';
    el.style.boxShadow = '0 6px 18px rgba(0,0,0,.08)';
    el.style.transition = 'transform .4s ease, opacity .3s ease';
    el.style.zIndex = 2; // above stem
    return el;
  }
  function makeStem(){
    const el = document.createElement('div');
    el.className = 'piece stem';
    el.style.position = 'absolute';
    el.style.width = '6px';
    el.style.borderRadius = '3px';
    el.style.background = 'linear-gradient(180deg, #3b5b4a, #243a2e)';
    el.style.transformOrigin = '50% 0%'; // anchor at top (flower center)
    el.style.zIndex = 1; // behind petals
    return el;
  }

  function layout(flower){
    const {cx, cy} = flower;

    // --- STEM: perfectly vertical, growing downward from the flower center ---
    if(flower.stemEl){
      const stem = flower.stemEl;
      const maxDown = Math.max(40, stage.clientHeight - cy - 8);
      const len = Math.min(140, maxDown);           // clamp length
      stem.style.left = (cx - 3) + 'px';            // center minus half width
      stem.style.top  = (cy) + 'px';                // start exactly at center
      stem.style.height = len + 'px';
      stem.style.transform = 'rotate(0deg)';        // VERTICAL
    }

    // --- PETALS: ring around center ---
    const ring = Math.min(56, Math.max(34, (stage.clientWidth+stage.clientHeight)/50));
    const count = Math.max(5, flower.petals.length);
    flower.petals.forEach((p,i)=>{
      const a = (i / count) * Math.PI*2;
      const px = cx + Math.cos(a) * ring;
      const py = cy + Math.sin(a) * (ring*0.68);
      p.style.left = (px - 23) + 'px';
      p.style.top  = (py - 15) + 'px';
      p.style.transform = `rotate(${(a*180/Math.PI)+90}deg)`;
      p.style.opacity = '1';
    });
  }

  function ensureFlowerAt(x, y){
    // if there’s a nearby flower, use it; else create new
    const near = FLOWERS.find(f => {
      const dx = f.cx - x, dy = f.cy - y;
      return (dx*dx + dy*dy) < 42*42;
    });
    if(near) return near;
    const f = { cx:x, cy:y, stemEl:null, petals:[] };
    FLOWERS.push(f);
    return f;
  }

  // place by clicking stage (sets active center)
  let currentCenter = null;
  stage.addEventListener('click', (e)=>{
    const r = stage.getBoundingClientRect();
    currentCenter = { x: e.clientX - r.left, y: e.clientY - r.top };
  });

  addStemBtn?.addEventListener('click', ()=>{
    const c = currentCenter || { x: stage.clientWidth*0.5, y: stage.clientHeight*0.45 };
    const flower = ensureFlowerAt(c.x, c.y);
    if(!flower.stemEl){
      flower.stemEl = makeStem();
      stage.appendChild(flower.stemEl);
    }
    layout(flower);
  });

  addPetalBtn?.addEventListener('click', ()=>{
    const c = currentCenter || { x: stage.clientWidth*0.5, y: stage.clientHeight*0.45 };
    const flower = ensureFlowerAt(c.x, c.y);
    const petal = makePetal();
    petal.style.opacity = '0';
    stage.appendChild(petal);
    flower.petals.push(petal);
    layout(flower);
  });

  clearBtn?.addEventListener('click', ()=>{
    stage.innerHTML = '';
    FLOWERS.length = 0;
    currentCenter = null;
  });

})();
