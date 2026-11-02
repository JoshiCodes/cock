# Contributing

Issues and pull requests are welcome — a bug, a missing prop, a component you
keep writing by hand. If the change is large, open an issue first so we agree on
the shape of it before you spend an evening on it.

## Getting set up

[Bun](https://bun.sh) is what this repo uses. Node 18+ works for consuming the
package, but the scripts and the lockfile assume Bun.

```bash
bun install
bun run dev
```

That serves the preview site on `localhost:5173`, which is also the development
environment: every component has a page with live examples, so you edit a
component and see it in context.

## How the repo is laid out

Two halves:

- `src/lib` is the published package. Components live under
  `components/<group>/`, and everything is re-exported from `src/lib/index.ts`.
  `styles/theme.css` holds the tokens.
- `src/routes` is the preview site. It is not published.

The site imports the package by its published name, so the code shown under a
demo is the code a reader can paste. A Vite alias in `vite.config.ts` points
`@joshicodes/cock` back at `src/lib`.

## Before you open a pull request

```bash
bun run check
```

```bash
bun run format
```

```bash
bun run build
```

CI runs `check`, `lint` and `build` on every pull request. `lint` is Prettier in
check mode, so running `format` first keeps it quiet. `build` also packages the
library and runs `publint` over the result.

## Adding a component

1. Write it in `src/lib/components/<group>/Name.svelte` and export it from
   `src/lib/index.ts`.
2. Describe it in `src/routes/components/catalog.ts`: the summary, the keyboard
   behaviour, what it is related to. Props are not listed there —
   `props.server.ts` reads them out of the component source, so the table on the
   page cannot drift from the real signature.
3. Bump `components` and `pages` in `src/routes/facts.ts`. The home page, the
   SEO description and the component index all count from there.
4. Add at least one example under
   `src/routes/components/examples/<slug>/01-name.svelte`. The number orders the
   examples and the rest of the filename becomes the heading; an opening HTML
   comment is used as the caption and left out of the displayed source.

### Conventions worth copying

Open any existing component and follow it. The parts that matter:

- Declare a `Props` interface extending the right `HTMLAttributes`, destructure
  it with defaults, and spread `...rest` onto the element. A JSDoc comment on a
  prop becomes its description in the docs.
- Take a `class` prop and merge it last through `cn`, so a caller's utility wins
  instead of fighting the default.
- Use the theme tokens (`bg-surface`, `text-fg-muted`, `border-border`,
  `bg-accent/12`), never raw colours. A component that hardcodes a colour breaks
  the moment somebody changes `--ck-accent`.
- Reuse the shared fragments from `src/lib/utils/styles.ts` (`focusRing`,
  `focusRingInset`, `disabled`, `transition`) so everything rings and disables
  the same way.
- Keyboard and screen readers are part of the component, not a follow-up. If it
  opens, it closes with Escape; if it is a list, the arrow keys walk it.
- Effects and animations render their final state when the visitor prefers
  reduced motion.

## Releasing

Maintainers only: bump `version` in `package.json` and push to `master`. The
release workflow publishes to npm, tags the commit and writes the GitHub release
notes. A version with a suffix (`0.2.0-beta.1`) goes out under the `next` tag as
a pre-release. Anything else that touches `package.json` is skipped.

Bundle sizes quoted on the site are measured, not estimated, and nobody has to
remember to do it: `bun run build` packages the library, bundles each entry
point of the packaged `dist` (`scripts/measure-bundle.ts`), writes
`src/routes/bundle.json` and only then builds the site. Commit the JSON when it
changes. The component and page counts come from the catalog, and the version
from `package.json`.

## Running the preview site

The site builds with `@sveltejs/adapter-node` and prerenders every page it can,
so search engines get finished HTML. The Dockerfile builds it with Bun and runs
it on Node, as an unprivileged user, on plain HTTP port 3000. TLS and the domain
are left to the reverse proxy in front of it.

```bash
docker compose up -d --build
```

That binds the container to `127.0.0.1:3000` only. Point the proxy there, and
keep `ORIGIN` in `docker-compose.yml` set to the public URL.

SEO lives in `src/routes/seo.ts` (URL, title, description) and
`src/routes/showcase/Seo.svelte` (meta tags, Open Graph, JSON-LD). `robots.txt`
and `sitemap.xml` are prerendered routes; the social preview image is
`static/og.png`.
