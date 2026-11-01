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

  // Phone menu: a hamburger button that opens the nav as a dropdown (CSS shows it at <=760px).
  // Built here so pages without JS still get the plain nav links.
  const nav = header && header.querySelector("nav");
  if (nav) {
    nav.id = nav.id || "site-nav";
    const btn = document.createElement("button");
    btn.className = "menu-toggle";
    btn.type = "button";
    btn.setAttribute("aria-controls", nav.id);
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Menu");
    btn.innerHTML = '<span></span><span></span><span></span>';
    nav.before(btn);
    header.classList.add("has-menu");
    const setOpen = (open) => {
      header.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", String(open));
    };
    btn.addEventListener("click", () => setOpen(!header.classList.contains("menu-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.classList.contains("menu-open")) { setOpen(false); btn.focus(); }
    });
    document.addEventListener("click", (e) => { if (!header.contains(e.target)) setOpen(false); });
  }
  // Light/dark switch in the header: shows a moon in dark mode and a sun in light mode.
  // The choice is saved per visitor; a tiny script in each page's <head> applies it before paint.
  if (header) {
    const KEY = "theme";
    const moon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></svg>';
    const sun = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    const tbtn = document.createElement("button");
    tbtn.className = "theme-toggle";
    tbtn.type = "button";
    const meta = document.querySelector('meta[name="theme-color"]');
    const apply = (light, save) => {
      if (light) root.dataset.theme = "light"; else delete root.dataset.theme;
      tbtn.innerHTML = light ? sun : moon;
      tbtn.setAttribute("aria-label", light ? "Light mode on. Switch to dark mode" : "Dark mode on. Switch to light mode");
      tbtn.title = light ? "Switch to dark mode" : "Switch to light mode";
      if (meta) meta.content = getComputedStyle(root).getPropertyValue("--bg").trim() || meta.content;
      if (save) try { localStorage.setItem(KEY, light ? "light" : "dark"); } catch {}
    };
    apply(root.dataset.theme === "light", false);
    tbtn.addEventListener("click", () => apply(root.dataset.theme !== "light", true));
    header.querySelector(".wrap").append(tbtn);
  }
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Waveform bars behind the hero: a smooth, fixed shape (no randomness, so it looks the same every load)
  document.querySelectorAll(".wave").forEach((wave) => {
    const n = 72;
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
    const els = document.querySelectorAll("main .section > h2, main .grid > li, main .feature, main .specs, main .band, main .prose, main .about");
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
