import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",
  // Astro's own session store is disabled on purpose: auth here uses the
  // `sessions` table in D1 (see src/lib/db.ts), so no KV binding is needed.
  session: false,
  adapter: cloudflare({
    imageService: "passthrough",
  }),
});
