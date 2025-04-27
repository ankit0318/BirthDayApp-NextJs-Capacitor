"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Preferences } from "@capacitor/preferences";

interface RegisterProps {
  onLoginClick: () => void;
}

/**
 * Register Component
 *
 * Provides a form for new users to register with email and password
 * Uses the AuthContext for authentication functionality
 */
const Register: React.FC<RegisterProps> = ({ onLoginClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  /**
   * Handle form submission for registration
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await register(email, password);

      // Store name using Capacitor Preferences for cross-platform support
      try {
        await Preferences.set({ key: "username", value: name });
        // Fallback to localStorage for web
        localStorage.setItem("username", name);
      } catch (err) {
        // If Capacitor fails, use localStorage as fallback
        localStorage.setItem("username", name);
      }

      // Registration success is handled by the AuthContext
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Please try again.";
      setError("Failed to create an account. " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Birthday gift box */}
      <div className="absolute -top-12 -right-12 opacity-5 text-9xl z-0 transform rotate-12">
        🎁
      </div>

      {/* Floating balloons and party elements */}
      <motion.div
        className="absolute -top-4 right-4 text-2xl"
        animate={{ y: [-5, 0, -5], rotate: [5, 0, -5] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse" }}
      >
        🎂
      </motion.div>

      <motion.div
        className="absolute top-20 left-6 text-2xl"
        animate={{ y: [-4, 2, -4], rotate: [-5, 0, -5] }}
        transition={{ duration: 3.2, repeat: Infinity, repeatType: "reverse" }}
      >
        🎉
      </motion.div>

      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        Join the Celebration!
      </h2>

      <p className="text-center text-gray-600 mb-6">
        Create your account to start celebrating birthdays
      </p>

      {error && (
        <motion.div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6"
          role="alert"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="block sm:inline">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="name"
          >
            Your Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              👤
            </span>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 w-full py-3 px-4 text-gray-700 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="email"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              ✉️
            </span>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full py-3 px-4 text-gray-700 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="mb-5">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              🔒
            </span>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full py-3 px-4 text-gray-700 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200"
              required
            />
          </div>
        </div>

        <div className="mb-7">
          <label
            className="block text-gray-700 text-sm font-semibold mb-2"
            htmlFor="confirm-password"
          >
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              🔐
            </span>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 w-full py-3 px-4 text-gray-700 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200"
              required
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none w-full shadow-md relative overflow-hidden"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 5px 15px rgba(168, 85, 247, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            className="absolute inset-0 bg-white opacity-20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          {loading ? "Creating Account..." : "Register"}
        </motion.button>
      </form>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <motion.button
            onClick={onLoginClick}
            className="text-pink-500 font-semibold hover:text-pink-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login Here
          </motion.button>
        </p>
      </div>

      {/* Confetti at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-70"></div>
    </motion.div>
  );
};

export default Register;
