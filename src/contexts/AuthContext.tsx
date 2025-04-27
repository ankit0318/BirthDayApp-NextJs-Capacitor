"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// Define the shape of the auth context
type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
};

// Create the authentication context
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Custom hook for using the auth context
 * This makes it easier to access authentication functionality throughout the app
 */
export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}

/**
 * Authentication provider component
 * Manages auth state and provides authentication functions to children
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Register a new user with email and password
   */
  function register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password).then(() => {
      // Store first login status in local storage for birthday animation
      localStorage.setItem("isFirstLogin", "true");
    });
  }

  /**
   * Login an existing user with email and password
   */
  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Log out the current user
   */
  function logout() {
    return signOut(auth);
  }

  // Set up listener for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up the listener when component unmounts
    return unsubscribe;
  }, []);

  // Value object to be provided to consumers of this context
  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
