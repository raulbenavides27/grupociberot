document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  navToggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();


  document.querySelectorAll(".partner-carousel").forEach((carousel) => {
    const track = carousel.querySelector(".partner-track");
    const cards = [...carousel.querySelectorAll(".partner-card")];
    const prev = carousel.querySelector(".partner-arrow-prev");
    const next = carousel.querySelector(".partner-arrow-next");
    const dots = [...carousel.querySelectorAll(".partner-dots button")];
    if (!track || !cards.length || !prev || !next) return;
    let current = 0;

    const getStep = () => {
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      return cards[0].getBoundingClientRect().width + gap;
    };
    const update = (index) => {
      current = Math.max(0, Math.min(index, cards.length - 1));
      track.style.transform = `translateX(-${current * getStep()}px)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
        dot.setAttribute("aria-current", i === current ? "true" : "false");
      });
      prev.disabled = current === 0;
      next.disabled = current === cards.length - 1;
    };
    prev.addEventListener("click", () => update(current - 1));
    next.addEventListener("click", () => update(current + 1));
    dots.forEach((dot, i) => dot.addEventListener("click", () => update(i)));
    window.addEventListener("resize", () => update(current));
    update(0);
  });
});
