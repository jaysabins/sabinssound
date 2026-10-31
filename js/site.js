// Shared behaviour for every page. No dependencies.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Preview = staging (pages marked noindex by the deploy) or any host that isn't the live site.
  // Previews show the amber TODO callouts and the design panel; the live site never does.
  const noindex = !!document.querySelector('meta[name="robots"][content*="noindex"]');
  const live = /(^|\.)sabinssound\.com$/.test(location.hostname) && !noindex;
  if (!live) root.classList.add("preview");
  window.SITE_PREVIEW = !live;

  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Header gets a hairline once the page scrolls
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Waveform bars behind the hero: a smooth, fixed shape (no randomness, so it looks the same every load)
  document.querySelectorAll(".wave").forEach((wave) => {
    const n = innerWidth < 600 ? 36 : 72;
    wave.innerHTML = Array.from({ length: n }, (_, i) => {
      const t = i / (n - 1);
      const h = 0.18 + 0.82 * Math.abs(Math.sin(t * Math.PI * 3.1) * Math.sin(t * Math.PI) * (0.65 + 0.35 * Math.cos(t * 17)));
      return `<span style="--h:${h.toFixed(3)};--i:${i}"></span>`;
    }).join("");
  });

  // SVG illustrations animate with SMIL; freeze them for reduced motion
  if (reduced) document.querySelectorAll("svg.sync").forEach((s) => s.pauseAnimations && s.pauseAnimations());

  // Linked cards lift and tilt to face the pointer (mouse/pen only)
  if (!reduced && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll("a.card").forEach((card) => {
      let frame = 0;
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          card.style.setProperty("--tx", x.toFixed(3));
          card.style.setProperty("--ty", y.toFixed(3));
        });
      });
      card.addEventListener("pointerleave", () => {
        cancelAnimationFrame(frame);
        card.style.setProperty("--tx", 0);
        card.style.setProperty("--ty", 0);
      });
    });
  }

  // Content fades and rises in as it scrolls into view, once, staggered
  if (!reduced && "IntersectionObserver" in window) {
    const els = document.querySelectorAll("main .section > h2, main .grid > li, main .feature, main .specs, main .band, main .prose");
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, n) => {
        e.target.style.transitionDelay = `${n * 80}ms`;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }
})();
