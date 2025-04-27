# Development Guide for Birthday Cake Celebration App

This document provides detailed technical information about the development and architecture of the Birthday Cake Celebration App.

## Architecture Overview

The app follows a layered architecture:

1. **UI Layer**: React components built with Next.js and styled with Tailwind CSS
2. **State Management**: React Context API for authentication state
3. **Business Logic**: Services for authentication and storage
4. **Data Access**: Firebase for authentication and Capacitor Preferences for storage
5. **Native Layer**: Capacitor bridge to native platforms

## Key Components & Services

### Authentication Flow

The authentication flow is managed by the `AuthContext` provider which wraps the entire application. This provider:

- Maintains the current user state
- Provides login, registration, and logout functions
- Listens for auth state changes via Firebase
- Sets first-login flags for the birthday celebration feature

```typescript
// AuthContext.tsx (simplified)
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login, Register, and Logout functions...

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Provide auth context to children
  return (
    <AuthContext.Provider
      value={{ currentUser, loading, register, login, logout }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

### Storage Service

The `StorageService` handles cross-platform storage needs:

- Uses Capacitor's Preferences API for native storage on mobile
- Falls back to localStorage on web platforms
- Provides a consistent API for get/set operations
- Handles the first-login flag for the birthday cake animation

```typescript
// storage.ts (simplified)
class StorageService {
  async setItem(key, value) {
    try {
      await Preferences.set({ key, value: JSON.stringify(value) });
    } catch (error) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  // getItem, removeItem, isFirstLogin methods...
}
```

### Birthday Cake Animation

The birthday cake animation is implemented using Framer Motion:

- The component conditionally renders based on the first-login status
- Uses multiple animation sequences for different elements
- Includes staggered animations for a dynamic feel
- Implements confetti-like effects using random parameters

## Build & Deployment Process

### Web Build

The web build process compiles the Next.js app to static HTML/CSS/JS:

1. Next.js compiles TypeScript code
2. Static HTML is generated for pre-rendering
3. CSS is extracted and optimized
4. JavaScript is bundled and code-split

### Android Build Process

For Android deployment:

1. Next.js builds static output to the `out` directory
2. Capacitor copies these assets to `android/app/src/main/assets/public`
3. Android-specific configuration is applied
4. The app can then be built using Android Studio or Gradle

```bash
# Full Android build process
npm run build
npx cap copy android
npx cap sync android
npx cap open android
# Then build/run from Android Studio
```

### iOS Build Process (macOS only)

For iOS deployment:

1. Next.js builds static output to the `out` directory
2. Capacitor copies these assets to `ios/App/App/public`
3. iOS-specific configuration is applied
4. The app can then be built using Xcode

```bash
# Full iOS build process
npm run build
npx cap copy ios
npx cap sync ios
npx cap open ios
# Then build/run from Xcode
```

## Custom Capacitor Configuration

The app uses the following Capacitor configuration:

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.birthdaycake.app",
  appName: "Birthday Cake App",
  webDir: "out",
  // Additional config could be added here for:
  // - Deep linking
  // - Splash screen customization
  // - Native status bar settings
};

export default config;
```

## Testing Guidance

### Unit Testing

Component and service tests should focus on:

- Authentication flows (login, register, logout)
- Storage service operations
- Animation lifecycle and interaction

### End-to-End Testing

E2E tests should cover:

- Complete authentication flow
- First-time user experience with birthday animation
- Cross-platform storage consistency

### Manual Testing Checklist

Before releasing:

1. Test authentication flows (login, registration, password validation)
2. Verify birthday cake animation renders correctly for first-time users
3. Check that the animation doesn't appear on subsequent logins
4. Test responsive layouts on various screen sizes
5. Verify smooth animations on lower-end devices

## Troubleshooting

### Common Issues

1. **Firebase Connection Issues**:

   - Check if you've correctly configured `src/lib/firebase.ts` with your Firebase credentials
   - Verify that Firebase Authentication is enabled in your Firebase console

2. **Static Build Problems**:

   - If the static build fails, check for dynamic server-side code that's incompatible with static export

3. **Capacitor Build Issues**:

   - Run `npx cap doctor` to check for environment setup problems
   - Ensure Android Studio and JDK are properly installed for Android builds
   - For iOS, ensure you're on macOS with Xcode installed

4. **Animation Performance**:
   - If animations are sluggish on mobile, reduce complexity or optimize performance by disabling certain effects

## Performance Optimizations

1. **Code Splitting**: The app uses Next.js code splitting to reduce initial load time
2. **Conditional Animation**: Heavy animations only render when needed
3. **Optimized Asset Loading**: Static assets are optimized during build

## Future Enhancements

Potential areas for expansion:

1. Offline support with service workers
2. Push notifications for birthday reminders
3. Social sharing capabilities
4. Theme customization options
5. Animation preferences (reduced motion support)
