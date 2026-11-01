// Design-time panel: accent, glow strength, background, card color, and fonts.
// Shows on previews only (window.SITE_PREVIEW, set by js/site.js): staging and local, never the live site.
// Remove before launch once the values are chosen and set in tokens.css.
(() => {
  if (!window.SITE_PREVIEW) return;

  const KEY = "sabinssound-design-panel";
  const swatches = [
    ["Cyan", "#04d9ff"], ["Blue", "#14a7ff"], ["Petrol", "#3a9fb8"], ["Lagoon", "#3cbfe8"], ["Cobalt", "#4c6fff"],
    ["Periwinkle", "#9aa6ff"], ["Verdigris", "#6fb0a0"], ["Jade", "#3fc48a"], ["Seafoam", "#b4e8d4"],
    ["Amber", "#f2b544"],
  ];
  // Google Fonts: [family, weights to load]. Not every family has every weight.
  const sans = [
    ["Sora", "300;400;500;600"], ["Inter", "300;400;500;600"], ["Space Grotesk", "300;400;500;600"],
    ["Manrope", "300;400;500;600"], ["DM Sans", "300;400;500;600"], ["Outfit", "300;400;500;600"],
    ["Plus Jakarta Sans", "300;400;500;600"], ["Archivo", "300;400;500;600"], ["IBM Plex Sans", "300;400;500;600"],
    ["Work Sans", "300;400;500;600"], ["Lexend", "300;400;500;600"], ["Rubik", "300;400;500;600"],
    ["Unbounded", "300;400;500;600"], ["Syne", "400;500;600"], ["Chakra Petch", "300;400;500;600"],
    ["Rajdhani", "300;400;500;600"],
  ];
  const monos = [
    ["Fira Code", "300;400;500;600"], ["JetBrains Mono", "300;400;500;600"], ["IBM Plex Mono", "300;400;500;600"],
    ["Roboto Mono", "300;400;500;600"], ["DM Mono", "300;400;500"], ["Space Mono", "400;700"],
    ["Source Code Pro", "300;400;500;600"], ["Red Hat Mono", "300;400;500;600"], ["Martian Mono", "300;400;500;600"],
    ["Azeret Mono", "300;400;500;600"], ["Geist Mono", "300;400;500;600"], ["Spline Sans Mono", "300;400;500;600"],
    ["Ubuntu Mono", "400;700"],
  ];
  const weights = Object.fromEntries([...sans, ...monos]);
  const loaded = new Set(["Sora", "Fira Code"]);
  const loadFont = (f) => {
    if (loaded.has(f) || !weights[f]) return;
    loaded.add(f);
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = `https://fonts.googleapis.com/css2?family=${f.replace(/ /g, "+")}:wght@${weights[f]}&display=swap`;
    document.head.append(l);
  };
  const isMono = new Set(monos.map(([f]) => f));
  const fallback = (f) => (isMono.has(f) ? "ui-monospace, monospace" : "system-ui, sans-serif");
  const first = (v) => v.split(",")[0].trim().replace(/^["']|["']$/g, "");
  // Every font in every dropdown, grouped so it's clear which are monospace.
  const group = (label, list) => `<optgroup label="${label}">${list.map(([f]) => `<option>${f}</option>`).join("")}</optgroup>`;
  const options = group("Sans", sans) + group("Monospace", monos);

  const root = document.documentElement;
  const css = getComputedStyle(root);
  const defaults = {
    accent: css.getPropertyValue("--accent").trim(),
    glow: parseFloat(css.getPropertyValue("--glow")) || 0,
    bg: css.getPropertyValue("--bg").trim(),
    surface: css.getPropertyValue("--surface").trim(),
    title: first(css.getPropertyValue("--title")),
    body: first(css.getPropertyValue("--body")),
    mono: first(css.getPropertyValue("--mono")),
  };

  const lum = (hex) => {
    const c = hex.replace("#", "").match(/../g).map((h) => parseInt(h, 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

  const panel = document.createElement("div");
  panel.className = "ap";
  panel.innerHTML = `
    <button class="ap-toggle" type="button" aria-expanded="false" aria-label="Design colors"><span class="ap-dot"></span></button>
    <div class="ap-body" hidden>
      <p class="ap-title">Accent</p>
      <div class="ap-swatches">${swatches.map(([n, c]) => `<button type="button" class="ap-sw" data-c="${c}" title="${n} ${c}" aria-label="${n}" style="background:${c}"></button>`).join("")}</div>
      <label class="ap-row">Custom accent <input type="color" data-k="accent"></label>
      <label class="ap-row ap-slider">Glow <input type="range" min="0" max="100" step="1" data-k="glow"><span class="ap-val"></span></label>
      <label class="ap-row">Background <input type="color" data-k="bg"></label>
      <label class="ap-row">Cards <input type="color" data-k="surface"></label>
      <p class="ap-title ap-gap">Fonts</p>
      <label class="ap-row">Headings <select data-k="title">${options}</select></label>
      <label class="ap-row">Body <select data-k="body">${options}</select></label>
      <label class="ap-row">Data <select data-k="mono">${options}</select></label>
      <p class="ap-hex"></p>
      <button type="button" class="ap-reset">Reset all</button>
    </div>`;
  const style = document.createElement("style");
  style.textContent = `
    .ap{position:fixed;right:16px;bottom:16px;z-index:1000;font:400 13px/1.4 var(--body);color:var(--fg)}
    .ap-toggle{width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:var(--surface);display:grid;place-items:center;cursor:pointer;margin-left:auto}
    .ap-dot{width:20px;height:20px;border-radius:50%;background:var(--accent);box-shadow:var(--glow-box)}
    .ap-body{position:absolute;right:0;bottom:56px;width:248px;max-height:calc(100vh - 88px);overflow-y:auto;padding:14px;background:var(--surface);border:1px solid var(--line);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.35)}
    .ap-title{margin:0 0 10px;font-weight:600}
    .ap-gap{margin:18px 0 0}
    .ap-row select{width:140px;font:400 13px var(--body);color:var(--fg);background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:5px 6px}
    .ap-swatches{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
    .ap-sw{aspect-ratio:1;border-radius:50%;border:2px solid transparent;cursor:pointer;padding:0;min-height:32px}
    .ap-sw[aria-pressed="true"]{border-color:var(--fg)}
    .ap-row{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px;color:var(--muted)}
    .ap-row input[type=color]{width:44px;height:32px;border:0;background:none;padding:0;cursor:pointer}
    .ap-slider input{flex:1;accent-color:var(--accent)}
    .ap-val{width:34px;text-align:right;font:400 12px var(--mono)}
    .ap-hex{margin:12px 0 0;font:400 12px/1.5 var(--mono);color:var(--muted);user-select:all;white-space:pre-line}
    .ap-reset{margin-top:10px;background:none;border:1px solid var(--line);border-radius:6px;color:var(--fg);padding:6px 10px;cursor:pointer;font:inherit}`;
  document.head.append(style);
  document.body.append(panel);

  const body = panel.querySelector(".ap-body"), toggle = panel.querySelector(".ap-toggle");
  const field = (k) => panel.querySelector(`[data-k="${k}"]`);
  let state = { ...defaults };

  function render(save) {
    // Only override a token when it differs from the page's own value, so the light/dark switch still works.
    const set = (k, v, d) => (v === d ? root.style.removeProperty(k) : root.style.setProperty(k, v));
    set("--accent", state.accent, defaults.accent);
    if (state.accent === defaults.accent && state.bg === defaults.bg) root.style.removeProperty("--accent-ink");
    else root.style.setProperty("--accent-ink", contrast(state.accent, state.bg) >= contrast(state.accent, "#ffffff") ? state.bg : "#ffffff");
    set("--glow", String(state.glow), String(defaults.glow));
    set("--bg", state.bg, defaults.bg);
    set("--surface", state.surface, defaults.surface);
    ["title", "body", "mono"].forEach((k) => {
      loadFont(state[k]);
      if (state[k] === defaults[k]) root.style.removeProperty(`--${k}`);
      else root.style.setProperty(`--${k}`, `"${state[k]}", ${fallback(state[k])}`);
      field(k).value = state[k];
    });
    field("accent").value = state.accent;
    field("glow").value = Math.round(state.glow * 100);
    panel.querySelector(".ap-val").textContent = `${Math.round(state.glow * 100)}%`;
    field("bg").value = state.bg;
    field("surface").value = state.surface;
    panel.querySelectorAll(".ap-sw").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.c === state.accent)));
    panel.querySelector(".ap-hex").textContent =
      `accent  ${state.accent}  (${contrast(state.accent, state.bg).toFixed(1)}:1)\nglow    ${state.glow.toFixed(2)}\nbg      ${state.bg}\ncards   ${state.surface}\nheads   ${state.title}\nbody    ${state.body}\ndata    ${state.mono}`;
    if (save) try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }

  toggle.addEventListener("click", () => {
    body.hidden = !body.hidden;
    toggle.setAttribute("aria-expanded", String(!body.hidden));
  });
  panel.querySelectorAll(".ap-sw").forEach((b) => b.addEventListener("click", () => { state.accent = b.dataset.c; render(true); }));
  ["accent", "bg", "surface", "title", "body", "mono"].forEach((k) => field(k).addEventListener("input", (e) => { state[k] = e.target.value; render(true); }));
  field("glow").addEventListener("input", (e) => { state.glow = e.target.value / 100; render(true); });
  panel.querySelector(".ap-reset").addEventListener("click", () => {
    try { localStorage.removeItem(KEY); } catch {}
    state = { ...defaults };
    render(false);
  });

  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch {}
  render(false);
})();
