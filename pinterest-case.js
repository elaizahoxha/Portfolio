/* ==============================
   METRIC COUNTER (scroll triggered)
================================ */

const counters = document.querySelectorAll('.metric h3');

const counterObserver = new IntersectionObserver((entries, observer) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      const counter = entry.target;
      const target = +counter.getAttribute('data-target');

      let count = 0;
      const speed = target / 120;

      const update = () => {

        count += speed;

        if (count < target) {

          counter.innerText = Math.floor(count).toLocaleString();
          requestAnimationFrame(update);

        } else {

          counter.innerText = target.toLocaleString();

        }

      };

      update();
      observer.unobserve(counter);

    }

  });

}, { threshold: 0.6 });

counters.forEach(counter => {

  counter.innerText = "0";
  counterObserver.observe(counter);

});



/* ==============================
   SCROLL REVEAL EFFECT
================================ */

const sections = document.querySelectorAll('.section');

const revealObserver = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0px)";

    }

  });

}, { threshold: 0.2 });

sections.forEach(section => {

  section.style.opacity = "0";
  section.style.transform = "translateY(40px)";
  section.style.transition = "all 0.8s ease";

  revealObserver.observe(section);

});



/* ==============================
   BOARD SPOTLIGHT EFFECT
================================ */

const boards = document.querySelectorAll(".board-card");

boards.forEach(card => {

  card.addEventListener("mouseenter", () => {

    boards.forEach(b => {

      b.style.opacity = "0.45";
      b.style.transform = "scale(0.98)";

    });

    card.style.opacity = "1";
    card.style.transform = "scale(1.03)";

  });

  card.addEventListener("mouseleave", () => {

    boards.forEach(b => {

      b.style.opacity = "1";
      b.style.transform = "scale(1)";

    });

  });

});