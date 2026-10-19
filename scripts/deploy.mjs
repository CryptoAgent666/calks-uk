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
 *   5. Verify: wrangler output has no upload errors, and calks.uk/app/latest.json
 *      serves THIS version with its bundle returning 200. Anything else → exit 1.
 *      (19 Oct 2026: a parallel `astro build` wiped dist/ mid-upload, wrangler
 *      crashed in its own error handler with exit 0, and this script printed
 *      "✅ Live" although nothing had gone live.)
 *
 * Only the latest bundle needs to exist on the server — apps download whatever
 * latest.json points to. Old per-deploy zips fall away with each new deploy.
 */
import { execSync, spawn } from 'node:child_process'
import { mkdirSync, writeFileSync, rmSync, existsSync, statSync, readFileSync, realpathSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = process.cwd()
const DIST = resolve(ROOT, 'dist')
const SITE = 'https://calks.uk'

const run = (cmd, env) => {
  console.log(`\n$ ${cmd}`)
  execSync(cmd, { stdio: 'inherit', cwd: ROOT, env: { ...process.env, ...env } })
}

// Like run(), but echoes stdout/stderr live AND returns them, without throwing on a
// non-zero exit — the caller decides. wrangler's exit code alone can't be trusted.
const runTee = (cmd) =>
  new Promise((done) => {
    console.log(`\n$ ${cmd}`)
    let output = ''
    const child = spawn(cmd, { shell: true, cwd: ROOT, stdio: ['inherit', 'pipe', 'pipe'] })
    child.stdout.on('data', (b) => { process.stdout.write(b); output += b })
    child.stderr.on('data', (b) => { process.stderr.write(b); output += b })
    child.on('error', (err) => done({ code: null, signal: null, output: `${output}\nError: ${err.message}` }))
    child.on('close', (code, signal) => done({ code, signal, output }))
  })

// wrangler output lines that mean the upload/deploy failed, whatever the exit code
// ("✘ [ERROR] …", "Error: Failed to upload files. …", and a crash in its own
// handler: "TypeError [ERR_INVALID_ARG_TYPE]: …").
const WRANGLER_FAILURE = [/Failed to upload/i, /Error:/, /\[ERROR\]/, /\w*Error \[ERR_\w+\]/]

export function scanWranglerOutput(text) {
  return text
    .replace(/\x1b\[[0-9;]*m/g, '')
    .split(/[\r\n]+/)
    .map((l) => l.trim())
    .filter((l) => WRANGLER_FAILURE.some((re) => re.test(l)))
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const cacheBust = () => `cb=${Math.floor(Math.random() * 1e9)}`

// Poll SITE/app/latest.json until it serves `version` and that version's bundle answers
// 200 with a non-HTML body (a missing file would be the 404 page). One attempt when
// timeoutMs is 0. Returns { ok, manifestVersion, bundleUrl, bundleStatus, seen }.
export async function verifyLive(version, { site = SITE, timeoutMs = 60_000, intervalMs = 5_000 } = {}) {
  const deadline = Date.now() + timeoutMs
  const bundleUrl = `${site}/app/bundle-${version}.zip`
  const result = { ok: false, manifestVersion: null, bundleUrl, bundleStatus: null, seen: 'nothing fetched' }
  for (;;) {
    try {
      const res = await fetch(`${site}/app/latest.json?${cacheBust()}`, { cache: 'no-store', signal: AbortSignal.timeout(10_000) })
      if (!res.ok) {
        result.seen = `${site}/app/latest.json → HTTP ${res.status}`
      } else {
        const manifest = await res.json()
        result.manifestVersion = manifest.version ?? null
        if (manifest.version !== version) {
          result.seen = `live manifest is version ${manifest.version}, expected ${version}`
        } else if (manifest.url !== bundleUrl) {
          result.seen = `live manifest is ${version} but points to ${manifest.url}, expected ${bundleUrl}`
        } else {
          const b = await fetch(`${bundleUrl}?${cacheBust()}`, { method: 'HEAD', cache: 'no-store', signal: AbortSignal.timeout(10_000) })
          const type = b.headers.get('content-type') || ''
          result.bundleStatus = b.status
          if (b.status === 200 && !type.includes('text/html')) return { ...result, ok: true, seen: `manifest ${version}, bundle HTTP 200 ${type}` }
          result.seen = `live manifest is ${version}, but ${bundleUrl} → HTTP ${b.status} ${type}`
        }
      }
    } catch (err) {
      result.seen = `request failed: ${err.message}`
    }
    if (Date.now() + intervalMs > deadline) return result
    await sleep(intervalMs)
  }
}

async function main() {
  // 1. version stamp = YYYYMMDDHHMM (monotonic, numeric-comparable)
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const VERSION = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}`

  console.log(`\n=== calks.uk deploy + OTA publish — build ${VERSION} ===`)

  const notLive = (lines) => {
    console.error(`\n✗ NOT LIVE. Build ${VERSION} is not confirmed on ${SITE}.`)
    for (const l of lines) console.error(`   ${l}`)
    console.error(`   Check: curl -s "${SITE}/app/latest.json?cb=$RANDOM"`)
    process.exit(1)
  }

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
  const zipBytes = statSync(tmpZip).size
  const sizeMB = (zipBytes / 1048576).toFixed(1)
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

  // dist/ is shared with every other build in this checkout: if anything rebuilt it
  // since staging, the upload would be a mix (or miss the bundle). Checked before
  // AND after wrangler.
  const stagedProblems = () => {
    const problems = []
    const bundlePath = resolve(appDir, zipName)
    const manifestPath = resolve(appDir, 'latest.json')
    for (const p of [resolve(DIST, 'index.html'), bundlePath, manifestPath]) {
      if (!existsSync(p)) problems.push(`${p.slice(ROOT.length + 1)} is missing`)
    }
    if (existsSync(bundlePath) && statSync(bundlePath).size !== zipBytes) problems.push(`dist/app/${zipName} changed size`)
    if (existsSync(manifestPath)) {
      let staged
      try { staged = JSON.parse(readFileSync(manifestPath, 'utf8')).version } catch { staged = 'unreadable' }
      if (staged !== VERSION) problems.push(`dist/app/latest.json is version ${staged}, expected ${VERSION}`)
    }
    return problems
  }

  const before = stagedProblems()
  if (before.length) {
    notLive(['dist/ changed after staging — another process rebuilt it? wrangler was NOT run.', ...before])
  }

  // 5. deploy site + OTA files to Cloudflare Pages production
  const wrangler = await runTee('npx wrangler pages deploy dist --project-name calks-uk --branch main --commit-dirty=true')

  const problems = []
  if (wrangler.code !== 0) problems.push(`wrangler exited with ${wrangler.signal ?? `code ${wrangler.code}`}`)
  const errorLines = scanWranglerOutput(wrangler.output)
  if (errorLines.length) problems.push('wrangler printed errors:', ...errorLines.map((l) => `  ${l}`))
  const after = stagedProblems()
  if (after.length) problems.push('dist/ changed during the upload — what went up may be a mix; redeploy:', ...after.map((l) => `  ${l}`))
  if (problems.length) {
    const live = await verifyLive(VERSION, { timeoutMs: 0 })
    notLive([...problems, `live: ${live.seen}`])
  }

  console.log(`\n   Verifying ${SITE}/app/latest.json serves ${VERSION} (up to 60 s)…`)
  const live = await verifyLive(VERSION)
  if (!live.ok) notLive([`wrangler reported success, but within 60 s ${live.seen}`])

  console.log(`\n✅ Live. Site deployed + OTA bundle ${VERSION} published.`)
  console.log(`   manifest: ${SITE}/app/latest.json`)
  console.log(`   bundle:   ${SITE}/app/${zipName} (${sizeMB} MB)`)
  console.log(`   Installed apps will fetch this on next launch (offline-safe).`)
}

// Run only when executed directly (`npm run deploy`), so the checks above can be
// imported and tested without building or deploying.
const isMain = (() => {
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
  } catch {
    return false
  }
})()
if (isMain) await main()
