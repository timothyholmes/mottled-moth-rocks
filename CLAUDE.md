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

`blog.html` is also the only layout that loads a script of its own,
`assets/js/blog-search.js` (see "Tag search" below).

`_includes/` holds `header.html` (wordmark + nav), `footer.html`, and `blog-post-item.html`
(one post rendered as a `<li>` for the blog list).

### The landing page

`index.md` is empty front matter pointing at `_layouts/landing.html`. The layout is a 12-column
CSS grid (`.landing-grid`): featured post on 7, release rail on 5, then "More Reading" and the
photo gallery spanning all 12. Everything collapses to one column under 800px.

**The release rail is derived, not maintained** — it is the three newest posts tagged `project`,
so publishing a release is just publishing a post. The loop checks `categories contains 'project'
or tags contains 'project'`, because the oldest release post uses `tags:`. Release posts also
carry an `artist:` field, the only front matter the rail needs that a normal post lacks; without
it the card falls back to showing just the year.

The rail collects `release_urls` as it renders, and "More Reading" below reuses it to skip the
featured post and anything already in the rail, so a new album doesn't appear twice on one screen.
That ordering is load-bearing: the rail must render before "More Reading". Only the tagline links
are still hardcoded in the layout.

### Posts

`_posts/YYYY-MM-DD-slug.md`, with `layout: blog-post`. Every post carries an explicit `permalink`, so
the filename and `categories` do **not** determine the URL — existing permalinks vary in shape
(`/system/2024/08/14/virtues.html`, `/creativity/guitar-gear-2.html`, `/2026-02-16/challenges.html`).
Pick one deliberately; changing it breaks links.

`description` and `previewImage` are load-bearing: the blog index and the landing card both render
them. A post without them degrades silently.

`categories` uses a consistent taxonomy — `system`, `creativity`, `project`, `lore`, `knowledge`,
`annual`. These render as clickable tag chips on both the blog list and each post, drive the tag
search below, and `project` additionally feeds the landing page's release rail. A couple of early posts use `tags` instead of `categories`; the templates merge
both fields, so either works. Each taxonomy term has its own chip colour in `blog.css`; a term
outside the list still renders, falling back to a positional colour.

Dates render as `%B %-d, %Y` ("February 2, 2024") in both blog layouts. Keep them in sync.

Images live in `assets/images/`; newer posts use a per-post subdirectory
(`assets/images/2025-07-16-sarcoma/`), older ones sit flat with a `*-small` variant used as the
`previewImage`.

### Pagination

`jekyll-paginate`, 7 per page, `/blog/page:num/`. The paginator only works from an `.html` page,
which is why `blog/index.html` is HTML rather than Markdown.

### Tag search

`_layouts/blog.html` renders the post list **twice**: the visible `#blog-list` from
`paginator.posts`, and a hidden `#blog-list-all` from `site.posts` — every post, on every
paginated page. `assets/js/blog-search.js` filters that hidden index and clones matches into the
visible list, so search spans the whole archive rather than the current page of 7. Deleting the
hidden list silently reduces search to one page's worth of results.

A query mixes free text (substring-matched against `data-title` / `data-description`) with
`#tags` (all must match). Tag chips link to `/blog/?tag=<slug>`, which works with JS off; with JS
on, the script reads that parameter on load and intercepts in-list chip clicks so they filter
without a reload.

`_layouts/blog-post.html` wraps its title/description/date/tags in `<header class="blog-post-header">`.
That wrapper is load-bearing: the drop-cap rule is `.page-body > p:first-of-type::first-letter`,
so unwrapping the meta paragraphs would move the drop cap onto the date line.

### CSS

Hand-written, no framework and no preprocessor. Load order matters and is set by each layout —
`responsive.css` is always last so it can win.

**All color flows through design tokens in `base.css`.** A `:root` block defines a raw `--color-*`
palette (forest, cream, tan, ink, parchment) plus semantic tokens (`--bg`, `--fg`, `--link`,
`--accent`, `--shadow-color`, the `--nav-*` set), and a single `prefers-color-scheme: light` media
query re-points them. `--accent-a` through `--accent-d` are a four-hue cycle assigned round-robin
to nav items, blog cards, and tag chips; they are re-pointed to darker values in light mode so
they hold contrast on parchment. Do not hardcode a color anywhere else — `base.css` is the only file that should
contain a literal. Landing cards derive from the page (`background: var(--fg); color: var(--bg)`), so
one rule is correct in both themes.

The text column is a container, not viewport padding: `--measure` and `--gutter` in `base.css` drive
one rule in `layout.css` applied to `.page-header` / `.page-body`. `responsive.css` is now **type
scale only** — do not reintroduce layout padding there.

The visual signature is a 2px border plus a hard, un-blurred offset shadow
(`var(--shadow-offset) 0 var(--shadow-color)`) that collapses to `none` on hover; it is shared by
`.nav-item`, `.landing-card`, and `.blog-post-preview`. Each carries an accent edge on one side —
bottom for nav items, left for blog cards — which survives hover while the other borders swap.

`.nav-bar` is a wrapping flexbox; its `gap` (not per-item padding) is what spaces nav items, and
the column gap is sized to clear the 10px hard shadow. `responsive.css` is type scale only, so
the blog list's stack-on-mobile breakpoint lives in `blog.css` next to the rules it overrides.

Blog list cards are built to fill: `.blog-post-preview` carries **no padding of its own**. The
thumbnail is a full-bleed panel flush to the card edges (fixed `flex` basis, `object-fit: cover`,
`height: 100%`), and `.blog-post-preview-text` supplies the padding, so the two together occupy the
card exactly. Card height comes from the text; the image stretches to match and crops.

Both flex items set `min-width: 0` / `min-height: 0`. Without them the automatic minimum size of a
flex item falls back to the image's intrinsic dimensions and the panel outgrows its basis — this is
what makes the thumbnail balloon, not the `flex` shorthand.

Inside the text column, `.blog-post-preview-head` (title + description) and
`.blog-post-preview-foot` (date left, tags right, `space-between`) are pushed apart by
`justify-content: space-between`, so short descriptions don't leave the card trailing off. A
`min-height` on the card keeps that separation meaningful.

Thumbnails used to be `clip-path`-masked into six cycling shapes (star, hexagon, asterisk, diamond,
burst, cross). That was removed — a clipped polygon can't fill a rectangular panel, and filling the
card was the higher priority. The `--shape-*` polygons and the `nth-child(6n + k)` rules are gone;
`nth-child(4n + k)` now cycles the card's left accent colour instead.

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
