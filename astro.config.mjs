// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import partytown from '@astrojs/partytown'
import react from '@astrojs/react'
import { WEBSITE_URL } from './src/assets/data/legalInfo'

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
