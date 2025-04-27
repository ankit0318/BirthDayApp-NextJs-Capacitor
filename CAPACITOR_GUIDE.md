# Capacitor Integration Guide

This document provides a detailed explanation of Capacitor and how it's used in the Birthday Cake Celebration App to enable cross-platform functionality.

## What is Capacitor?

Capacitor is a cross-platform native runtime developed by the team at Ionic. It allows web applications written in HTML, CSS, and JavaScript/TypeScript to be packaged as native mobile apps for iOS and Android, as well as desktop applications.

Think of Capacitor as a container that wraps your web application and provides:

- Access to native device APIs (camera, geolocation, storage, etc.)
- Native UI elements and behaviors
- The ability to distribute your app through app stores

Unlike Cordova (which it was designed to replace), Capacitor has a more modern architecture, better performance, and closer integration with native platforms.

## How Our Project Uses Capacitor

### 1. Project Setup and Structure

When we ran `npx cap init "Birthday Cake App" "com.birthdaycake.app" --web-dir=out`, Capacitor created several important files:

- `capacitor.config.ts`: The main configuration file for Capacitor

```typescript
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.birthdaycake.app",
  appName: "Birthday Cake App",
  webDir: "out",
};

export default config;
```

This configuration file tells Capacitor:

- `appId`: The unique identifier for your app (similar to a package name in Android or bundle ID in iOS)
- `appName`: The display name of your app as it will appear on a user's device
- `webDir`: Where your web application's built assets are located (in our case, Next.js builds to the `out` directory)

### 2. Platform Integration

When we added platforms with `npx cap add android` and `npx cap add ios`, Capacitor created complete native projects:

#### Android Platform (`android` folder)

Capacitor generated a full Android Studio project with:

- `app/src/main/AndroidManifest.xml`: Android app manifest defining permissions, activities, etc.
- `app/src/main/assets/`: Where web assets are copied
- `app/src/main/res/`: Android resources like icons and splash screens
- Gradle build files for dependency management

#### iOS Platform (`ios` folder)

Capacitor generated a complete Xcode project with:

- `App/App/AppDelegate.swift`: iOS application entry point
- `App/App/public/`: Where web assets are copied
- `App/App/Info.plist`: iOS configuration properties
- `App/App/Assets.xcassets/`: iOS assets including app icons

### 3. Building and Syncing

After building our Next.js app with `npm run build`, we used Capacitor commands to move the web assets to the native projects:

```bash
npx cap copy
```

This command:

- Takes the built web files from the `out` directory
- Copies them to `android/app/src/main/assets/public` (for Android)
- Copies them to `ios/App/App/public` (for iOS)
- Ensures the native apps display the latest web content

```bash
npx cap sync
```

This more comprehensive command:

- Performs everything that `npx cap copy` does
- Updates native dependencies in both projects
- Installs Capacitor plugins in both platforms
- Updates plugin-related code and configuration

### 4. Cross-Platform Storage with Preferences Plugin

We're using Capacitor's Preferences plugin to handle storage consistently across platforms:

```bash
npm install @capacitor/preferences
```

In our `src/lib/storage.ts` file:

```typescript
import { Preferences } from "@capacitor/preferences";

class StorageService {
  async setItem(key: string, value: unknown): Promise<void> {
    try {
      await Preferences.set({
        key,
        value: JSON.stringify(value),
      });
    } catch (error) {
      // Fallback to localStorage if Capacitor Preferences fails
      localStorage.setItem(key, JSON.stringify(value));
      console.error("Error using Capacitor Preferences:", error);
    }
  }

  // Additional methods...
}
```

The Preferences plugin:

- Uses secure, native storage mechanisms on mobile (KeyStore/KeyChain)
- Uses localStorage when running on the web
- Provides a consistent Promise-based API across all platforms
- Automatically handles data serialization and deserialization

### 5. Capacitor Project Structure Explained

Here's a breakdown of the key Capacitor-generated files in our project:

#### Android Structure

- `android/app/src/main/AndroidManifest.xml`:
  Defines app permissions, activities, and other Android configurations

- `android/app/src/main/assets/capacitor.config.json`:
  A JSON version of our Capacitor configuration used at runtime by the Android app

- `android/app/src/main/assets/capacitor.plugins.json`:
  Lists all Capacitor plugins used by the app (in our case, the Preferences plugin)

- `android/app/src/main/java/com/birthdaycake/app/MainActivity.java`:
  The main Android activity class that loads the web app

