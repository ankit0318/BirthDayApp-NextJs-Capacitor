# 🎂 Birthday Cake Celebration App

A cross-platform birthday cake celebration app built with Next.js and Capacitor. This app displays a special celebration animation for first-time users and works on web, Android, and iOS platforms.

## 📱 Features

- **Cross-Platform Support**: Works seamlessly on web, Android, and iOS
- **Special Birthday Animation**: Beautiful cake animation for first-time users
- **User Authentication**: Email/password authentication using Firebase
- **Local Storage**: Remembers user preferences across sessions
- **Responsive Design**: Works on all screen sizes and devices

## 🛠️ Technologies Used

- **Next.js**: React framework with static site generation
- **Capacitor**: For converting web apps to native mobile apps
- **Firebase Auth**: For user authentication
- **Framer Motion**: For smooth animations
- **Tailwind CSS**: For responsive design
- **TypeScript**: For type-safe code

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/birthday-cake-app.git
   cd birthday-cake-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Firebase:

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password
   - Copy your Firebase config from Project Settings
   - Update the Firebase configuration in `src/lib/firebase.ts`

4. Build the Next.js app:
   ```bash
   npm run build
   ```

## 📋 Development Workflow

### Web Development

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser

### Android Development

1. Build the web app:

   ```bash
   npm run build
   ```

2. Add the Android platform if you haven't already:

   ```bash
   npx cap add android
   ```

3. Copy the web assets to the Android project:

   ```bash
   npx cap copy android
   ```

4. Update native dependencies:

   ```bash
   npx cap sync android
   ```

5. Open the project in Android Studio:

   ```bash
   npx cap open android
   ```

6. Run the app on a device or emulator from Android Studio

### iOS Development (macOS only)

1. Build the web app:

   ```bash
   npm run build
   ```

2. Add the iOS platform if you haven't already:

   ```bash
   npx cap add ios
   ```

3. Copy the web assets to the iOS project:

   ```bash
   npx cap copy ios
   ```

4. Update native dependencies:

   ```bash
   npx cap sync ios
   ```

5. Open the project in Xcode:

   ```bash
   npx cap open ios
   ```

6. Run the app on a device or simulator from Xcode

## 📁 Project Structure

```
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── page.tsx       # Main page
│   │   └── layout.tsx     # Root layout with AuthProvider
│   ├── components/        # React components
│   │   ├── BirthdayCake.tsx   # Birthday cake animation
│   │   ├── Login.tsx      # Login form
│   │   └── Register.tsx   # Registration form
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context provider
│   └── lib/
│       ├── firebase.ts    # Firebase configuration
│       └── storage.ts     # Cross-platform storage utilities
├── public/                # Static assets
├── android/               # Android project
├── ios/                   # iOS project
├── capacitor.config.ts    # Capacitor configuration
└── next.config.js         # Next.js configuration
```

## 🔍 Implementation Details

### Authentication Flow

The app uses Firebase Authentication for user management. The auth state is managed through React Context and is accessible throughout the app using the `useAuth()` hook.

### First-Time User Experience

When a user registers for the first time, their login status is tracked using Capacitor's Preferences API (which uses native storage on mobile and falls back to localStorage on web). The `BirthdayCake` component checks this status and displays an animated celebration for first-time users.

### Cross-Platform Storage

The app uses a custom `StorageService` class that leverages Capacitor's Preferences plugin to provide a consistent storage API across web, Android, and iOS platforms.

### Animation Implementation

The birthday cake animations are built using Framer Motion, which provides a smooth animation experience across all platforms. The animation includes cake layers, candles with flickering flames, and confetti effects.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Capacitor](https://capacitorjs.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
