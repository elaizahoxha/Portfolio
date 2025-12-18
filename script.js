
/* ---------------------------------------
   ✔ Safe event attachment helper
----------------------------------------- */
function safeOn(el, event, handler, options) {
  if (el) el.addEventListener(event, handler, options || { passive: true });
}

/* ---------------------------------------
   ✔ Safe query helper
----------------------------------------- */
function $(selector, parent = document) {
  return parent.querySelector(selector);
}

function $all(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

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

  /* 3D tilt */
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

  /* auto-rotate */
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

/* carousels */
document.querySelectorAll('.carousel:not([data-carousel="pinterest"])').forEach(carousel=>{  const imgs = Array.from(carousel.querySelectorAll('img'));
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




















 /* ==========================================
   FIX — Pinterest Carousel Looping ONLY
   ========================================== */
   document.querySelectorAll('.carousel[data-carousel="pinterest"]').forEach(carousel => {  const imgs = Array.from(carousel.querySelectorAll('img'));
  if (!imgs.length) return;

  let idx = imgs.findIndex(i => i.classList.contains('active'));
  if (idx < 0) idx = 0;

  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');

  function show(newIndex) {
    imgs[idx].classList.remove('active');
    idx = (newIndex + imgs.length) % imgs.length; // 💫 infinite loop
    imgs[idx].classList.add('active');
  }

  prev?.addEventListener('click', () => show(idx - 1));
  next?.addEventListener('click', () => show(idx + 1));
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

/* simple page transition */
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

 






/* ===========================================================
   FINAL UI BEHAVIORS + GLOBAL EVENT HELPERS
   These were originally located after your AMI builder section.
   Cleaned, stabilized, and kept intact.
   =========================================================== */

/* ---------------------------------------
   ✨ Smooth fade-in on page load
----------------------------------------- */
window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
});


/* ---------------------------------------
   ✨ Auto-highlight navigation links
----------------------------------------- */
(function() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav a[href^='#']");

  if (!sections.length || !navLinks.length) return;

  function updateNavHighlight() {
    let scrollPos = document.documentElement.scrollTop || document.body.scrollTop;

    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const bottom = top + sec.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(a => a.classList.remove("active"));
        const match = document.querySelector(`nav a[href="#${sec.id}"]`);
                match?.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateNavHighlight, { passive: true });
  updateNavHighlight();
})();


/* ---------------------------------------
   ✨ Lazy-load images
----------------------------------------- */
(function() {
  const lazyImages = document.querySelectorAll("img[data-src]");
  if (!lazyImages.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        io.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => io.observe(img));
})();


/* ---------------------------------------
   ✨ Mobile menu toggle
----------------------------------------- */
(function() {
  const btn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".mobile-nav");

  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    nav.classList.toggle("open");
    btn.classList.toggle("open");
  });
})();


/* ---------------------------------------
   ✨ Simple modal handler (general use)
----------------------------------------- */
(function() {
  document.querySelectorAll("[data-open-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.openModal);
      target?.setAttribute("aria-hidden", "false");
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".modal");
      parent?.setAttribute("aria-hidden", "true");
    });
  });
})();


/* ---------------------------------------
   ✨ Soft scroll-to element
----------------------------------------- */
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;

  window.scrollTo({
    top: el.offsetTop - 70,
    behavior: "smooth",
  });
}


/* ---------------------------------------
   ✨ Auto-expand accordion lists
----------------------------------------- */
(function() {
  const accord = document.querySelectorAll(".accordion");

  accord.forEach(acc => {
    const header = acc.querySelector(".accordion-header");
    header?.addEventListener("click", () => {
      acc.classList.toggle("open");
    });
  });
})();


/* ---------------------------------------
   ✨ Soft blur-on-scroll fade effect
----------------------------------------- */
(function() {
  const blurItems = document.querySelectorAll("[data-blur-scroll]");
  if (!blurItems.length) return;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    blurItems.forEach(el => {
      const intensity = Math.min(12, y / 90).toFixed(1);
      el.style.backdropFilter = `blur(${intensity}px)`;
      el.style.opacity = 1 - Math.min(0.6, y / 900);
    });
  }, { passive: true });
})();


/* ---------------------------------------
   ✨ Backdrop cursor shimmer for aesthetic
----------------------------------------- */
(function() {
  const spark = document.getElementById("cursor-spark");
  if (!spark) return;

  document.addEventListener("mousemove", (e) => {
    spark.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });
})();



/* ---------------------------------------
   ✨ Footer year updater (backup)
----------------------------------------- */
(function() {
  const y = document.querySelector(".footer-year");
  if (y) y.textContent = new Date().getFullYear();
})();













/* ===========================================================
   FINAL SCRIPT SAFETY + GLOBAL INTEGRITY GUARDS
   Ensures stability, prevents console noise, and guards all
   dynamic features from crashing if HTML updates.
   =========================================================== */





/* ---------------------------------------
   ✔ Idle Callback Fallback
----------------------------------------- */
if (typeof window.requestIdleCallback !== "function") {
  window.requestIdleCallback = function (fn) {
    return setTimeout(fn, 200);
  };
}



/* ---------------------------------------
   ✔ Console error softener
----------------------------------------- */
(function() {
  const originalError = console.error;
  console.error = function(...args) {
    if (
      args[0] &&
      typeof args[0] === "string" &&
      args[0].includes("null") &&
      args[0].includes("addEventListener")
    ) {
      // Suppress harmless null-target errors
      return;
    }
    originalError.apply(console, args);
  };
})();

/* ---------------------------------------
   ✔ Page fully initialized notification
----------------------------------------- */
document.documentElement.setAttribute("data-js-ready", "true");

/* ---------------------------------------
   END OF FILE
----------------------------------------- */






