import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "uk.calks.app",
  appName: "Calks UK",
  webDir: "dist",
  server: {
    url: "https://calks.uk",
    cleartext: false,
    androidScheme: "https",
  },
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
