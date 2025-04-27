"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

interface LoginProps {
  onRegisterClick: () => void;
}

/**
 * Login Component
 *
 * Provides a form for users to login with email and password
 * Uses the AuthContext for authentication functionality
 */
const Login: React.FC<LoginProps> = ({ onRegisterClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  /**
   * Handle form submission for login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      // We don't need the userCredential result in this component
      await login(email, password);
      // Login success is handled by the AuthContext
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Please try again.";
      setError("Failed to log in. " + errorMessage);
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
      {/* Birthday cake icon */}
      <div className="absolute -top-10 -right-10 opacity-5 text-9xl z-0 transform rotate-12">
        🎂
      </div>

      {/* Floating balloons */}
      <motion.div
        className="absolute -top-4 left-4 text-2xl"
        animate={{ y: [-5, 0, -5], rotate: [5, 0, -5] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      >
        🎈
      </motion.div>

      <motion.div
        className="absolute top-10 right-8 text-2xl"
        animate={{ y: [-4, 2, -4], rotate: [-5, 0, -5] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      >
        🎈
      </motion.div>

      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        Welcome Back!
      </h2>

      <p className="text-center text-gray-600 mb-6">
        Sign in to continue the celebration
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
        <div className="mb-6">
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

        <div className="mb-8">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full py-3 px-4 text-gray-700 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all duration-200"
              required
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none w-full shadow-md relative overflow-hidden"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 5px 15px rgba(236, 72, 153, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            className="absolute inset-0 bg-white opacity-20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          {loading ? "Logging in..." : "Login"}
        </motion.button>
      </form>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <motion.button
            onClick={onRegisterClick}
            className="text-pink-500 font-semibold hover:text-pink-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register Now
          </motion.button>
        </p>
      </div>

      {/* Confetti at the bottom */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-70"></div>
    </motion.div>
  );
};

export default Login;
