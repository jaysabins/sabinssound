# sabinssound.com

Business site for Sabins Sound (Jay Sabins): tools and sound libraries. Sister site to the portfolio jaysabinsaudio.com (repo jaysabins/jaysabinsaudio), which links here once, in its footer.

## Rules

- Plain HTML/CSS/JS, no build step, no dependencies. GitHub Pages only, $0. No Netlify/Cloudflare/paid services.
- Never invent claims, numbers, features, testimonials, prices, versions, or credits. Leave a `class="todo"` callout (shown on previews only) and ask Jay.
- No "LLC" in copy unless Jay says otherwise.
- Repo is public, including history. Commit only what Jay has cleared.
- Branches: work on `staging` (deploys to the secret `/<STAGING_PATH>/` folder, noindex). `main` is live and changes only through a PR Jay approves.
- Product cards (home, tools index) have no platform/tag line above the title. Jay asked for that on 2026-11-01.
- Keep all paths relative (except `404.html`) so pages work at `/`, in the staging folder, and so `tools/` could later move to tools.sabinssound.com.

## Design

Same tokens as the portfolio (`css/tokens.css`, direction 6A): dark single theme, Sora + Fira Code, jade accent `#3fc48a` with neon glow. This site goes further than the portfolio: hero art, animated waveform, sync diagram, card tilt, scroll reveal. All motion respects `prefers-reduced-motion`. Section headings are one word plus an accent slash.

## Quality bar

390px width with no horizontal scroll, visible focus states, alt text / titles on images, contrast checked against the accent.
