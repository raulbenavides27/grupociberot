document.addEventListener("DOMContentLoaded", () => {
  // Transición visible al entrar y salir de cada página interna.
  const reducePageMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.classList.add("page-enter");
  window.setTimeout(() => document.body.classList.remove("page-enter"), 700);

  let pageNavigationStarted = false;
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || reducePageMotion || pageNavigationStarted) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;

    event.preventDefault();
    pageNavigationStarted = true;
    document.body.classList.add("page-leaving");
    window.setTimeout(() => {
      window.location.assign(destination.href);
    }, 280);
  });

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

  // Carrusel de aliados: se conserva su comportamiento actual.
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

  // Apariciones diferenciadas por tipo de contenido.
  const motionGroups = [
    [".section-head", "slide-left"],
    [".section-mini-head", "soft"],
    [".company-card, .team-card, .partner-card", "scale"],
    [".services-grid article, .cases-grid article", "rise"],
    [".industries-grid article", "slide-right"],
    [".requirements article, .standard-card", "rise"],
    [".law-banner, .risk-panel, .method, .approach, .presence", "soft"],
    [".contact-info", "slide-left"],
    [".contact-form", "slide-right"]
  ];

  motionGroups.forEach(([selector, effect]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (element.closest(".hero")) return;
      element.dataset.reveal = effect;
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 85}ms`);
    });
  });

  const revealElements = document.querySelectorAll("[data-reveal]");
  if (!revealElements.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("js-motion");
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -45px 0px"
  });

  revealElements.forEach((element) => observer.observe(element));
});
