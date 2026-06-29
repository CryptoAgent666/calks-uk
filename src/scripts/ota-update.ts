/**
 * OTA live-updates for the native (iOS/Android) Capacitor app.
 *
 * Strategy: the app ships with the full site bundled (works fully offline). On
 * launch, when online, it checks a static manifest on Cloudflare
 * (https://calks.uk/app/latest.json). If a newer web bundle is published, it
 * downloads it and queues it via Capgo's `next()` — which activates on the next
 * app launch / background→foreground, so the current session is never disrupted.
 *
 * Nothing here runs on the website: the Capgo plugin is dynamically imported
 * only after the native-app guard passes, so web visitors never download it.
 */

const MANIFEST_URL = 'https://calks.uk/app/latest.json'
const APPLIED_KEY = 'ota-applied-version'
const SESSION_FLAG = 'ota-checked-this-session'

// Build id baked into THIS bundle (store build or a previously-applied OTA bundle).
// Set by the build/deploy scripts as PUBLIC_BUILD_ID (YYYYMMDDHHMM). 0 if unstamped.
const CURRENT_BUILD = Number(import.meta.env.PUBLIC_BUILD_ID ?? 0) || 0

function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false
  const w = window as unknown as { __IS_CAPACITOR__?: boolean; Capacitor?: { isNativePlatform?: () => boolean } }
  return (
    w.__IS_CAPACITOR__ === true ||
    !!w.Capacitor?.isNativePlatform?.() ||
    location.protocol === 'capacitor:' ||
    location.protocol === 'file:'
  )
}

export async function initOtaUpdates(): Promise<void> {
  if (!isNativeApp()) return

  // Loaded lazily so this code (and the Capgo plugin) is only ever fetched in the app.
  const { CapacitorUpdater } = await import('@capgo/capacitor-updater')

  // Confirm the running bundle is healthy — disarms Capgo's auto-rollback timer.
  try {
    await CapacitorUpdater.notifyAppReady()
  } catch {
    /* running the builtin bundle before any OTA — safe to ignore */
  }

  // Check at most once per app session, and only when online.
  try {
    if (sessionStorage.getItem(SESSION_FLAG)) return
    sessionStorage.setItem(SESSION_FLAG, '1')
  } catch {
    /* sessionStorage unavailable — continue, the localStorage guard still prevents re-downloads */
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) return

  try {
    const res = await fetch(MANIFEST_URL, { cache: 'no-store' })
    if (!res.ok) return
    const latest = (await res.json()) as { version?: string | number; url?: string }
    if (!latest?.version || !latest?.url) return

    const version = String(latest.version)
    if ((Number(latest.version) || 0) <= CURRENT_BUILD) return // the running bundle is already this new or newer
    if (localStorage.getItem(APPLIED_KEY) === version) return // already downloaded this version, awaiting next launch

    const bundle = await CapacitorUpdater.download({ url: latest.url, version })
    await CapacitorUpdater.next({ id: bundle.id }) // activate on next launch / resume — no mid-session reload
    localStorage.setItem(APPLIED_KEY, version)
  } catch {
    /* offline, manifest unreachable, or download failed — keep the current bundle */
  }
}
