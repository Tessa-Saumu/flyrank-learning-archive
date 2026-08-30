## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

# Agent Orientation

This repo builds the FlyRank Learning Archive.

Read these three files in this order before writing any code:

1. @docs/PRODUCT_SPEC.md — product definition, information architecture, data model
2. @docs/DESIGN_SPEC.md — Systems Atlas visual direction, colour, typography, graph behaviour
3. @docs/CONTENT_REGISTRY.md — canonical assignment IDs, verified copy, artifact registry, approved graph edges

Rules:

- Use the canonical assignment IDs from CONTENT_REGISTRY.md exactly as written. Do not invent new IDs.
- Do not invent Task/Lesson/Takeaway copy. Use only what is in CONTENT_REGISTRY.md.
- Do not create graph edges that are not in the approved edges table.
- Follow the build order in PRODUCT_SPEC.md section 39 (Phase 1 through 6). Do not start with graph aesthetics or animation.
- Stack: Astro + TypeScript + CSS + Cytoscape.js. No backend. No additional UI framework unless justified.
- Visual direction is locked: Systems Atlas. Do not deviate from the colour system, typography, or "avoid" lists in DESIGN_SPEC.md.