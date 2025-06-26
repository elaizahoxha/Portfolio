
const sections = document.querySelectorAll('section');

// Reset scroll position to top on reload (clears URL hash)
if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
    window.scrollTo(0, 0);
  }
  

function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      // Only add .visible if it's not already there
      if (sectionTop < triggerBottom && !section.classList.contains('visible')) {
        section.classList.add('visible');
      }
      // Do NOT remove .visible, so animation only happens once
    });
  }
  
  
  

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

document.getElementById('year').textContent = new Date().getFullYear();


// Typewriter effect for hero section
const typewriterText = "Hi, I’m Elaiza";
const typewriterEl = document.getElementById('typewriter');
let typewriterIndex = 0;
let typingForward = true;

function runTypewriter() {
  if (typingForward) {
    if (typewriterIndex < typewriterText.length) {
      typewriterEl.textContent += typewriterText.charAt(typewriterIndex);
      typewriterIndex++;
      setTimeout(runTypewriter, 100); // Typing speed
    } else {
      typingForward = false;
      setTimeout(runTypewriter, 1200); // Pause at end
    }
  } else {
    if (typewriterIndex > 0) {
      typewriterEl.textContent = typewriterText.substring(0, typewriterIndex - 1);
      typewriterIndex--;
      setTimeout(runTypewriter, 60); // Erase speed
    } else {
      typingForward = true;
      setTimeout(runTypewriter, 800); // Pause at start
    }
  }
}
runTypewriter();

// ─── SERVICES TAB SWITCHER (append to script.js) ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.services__cards .card');
    const tabs  = document.querySelectorAll('.services__nav button');
  
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.idx;
        // toggle active on nav pills
        tabs.forEach(b => b.classList.toggle('active', b === btn));
        // toggle active on cards
        cards.forEach(c => c.classList.toggle('active', c.dataset.idx === idx));
      });
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const stepBoxes = document.querySelectorAll('.process-steps .step-box');
    const observer  = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
  
    stepBoxes.forEach(box => observer.observe(box));
  });
  

  // ─── SERVICES TAB + INFO SWITCHER ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const cards      = document.querySelectorAll('.services__cards .card');
    const tabs       = document.querySelectorAll('.services__nav button');
    const titleEl    = document.getElementById('svc-title');
    const copyEl     = document.getElementById('svc-copy');
    const linkEl     = document.getElementById('svc-link');
  
    // For each card, stash its heading & copy
    const dataMap = Array.from(cards).reduce((map, card) => {
      const idx  = card.dataset.idx;
      const h3   = card.querySelector('h3').textContent;
      const txt  = card.querySelector('p').textContent;
      map[idx]   = { title: h3, copy: txt };
      return map;
    }, {});
  
    // Click handler
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = btn.dataset.idx;
  
        // 1) toggle nav pills
        tabs.forEach(b => b.classList.toggle('active', b === btn));
  
        // 2) toggle cards
        cards.forEach(c => c.classList.toggle('active', c.dataset.idx === idx));
  
        // 3) update info panel
        const { title, copy } = dataMap[idx];
        titleEl.textContent   = title;
        copyEl.textContent    = copy;
        // optionally: update link href to point at a specific project anchor
        // linkEl.href = #project-${idx};
      });
    });
  });


  // ─── Project Tabs ─────────────────────────────────────────────
document.querySelectorAll('.projects-nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      // toggle active button
      document.querySelectorAll('.projects-nav button')
        .forEach(b => b.classList.toggle('active', b === btn));
      // toggle panes
      document.querySelectorAll('.project-tab')
        .forEach(p => p.classList.toggle('active', p.dataset.tab === tab));
    });
  });
  
  // ─── Simple Carousel Logic ────────────────────────────────────
  document.querySelectorAll('.carousel').forEach(carousel => {
    const imgs = Array.from(carousel.querySelectorAll('img'));
    let idx = imgs.findIndex(i => i.classList.contains('active'));
    carousel.querySelector('.prev').onclick = () => {
      imgs[idx].classList.remove('active');
      idx = (idx - 1 + imgs.length) % imgs.length;
      imgs[idx].classList.add('active');
    };
    carousel.querySelector('.next').onclick = () => {
      imgs[idx].classList.remove('active');
      idx = (idx + 1) % imgs.length;
      imgs[idx].classList.add('active');
    };
  });
  

  // script.js
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

  

  // Sparkline for DB card
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


// ─── Staggered reveal for “My Workflow” ─────────────────────────
window.addEventListener('scroll', function revealWorkflow() {
    const section = document.getElementById('process');
    const triggerPoint = window.innerHeight * 0.85;
    if (section.getBoundingClientRect().top < triggerPoint) {
      const steps = document.querySelectorAll('.process-steps .step-box');
      steps.forEach((step, idx) => {
        setTimeout(() => {
          step.classList.add('visible');
        }, idx * 500);  // 0ms, 500ms, 1000ms, 1500ms, 2000ms
      });
      window.removeEventListener('scroll', revealWorkflow);
    }
  });