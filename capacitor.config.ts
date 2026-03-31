import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.kitchentimer.app',
  appName: 'Kitchen Timer',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
}

export default config
