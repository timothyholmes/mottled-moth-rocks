# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Jekyll static site — personal blog plus music releases for Mottled Moth / Cosmic Strain. Served at
`mottledmoth.rocks` (see `CNAME`). `.github/` contains only `dependabot.yml`; there is no build
workflow in the repo, so publishing goes through GitHub Pages' own build of the default branch.

## Commands

```bash
bundle install                  # install dependencies
bundle exec jekyll serve        # serve at localhost:4000
bundle exec jekyll serve --drafts   # include _drafts/
```

Spell-check prose (the only lint in the project — there is no test suite):

```bash
gem install mdspell
mdspell */**/*.md --config ./.mdspell.yml
```

`.mdspell.yml` is a long allowlist of proper nouns and jargon; add new ones there rather than
rewording posts.

Ruby is managed with chruby — see `README.md` for setup. If `bundle exec jekyll` fails with
`Bundler::GemNotFound`, the gems aren't installed in the active Ruby; run `bundle install` before
assuming anything is broken.

## Architecture

### Layouts own their own `<head>`

There is no shared head partial. Each of the five files in `_layouts/` repeats the full
`<!doctype html>`, font preconnects, GoatCounter snippet, and — critically — its own explicit list of
`<link rel="stylesheet">` tags. **Adding or renaming a stylesheet means editing every layout that
needs it.** The lists are not identical:

- `blog.css` is loaded only by `blog` and `blog-post`; `syntax.css` only by `blog-post`.
- `default`, `landing`, and `goodbye` share one list: `base`, `layout`, `components`, `animations`,
  `responsive`.
- `goodbye.html` is fully standalone: it inlines its own header and does not use `_includes/`.
  `goodbye.md` is nothing but front matter.

`_includes/` holds only `header.html` (wordmark + nav) and `footer.html`.

### The landing page is hand-maintained

`index.md` is empty front matter pointing at `_layouts/landing.html`. That layout hardcodes the
tagline links and the entire "Latest Releases" section as literal markup. Only "Latest Post" is
dynamic (`site.posts limit:1`). Publishing a release means editing the layout, not adding data.

### Posts

`_posts/YYYY-MM-DD-slug.md`, with `layout: blog-post`. Every post carries an explicit `permalink`, so
the filename and `categories` do **not** determine the URL — existing permalinks vary in shape
(`/system/2024/08/14/virtues.html`, `/creativity/guitar-gear-2.html`, `/2026-02-16/challenges.html`).
Pick one deliberately; changing it breaks links.

`description` and `previewImage` are load-bearing: the blog index and the landing card both render
them. A post without them degrades silently.

`categories` uses a consistent taxonomy — `system`, `creativity`, `project`, `lore`, `knowledge`,
`annual` — that **nothing in the UI surfaces**. There is no tag page, filter, or archive.

Images live in `assets/images/`; newer posts use a per-post subdirectory
(`assets/images/2025-07-16-sarcoma/`), older ones sit flat with a `*-small` variant used as the
`previewImage`.

### Pagination

`jekyll-paginate`, 7 per page, `/blog/page:num/`. The paginator only works from an `.html` page,
which is why `blog/index.html` is HTML rather than Markdown.

### CSS

Hand-written, no framework and no preprocessor. Load order matters and is set by each layout —
`responsive.css` is always last so it can win.

**All color flows through design tokens in `base.css`.** A `:root` block defines a raw `--color-*`
palette (forest, cream, tan, ink, parchment) plus semantic tokens (`--bg`, `--fg`, `--link`,
`--accent`, `--shadow-color`, the `--nav-*` set), and a single `prefers-color-scheme: light` media
query re-points them. Do not hardcode a color anywhere else — `base.css` is the only file that should
contain a literal. Landing cards derive from the page (`background: var(--fg); color: var(--bg)`), so
one rule is correct in both themes.

The text column is a container, not viewport padding: `--measure` and `--gutter` in `base.css` drive
one rule in `layout.css` applied to `.page-header` / `.page-body`. `responsive.css` is now **type
scale only** — do not reintroduce layout padding there.

The visual signature is a 2px border plus a hard, un-blurred offset shadow
(`var(--shadow-offset) 0 var(--shadow-color)`) that collapses to `none` on hover; it is shared by
`.nav-item` and `.landing-card`.

Blog thumbnails are `clip-path`-masked into six shapes cycling via
`.blog-list > li:nth-child(6n + k)`: star, hexagon, asterisk, diamond, burst, cross. That order is
deliberate — it alternates spiked and flat-sided masks so the three star-like shapes never sit next
to each other. The `--shape-*` polygons live in `blog.css`, deliberately **not** in `base.css`, since
only the blog layouts load that file.

The spiked polygons alternate a 50% outer radius with an inner radius that controls how much of the
photo survives in the middle; they currently sit near 0.52 of the outer radius. The textbook ratios
(0.38 for a five-point star) look sharper but leave too little of the image readable at 143px. Note
the six-arm "asterisk" reads as a six-point star at this weight — thinning it back is what makes it
an asterisk again, at the cost of the visible centre.

The polygons assume a square image; `aspect-ratio: 1` on `.blog-post-preview-image` enforces that, so
a non-square `previewImage` gets cropped rather than distorting the shape.

## Known quirks (verified — don't "fix" these accidentally)

- **`.media-container` is `display: none` at every width.** The `@media (min-width: 0px)` block in
  `responsive.css` always matches and nothing overrides it, so the Apple Music / Spotify iframes on
  the four release posts never render. Preserved deliberately; fixing it is a visual change.
- **`hr` stays cream in light mode**, making rules nearly invisible on the cream background.
- **`a:hover` runs an infinite rainbow `textColorChange` animation** on every link, including body
  copy. It clashes with the palette but is intentional-until-decided.
- `theme: minima` in `_config.yml` is vestigial — every layout is custom and overrides it. Minima
  still emits `assets/main.css`, which nothing links.
- `.text-stroke`, `.no-hover`, and the `colorChange` keyframe are unused by any content.
