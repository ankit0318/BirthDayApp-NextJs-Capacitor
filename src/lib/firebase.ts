// Firebase configuration for authentication and firestore services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Replace these values with your own Firebase project configuration values
const firebaseConfig = {
  apiKey: "AIzaSyDhnZTJvLFl4hW_iRJWOb58zyXRVClLDhc",
  authDomain: "birthdayapp-adb22.firebaseapp.com",
  projectId: "birthdayapp-adb22",
  storageBucket: "birthdayapp-adb22.firebasestorage.app",
  messagingSenderId: "531881434957",
  appId: "1:531881434957:web:f8edea714c3effc8096104",
  measurementId: "G-R5TXJMPY7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
