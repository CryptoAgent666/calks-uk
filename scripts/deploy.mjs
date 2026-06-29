#!/usr/bin/env node
/**
 * Deploy calks.uk to Cloudflare Pages AND publish an OTA web bundle for the
 * native iOS/Android apps in one step.
 *
 *   npm run deploy
 *
 * Flow:
 *   1. Build the site, stamping PUBLIC_BUILD_ID (YYYYMMDDHHMM) into the bundle.
 *   2. Zip the clean dist (index.html at zip root) — this is the OTA bundle.
 *   3. Stage the zip + latest.json under dist/app/ (served at calks.uk/app/).
 *      Done AFTER zipping so the bundle never contains itself.
 *   4. wrangler pages deploy dist → site + /app/ go live; apps pick up the
 *      new bundle on next launch (see src/scripts/ota-update.ts).
 *
 * Only the latest bundle needs to exist on the server — apps download whatever
 * latest.json points to. Old per-deploy zips fall away with each new deploy.
 */
import { execSync } from 'node:child_process'
import { mkdirSync, writeFileSync, rmSync, existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = process.cwd()
const DIST = resolve(ROOT, 'dist')
const SITE = 'https://calks.uk'

const run = (cmd, env) => {
  console.log(`\n$ ${cmd}`)
  execSync(cmd, { stdio: 'inherit', cwd: ROOT, env: { ...process.env, ...env } })
}

// 1. version stamp = YYYYMMDDHHMM (monotonic, numeric-comparable)
const d = new Date()
const pad = (n) => String(n).padStart(2, '0')
const VERSION = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}`

console.log(`\n=== calks.uk deploy + OTA publish — build ${VERSION} ===`)

// 2. build the site with the version baked in (PUBLIC_* is exposed to client code)
run('npm run build', { PUBLIC_BUILD_ID: VERSION })

if (!existsSync(resolve(DIST, 'index.html'))) {
  console.error('✗ dist/index.html missing — build failed?')
  process.exit(1)
}

// 3. zip the clean dist as the OTA bundle (exclude any app/ + junk so it never contains itself)
const zipName = `bundle-${VERSION}.zip`
const tmpZip = resolve(ROOT, `.${zipName}`)
if (existsSync(tmpZip)) rmSync(tmpZip)
run(`cd "${DIST}" && zip -r -q -X "${tmpZip}" . -x 'app/*' -x '*.DS_Store'`)
const sizeMB = (statSync(tmpZip).size / 1048576).toFixed(1)
console.log(`   OTA bundle: ${zipName} (${sizeMB} MB)`)

// 4. stage manifest + bundle under dist/app/ (added AFTER zipping → not in the bundle)
const appDir = resolve(DIST, 'app')
mkdirSync(appDir, { recursive: true })
run(`cp "${tmpZip}" "${resolve(appDir, zipName)}"`)
writeFileSync(
  resolve(appDir, 'latest.json'),
  JSON.stringify({ version: VERSION, url: `${SITE}/app/${zipName}`, generated: d.toISOString() }, null, 2) + '\n',
)
rmSync(tmpZip)

// 5. deploy site + OTA files to Cloudflare Pages production
run('npx wrangler pages deploy dist --project-name calks-uk --branch main --commit-dirty=true')

console.log(`\n✅ Live. Site deployed + OTA bundle ${VERSION} published.`)
console.log(`   manifest: ${SITE}/app/latest.json`)
console.log(`   bundle:   ${SITE}/app/${zipName} (${sizeMB} MB)`)
console.log(`   Installed apps will fetch this on next launch (offline-safe).`)
