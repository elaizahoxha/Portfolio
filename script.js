// — reveal sections on scroll/load —
const sections = document.querySelectorAll('.section');
function revealOnScroll() {
  const triggerY = window.innerHeight * 0.85;
  sections.forEach(sec => {
    if (sec.getBoundingClientRect().top < triggerY) {
      sec.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// — projects‐tab toggling —
document.querySelectorAll('.projects-nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.projects-nav button')
      .forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.project-tab')
      .forEach(p => p.classList.toggle('active', p.dataset.tab === tab));
  });
});

// — dynamic footer year —
document.getElementById('year').textContent = new Date().getFullYear();

// — tsParticles init —
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
    modes: { repulse: { distance: 100, duration: 0.4 } }
  },
  detectRetina: true,
});

// — typewriter effect —
const twText = "Hi, I’m Elaiza";
const twEl   = document.getElementById("typewriter");
let twIndex  = 0, twForward = true;
function runTypewriter() {
  if (twForward) {
    if (twIndex < twText.length) {
      twEl.textContent += twText.charAt(twIndex++);
      setTimeout(runTypewriter, 100);
    } else {
      twForward = false;
      setTimeout(runTypewriter, 1200);
    }
  } else {
    if (twIndex > 0) {
      twEl.textContent = twText.substring(0, --twIndex);
      setTimeout(runTypewriter, 60);
    } else {
      twForward = true;
      setTimeout(runTypewriter, 800);
    }
  }
}
runTypewriter();

// — SERVICES tab & info switcher —
document.addEventListener('DOMContentLoaded', () => {
  const cards   = document.querySelectorAll('.services__cards .card');
  const tabs    = document.querySelectorAll('.services__nav button');
  const titleEl = document.getElementById('svc-title');
  const copyEl  = document.getElementById('svc-copy');

  const dataMap = Array.from(cards).reduce((map, card) => {
    const idx = card.dataset.idx;
    map[idx] = {
      title: card.querySelector('h3').textContent,
      copy:  card.querySelector('p').textContent
    };
    return map;
  }, {});

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.idx;
      tabs.forEach(b => b.classList.toggle('active', b === btn));
      cards.forEach(c => c.classList.toggle('active', c.dataset.idx === idx));
      const { title, copy } = dataMap[idx];
      titleEl.textContent  = title;
      copyEl.textContent   = copy;
    });
  });
});

// — sparkline chart —
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
