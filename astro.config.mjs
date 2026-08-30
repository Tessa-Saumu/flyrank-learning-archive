// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Dev/preview host allowlist. `astro preview` reads `server.allowedHosts`
  // (see astro/dist/core/preview/index.js). Permits the ephemeral
  // sandbox/preview proxy host (e.g. *.e2b.app). The static `dist/` output is
  // unaffected; production deploys (Netlify, Phase 3) serve the static build
  // and never hit this setting.
  server: {
    allowedHosts: true,
  },
});
