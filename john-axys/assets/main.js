/* CoachJSD — interactions: nav, mobile menu, scroll reveal, FAQ, filters, counters */
(function () {
  "use strict";

  /* Sticky nav shadow on scroll */
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const burger = document.querySelector(".burger");
  if (burger) {
    burger.addEventListener("click", () =>
      document.body.classList.toggle("menu-open")
    );
    document.querySelectorAll(".mobile-menu a").forEach((a) =>
      a.addEventListener("click", () => document.body.classList.remove("menu-open"))
    );
  }

  /* Scroll reveal */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* Animated counters */
  const counters = document.querySelectorAll("[data-count]");
  const cio = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const dec = (el.dataset.count.split(".")[1] || "").length;
        const dur = 1400;
        const start = performance.now();
        const fmt = (n) =>
          n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => cio.observe(c));

  /* FAQ accordion */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    q.addEventListener("click", () => {
      const open = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((o) => o.classList.remove("open"));
      if (!open) item.classList.add("open");
    });
  });

  /* Transformation / testimonial filters */
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const buttons = group.querySelectorAll("[data-filter]");
    const targetSel = group.dataset.filterGroup;
    const items = document.querySelectorAll(targetSel + " [data-tags]");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const f = btn.dataset.filter;
        items.forEach((it) => {
          const show = f === "all" || (it.dataset.tags || "").split(",").includes(f);
          it.style.display = show ? "" : "none";
        });
      });
    });
  });

  /* Current year in footer */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
