/**
 * Native-app extras for iOS/Android (Capacitor): AdMob banner with UMP
 * consent, in-app analytics (GA4, consent-gated) and an App Store / Play
 * review prompt. Nothing here runs on the website — all plugins are
 * dynamically imported only after the native guard passes, exactly like
 * src/scripts/ota-update.ts, so web visitors never download them.
 *
 * Ad unit IDs are the real ones (AdMob apps "Calks.UK" iOS + Android;
 * App IDs live in Info.plist / strings.xml). Set ADMOB_TESTING = true to
 * serve Google demo ads when debugging on a device.
 */

export const ADMOB_TESTING = false

const BANNER_AD_ID: Record<string, string> = {
  ios: 'ca-app-pub-4859241862365215/8596038839',
  android: 'ca-app-pub-4859241862365215/4203543855',
}

// Interstitial: shown at most once per app session, on the 6th calculator
// view of that session, so it never interrupts the first task.
const INTERSTITIAL_AD_ID: Record<string, string> = {
  ios: 'ca-app-pub-4859241862365215/5882245581',
  android: 'ca-app-pub-4859241862365215/1181794693',
}
const INTERSTITIAL_AFTER_SESSION_VIEWS = 6
const INTERSTITIAL_SHOWN_KEY = 'interstitial-shown'
const SESSION_VIEWS_KEY = 'session-calc-views'

const GA_ID = 'G-7ZTS02YTBC'
const REVIEW_VISITS_KEY = 'calc-visit-count'
const REVIEW_ASKED_KEY = 'review-asked'
const REVIEW_AFTER_VISITS = 5

function isNativeApp(): boolean {
  if (typeof window === 'undefined') return false
  const w = window as unknown as { __IS_CAPACITOR__?: boolean; Capacitor?: { isNativePlatform?: () => boolean } }
  return (
    !!w.Capacitor?.isNativePlatform?.() ||
    location.protocol === 'capacitor:' ||
    location.protocol === 'file:'
  )
}

function getPlatform(): string {
  const w = window as unknown as { Capacitor?: { getPlatform?: () => string } }
  try { return w.Capacitor?.getPlatform?.() ?? 'web' } catch { return 'web' }
}

/** GA4 inside the app, loaded only once consent allows it. */
function loadAnalytics(): void {
  if (document.querySelector('script[src*="googletagmanager.com/gtag"]')) return
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
  w.dataLayer = w.dataLayer || []
  const gtag = (...args: unknown[]) => { (w.dataLayer as unknown[]).push(args) }
  w.gtag = gtag
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
  gtag('js', new Date())
  gtag('config', GA_ID, { app_platform: getPlatform() })
}

/** UMP consent → ATT (iOS) → adaptive banner pinned to the bottom. */
async function initAds(): Promise<void> {
  const { AdMob, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdmobConsentStatus } =
    await import('@capacitor-community/admob')

  await AdMob.initialize()

  const [trackingInfo, consentInfoFirst] = await Promise.all([
    AdMob.trackingAuthorizationStatus().catch(() => ({ status: 'notSupported' as const })),
    AdMob.requestConsentInfo(),
  ])
  let consentInfo = consentInfoFirst

  if (trackingInfo.status === 'notDetermined') {
    await AdMob.requestTrackingAuthorization().catch(() => {})
  }

  if (consentInfo.isConsentFormAvailable && consentInfo.status === AdmobConsentStatus.REQUIRED) {
    consentInfo = await AdMob.showConsentForm()
  }

  // UMP verdict: only request ads (and load analytics) when allowed.
  const canRequestAds = (consentInfo as { canRequestAds?: boolean }).canRequestAds
    ?? consentInfo.status !== AdmobConsentStatus.REQUIRED
  if (!canRequestAds) return

  loadAnalytics()

  // Keep the banner from covering page content.
  AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size: { height: number }) => {
    document.body.style.paddingBottom = size.height > 0 ? `${size.height}px` : ''
  })

  await AdMob.showBanner({
    adId: BANNER_AD_ID[getPlatform()] ?? BANNER_AD_ID.android,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: ADMOB_TESTING,
  })

  // Interstitial: once per session, on the Nth calculator view — never on
  // the first task. Session counters survive page loads in this MPA.
  if (!location.pathname.startsWith('/calculator/')) return
  try {
    if (sessionStorage.getItem(INTERSTITIAL_SHOWN_KEY)) return
    const views = (Number(sessionStorage.getItem(SESSION_VIEWS_KEY)) || 0) + 1
    sessionStorage.setItem(SESSION_VIEWS_KEY, String(views))
    if (views !== INTERSTITIAL_AFTER_SESSION_VIEWS) return
    sessionStorage.setItem(INTERSTITIAL_SHOWN_KEY, '1')
  } catch { return }
  await AdMob.prepareInterstitial({
    adId: INTERSTITIAL_AD_ID[getPlatform()] ?? INTERSTITIAL_AD_ID.android,
    isTesting: ADMOB_TESTING,
  })
  await AdMob.showInterstitial()
}

/** Ask for a store review once, after the 5th calculator visit. */
async function maybeAskForReview(): Promise<void> {
  if (!location.pathname.startsWith('/calculator/')) return
  let visits = 0
  try {
    if (localStorage.getItem(REVIEW_ASKED_KEY)) return
    visits = (Number(localStorage.getItem(REVIEW_VISITS_KEY)) || 0) + 1
    localStorage.setItem(REVIEW_VISITS_KEY, String(visits))
    if (visits < REVIEW_AFTER_VISITS) return
    localStorage.setItem(REVIEW_ASKED_KEY, '1')
  } catch { return }

  // Let the user see their result first; the OS may silently skip the dialog
  // (both stores rate-limit review prompts — that's fine).
  await new Promise((r) => setTimeout(r, 12_000))
  const { AppReview } = await import('@capawesome/capacitor-app-review')
  await AppReview.requestReview()
}

export function initNativeExtras(): void {
  if (!isNativeApp()) return
  initAds().catch(() => { /* consent unavailable / offline / ads blocked — app works without ads */ })
  maybeAskForReview().catch(() => { /* OS declined to show the dialog — never block anything */ })
}
