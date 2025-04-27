"use client";

import { Preferences } from "@capacitor/preferences";

/**
 * StorageService - A utility service for handling storage operations across platforms
 * Uses Capacitor Preferences plugin for native storage on mobile and falls back to localStorage on web
 */
class StorageService {
  /**
   * Set a value in storage
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   */
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

  /**
   * Get a value from storage
   * @param key - Storage key to retrieve
   * @returns Parsed value or null if not found
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const { value } = await Preferences.get({ key });
      return value ? JSON.parse(value) : null;
    } catch (error) {
      // Fallback to localStorage if Capacitor Preferences fails
      const value = localStorage.getItem(key);
      console.error("Error using Capacitor Preferences:", error);
      return value ? JSON.parse(value) : null;
    }
  }

  /**
   * Remove an item from storage
   * @param key - Storage key to remove
   */
  async removeItem(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      // Fallback to localStorage if Capacitor Preferences fails
      localStorage.removeItem(key);
      console.error("Error using Capacitor Preferences:", error);
    }
  }

  /**
   * Check if user is on first login
   * @returns Boolean indicating if this is the user's first login
   */
  async isFirstLogin(): Promise<boolean> {
    const firstLogin = await this.getItem<string>("isFirstLogin");
    return firstLogin === "true";
  }

  /**
   * Mark that the first login celebration has been shown
   */
  async markFirstLoginComplete(): Promise<void> {
    await this.setItem("isFirstLogin", "false");
  }
}

// Export a singleton instance
export const storageService = new StorageService();
