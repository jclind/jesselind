#!/usr/bin/env node
// Copies one or more files into public/media/ so they're served from the site
// root at /media/<name> and auto-listed on /files/media.
//
// Usage: npm run media -- <file> [more files...]
import fs from 'node:fs'
import path from 'node:path'

// Read the site URL straight from the source of truth (without needing to parse
// TypeScript) so the printed share links match the deployed domain.
const legalInfo = fs.readFileSync(
  path.join(process.cwd(), 'src/assets/data/legalInfo.ts'),
  'utf8'
)
const WEBSITE_URL =
  legalInfo.match(/WEBSITE_URL\s*=\s*['"]([^'"]+)['"]/)?.[1] ?? 'https://jesselind.com'

const destDir = path.join(process.cwd(), 'public', 'media')

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: npm run media -- <file> [more files...]')
  process.exit(1)
}

fs.mkdirSync(destDir, { recursive: true })

let copied = 0
for (const src of args) {
  if (!fs.existsSync(src) || !fs.statSync(src).isFile()) {
    console.error(`✗ skipped (not a file): ${src}`)
    continue
  }
  const base = path.basename(src)
  const dest = path.join(destDir, base)
  if (fs.existsSync(dest)) {
    console.error(`✗ skipped (already in public/media/): ${base}`)
    continue
  }
  fs.copyFileSync(src, dest)
  console.log(`✓ public/media/${base}`)
  console.log(`  share: ${WEBSITE_URL}/media/${base}`)
  copied++
}

if (copied > 0) {
  console.log(`\nAdded ${copied} file(s). Commit & deploy to publish them:`)
  console.log('  git add public/media && git commit -m "media: add files" && git push')
}
