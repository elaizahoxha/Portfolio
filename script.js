// 1) Section reveal
const sections = document.querySelectorAll('.section');
const reveal = () => {
  const trigger = window.innerHeight * 0.85;
  sections.forEach(sec => {
    if (sec.getBoundingClientRect().top < trigger) {
      sec.classList.add('visible');
    }
  });
};
window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

// 2) Projects tab toggling
document.querySelectorAll('.projects-nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.projects-nav button')
      .forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.project-tab')
      .forEach(p => p.classList.toggle('active', p.dataset.tab === tab));
  });
});

// 3) Services card/info switcher
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.services__cards .card');
  const tabs  = document.querySelectorAll('.services__nav button');
  const titleEl = document.getElementById('svc-title');
  const copyEl  = document.getElementById('svc-copy');
  const dataMap = Array.from(cards).reduce((map, card) => {
    map[card.dataset.idx] = {
      title: card.querySelector('h3').textContent,
      copy:  card.querySelector('p').textContent
    };
    return map;
  }, {});
  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b=>b.classList.toggle('active', b===btn));
    cards.forEach(c=>c.classList.toggle('active', c.dataset.idx===btn.dataset.idx));
    const d = dataMap[btn.dataset.idx];
    titleEl.textContent = d.title;
    copyEl.textContent  = d.copy;
  }));
});

// 4) Sparkline chart
const ctx = document.getElementById('db-sparkline').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array(10).fill(''),
    datasets: [{
      data: [5,6,7,6,8,9,8,10,9,11],
      borderColor: '#333',
      borderWidth: 2,
      fill: false,
      pointRadius: 0
    }]
  },
  options: {
    animation: false,
    scales: { x: { display: false }, y: { display: false } },
    plugins: { legend: { display: false }, tooltip: { enabled: false } }
  }
});

// 5) Process steps animation
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.step-box').forEach(box => observer.observe(box));

// 6) tsParticles init
tsParticles.load("tsparticles", {
  particles: {
    number: { value: 80, density: { enable: true, area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    move: { enable: true, speed: 1, outModes: "out" }
  },
  interactivity: {
    events: { onHover: { enable: true, mode: "repulse" } },
    modes:    { repulse: { distance: 100, duration: 0.4 } }
  },
  detectRetina: true,
});

// 7) Typewriter effect
const TW = { text:"Hi, I’m Elaiza", el:document.getElementById("typewriter"), idx:0, forward:true };
(function type(){
  if(TW.forward){
    if(TW.idx < TW.text.length){
      TW.el.textContent += TW.text.charAt(TW.idx++);
      setTimeout(type,100);
    } else {
      TW.forward = false;
      setTimeout(type,1200);
    }
  } else {
    if(TW.idx > 0){
      TW.el.textContent = TW.text.substring(0,--TW.idx);
      setTimeout(type,60);
    } else {
      TW.forward = true;
      setTimeout(type,800);
    }
  }
})();

// 8) Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// 9) Carousel functionality
document.querySelectorAll('.carousel').forEach(carousel => {
  const imgs = Array.from(carousel.querySelectorAll('img'));
  let idx = imgs.findIndex(i => i.classList.contains('active'));
  carousel.querySelector('.prev').addEventListener('click', () => {
    imgs[idx].classList.remove('active');
    idx = (idx - 1 + imgs.length) % imgs.length;
    imgs[idx].classList.add('active');
  });
  carousel.querySelector('.next').addEventListener('click', () => {
    imgs[idx].classList.remove('active');
    idx = (idx + 1) % imgs.length;
    imgs[idx].classList.add('active');
  });
});
