# sabinssound.com

Sabins Sound: tools and sound libraries by Jay Sabins. Static HTML/CSS/JS, no build step, hosted free on GitHub Pages.

## Pages

- `index.html`: home (full-screen splash with image, featured tool, about, and placeholder sections for libraries, services, contact).
- `tools/index.html`: all tools.
- `tools/rigsync/index.html`: RigSync product page.
- `404.html`: not-found page (absolute links, because it's served at any path).
- `holding/index.html`: pre-launch page. While this folder exists on `main`, the live address shows it.

## Editing

Content is plain HTML in each page. Shared styles are `css/tokens.css` (colors, fonts, spacing, same as jaysabinsaudio.com) and `css/site.css`. `js/site.js` handles motion and preview mode.

Missing details are tracked as `<!-- TODO: ... -->` comments in the HTML (search for `TODO`), never shown on the page. Sections still waiting on content (`todo-section`, nav links `preview-only`) show their heading on staging and are hidden on the live site. Still needed from Jay:

- Site: tagline / one-line pitch, sound libraries to list, services (if any), business contact email, logo or wordmark preference, OG image.
- RigSync: price or free, current version, system requirements, license, screenshots or demo video, setup steps, FAQ and support contact.
- Tools page: intro line (optional), other tools to list.

`js/design-panel.js` is the design-time panel (bottom-right dot on previews): accent, glow, background, card color, fonts. Delete it and its `<script>` tags before launch, once values are set in `tokens.css`.

## Hero image

The home splash image is set inline on `.splash-img` in `index.html`. Options live in `assets/hero/` (original SVG art). Jay narrowed it to Vista valley; the staging picker cycles it and its variations (`valley-dawn`, `valley-night`, `valley-mist`, `valley-twilight`). Earlier options (`pixel-sunset`, `pixel-night`, `vista-dusk`, `placeholder`) are still in the folder. On staging, the picker on the splash lets you try each one; it never shows on the live site. Once one is chosen, set it in `index.html` and delete the picker block in `js/site.js` and the unused images.

## Local preview

    python3 -m http.server 8000

Then open http://localhost:8000. All paths are relative (except `404.html`) so the same files work at `/` and in the staging folder.

## Deploy

`.github/workflows/pages.yml` builds one Pages site from two branches:

- `main` → `/` (live). Changes reach `main` only through a PR Jay approves.
- `staging` → `/<STAGING_PATH>/`, a long random folder name kept in a repo secret, so it isn't in any public file or log. Every staging page gets `noindex` and `no-referrer`.

The staging address is hidden, not locked: anyone who has the link can open it, and the `staging` branch's files are readable in the public repo. Don't put anything on staging that would be a problem if it went public.

### One-time setup

1. Repo must be public (Pages on a private repo needs a paid plan).
2. Settings → Pages → Source: **GitHub Actions**.
3. Settings → Secrets and variables → Actions → New repository secret: `STAGING_PATH` = a long random string (letters, digits, `-`, `_`). The deploy fails on purpose without it.
4. Settings → Environments → `github-pages` → Deployment branches: allow `main` and `staging`.
5. Custom domain: Settings → Pages → Custom domain `sabinssound.com`, then Enforce HTTPS. At Namecheap (Advanced DNS):
   - `A` records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `AAAA` records for `@`: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
   - `CNAME` for `www` → `jaysabins.github.io`

To launch: delete `holding/` on `main`.

To change the staging address (e.g. if the link leaked): update the `STAGING_PATH` secret and re-run the workflow. The old address stops working on the next deploy.