#### iOS Structure

- `ios/App/App/AppDelegate.swift`:
  The entry point for our iOS app, initializes the Capacitor bridge

- `ios/App/App/capacitor.config.json`:
  A JSON version of our Capacitor configuration used at runtime by the iOS app

- `ios/App/App/public/`:
  Contains our built web application and assets

- `ios/App/Podfile`:
  Used by CocoaPods to manage iOS dependencies (including Capacitor plugins)

### 6. How the Web-to-Native Bridge Works

Capacitor acts as a bridge between our web application and native device features:

1. Our Next.js app is built as a static site with HTML, CSS, and JavaScript
2. Capacitor embeds this in a WebView component (WKWebView on iOS, WebView on Android)
3. The Capacitor bridge creates a communication channel between JavaScript and native code
4. When our web code calls a Capacitor plugin:
   ```typescript
   // In storage.ts
   await Preferences.set({ key, value: JSON.stringify(value) });
   ```
5. The Capacitor bridge:
   - Intercepts this call
   - Routes it to native code (Swift/Java)
   - Executes the native implementation of the Preferences plugin
   - Returns the result to our JavaScript

This bridge is what enables our web app to access native functionality seamlessly.

### 7. Running on Different Platforms

#### Web

Our app works as a standard web application. When running on the web, Capacitor's plugins automatically use web-compatible implementations (like using localStorage for the Preferences plugin).

#### Android

To run on Android:

```bash
npx cap open android
```

This opens Android Studio with our project, where you can:

- Build and run on an emulator or physical device
- Configure Android-specific settings
- Add additional native code if needed

#### iOS (requires macOS)

To run on iOS:

```bash
npx cap open ios
```

This opens Xcode with our project, where you can:

- Build and run on a simulator or physical device
- Configure iOS-specific settings
- Add additional native code if needed

### 8. Capacitor Plugins Ecosystem

Capacitor has a rich ecosystem of plugins. In our project, we're using:

- **@capacitor/preferences**: For cross-platform data storage

But Capacitor offers many more plugins for native functionality:

- Camera access
- Geolocation
- Push notifications
- File system access
- Biometric authentication
- And many more

To add a new plugin, you would:

1. Install it with npm: `npm install @capacitor/plugin-name`
2. Sync with native projects: `npx cap sync`
3. Use it in your code: `import { PluginName } from '@capacitor/plugin-name'`

### 9. Debugging Capacitor Apps

#### Android Debugging

- Open Chrome and navigate to `chrome://inspect/#devices`
- Connect your Android device or emulator
- You'll see your app listed - click "inspect"
- This opens Chrome DevTools connected to your app's WebView

#### iOS Debugging

- Open Safari
- Enable Developer Tools in Safari preferences
- Connect your iOS device or run in simulator
- From the Develop menu, select your device and app
- This opens Safari Web Inspector connected to your app's WebView

### 10. Live Reload with Capacitor

For faster development, you can enable live reload:

1. Run your web app locally: `npm run dev`
2. Edit `capacitor.config.ts` to add:

```typescript
const config: CapacitorConfig = {
  // Other config...
  server: {
    url: "http://YOUR_LOCAL_IP:3000",
    cleartext: true,
  },
};
```

3. Sync the config: `npx cap sync`
4. Run on device/emulator: `npx cap run android` or `npx cap run ios`

This allows you to see changes immediately in the native app when you edit your web code.

## Common Issues and Solutions

### 1. White Screen After Load

If your app shows a white screen when running on a device:

- Check that your app is properly built with `npm run build`
- Ensure assets were copied with `npx cap copy`
- Check browser console for JavaScript errors
- Verify the correct webDir in capacitor.config.ts

### 2. Plugin Not Working on Device

If a Capacitor plugin works on web but not on device:

- Run `npx cap sync` to update native projects
- Check if the plugin requires additional permissions in AndroidManifest.xml or Info.plist
- Verify the plugin is listed in capacitor.plugins.json

### 3. Permissions Issues

If your app doesn't have required permissions:

- Android: Edit `android/app/src/main/AndroidManifest.xml` to add permissions
- iOS: Edit `ios/App/App/Info.plist` to add permission descriptions

## Expanding Your Capacitor Knowledge

To learn more about Capacitor:

- Official documentation: https://capacitorjs.com/docs
- Capacitor plugins: https://capacitorjs.com/docs/apis
- Community plugins: https://github.com/capacitor-community
