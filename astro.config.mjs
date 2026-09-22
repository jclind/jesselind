// @ts-check
import { defineConfig } from 'astro/config'
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { WEBSITE_URL } from './src/assets/data/legalInfo'

// Stand-in for @astrojs/sitemap, which is not yet compatible with Astro 7
// (its astro:build:done handler reads `routes`, removed from the hook in
// Astro 7). This site is fully static with no pagination, redirects, or
// i18n, so the built `pages` list is the complete URL set. Swap back to
// @astrojs/sitemap once it ships an Astro 7 compatible release.
/**
 * @returns {import('astro').AstroIntegration}
 */
function sitemap() {
  return {
    name: 'simple-sitemap',
    hooks: {
      'astro:build:done': async ({ dir, pages, logger }) => {
        const statusPages = new Set(['404', '500'])
        const site = WEBSITE_URL.replace(/\/$/, '')
        const urls = pages
          .map((p) => p.pathname.replace(/^\/+|\/+$/g, ''))
          .filter((p) => !statusPages.has(p))
          .map((p) => (p ? `${site}/${p}/` : `${site}/`))
        const escape = (s) =>
          s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const sitemapXml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls.map((u) => `<url><loc>${escape(u)}</loc></url>`).join('\n') +
          `\n</urlset>\n`
        const indexXml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `<sitemap><loc>${site}/sitemap-0.xml</loc></sitemap>\n` +
          `</sitemapindex>\n`
        const outDir = fileURLToPath(dir)
        mkdirSync(outDir, { recursive: true })
        writeFileSync(join(outDir, 'sitemap-0.xml'), sitemapXml)
        writeFileSync(join(outDir, 'sitemap-index.xml'), indexXml)
        logger.info(`Wrote sitemap-index.xml with ${urls.length} pages`)
      },
    },
  }
}

// https://astro.build/config
export default defineConfig({
  site: WEBSITE_URL,
  integrations: [
    react(),
    sitemap(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
})
