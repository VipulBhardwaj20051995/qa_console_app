import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.wovengold.pdi',
  appName: 'Wovengold PDI',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystoreAlias: 'key0',
      keystorePassword: 'your-keystore-password',
      keyPassword: 'your-key-password'
    }
  }
};

export default config; 