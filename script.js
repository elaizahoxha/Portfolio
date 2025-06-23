// reveal sections on scroll/load
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

// basic project‐tab toggling
document.querySelectorAll('.projects-nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    // toggle button states
    document.querySelectorAll('.projects-nav button')
      .forEach(b => b.classList.toggle('active', b === btn));
    // toggle tab panes
    document.querySelectorAll('.project-tab')
      .forEach(p => p.classList.toggle('active', p.dataset.tab === tab));
  });
});
