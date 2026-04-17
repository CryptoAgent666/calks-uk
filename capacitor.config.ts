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
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
}

export default config
