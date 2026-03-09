document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------
  Scroll Reveal
  ------------------------- */

  const sections = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));


  /* -------------------------
  Hero Parallax Motion
  ------------------------- */

  const hero = document.querySelector("#hero");

  window.addEventListener("scroll", () => {

    const offset = window.scrollY * 0.15;

    hero.style.transform = `translateY(${offset}px)`;

  });


  /* -------------------------
  Floating Card Motion
  ------------------------- */

  const cards = document.querySelectorAll(".persona-card, .mockup-card");

  cards.forEach(card => {

    card.addEventListener("mousemove", e => {

      const rect = card.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y / rect.height) - 0.5) * 6;
      const rotateY = ((x / rect.width) - 0.5) * -6;

      card.style.transform =
        `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

    });

    card.addEventListener("mouseleave", () => {

      card.style.transform = "";

    });

  });

});