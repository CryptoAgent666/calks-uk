import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "uk.calks.app",
  appName: "Calks UK",
  webDir: "dist",
  server: {
    androidScheme: "https",
    // html5mode=false via JSON cast (undocumented in TS types but read by Java).
    // Without this, Capacitor serves root /index.html for ALL directory paths,
    // breaking /category/ and /calculator/ multi-page navigation.
    ...({ html5mode: false } as Record<string, unknown>),
  } as any,
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: "#1e3a5f",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#1e3a5f",
    },
    // Capgo OTA live-updates — self-hosted on Cloudflare (https://calks.uk/app/).
    // Manual mode: src/scripts/ota-update.ts checks /app/latest.json on launch,
    // downloads a newer web bundle and queues it via next() (applies on next launch).
    // The app stays fully offline (bundled build) until/unless an update is fetched.
    CapacitorUpdater: {
      autoUpdate: false,
      appReadyTimeout: 15000,
      // On a native App Store update, discard OTA bundles and use the fresh bundled build.
      resetWhenUpdate: true,
    },
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
}

export default config
