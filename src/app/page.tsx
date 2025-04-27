"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Login from "@/components/Login";
import Register from "@/components/Register";
import BirthdayCake from "@/components/BirthdayCake";
import { motion, AnimatePresence } from "framer-motion";
import { Preferences } from "@capacitor/preferences";

export default function Home() {
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState<string>("Friend");
  const { currentUser, logout } = useAuth();
  const [showWishForm, setShowWishForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [wish, setWish] = useState("");
  const [celebrationPlan, setCelebrationPlan] = useState("");
  const [confetti, setConfetti] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Get username from localStorage if available
  useEffect(() => {
    const getStoredUsername = async () => {
      try {
        const { value } = await Preferences.get({ key: "username" });
        if (value) {
          setUsername(value);
        } else {
          // Fallback to localStorage for web
          const localValue = localStorage.getItem("username");
          if (localValue) {
            setUsername(localValue);
          }
        }
      } catch (error) {
        console.error("Error getting username:", error);
      }
    };
    getStoredUsername();
  }, []);

  // Toggle between Login and Register forms
  const toggleAuthForm = () => {
    setShowRegister(!showRegister);
  };

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Cross-platform notification
  const showCrossplatformNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Handle birthday wish form
  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wish.trim()) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5000);
      setShowWishForm(false);
      // Cross-platform notification instead of alert
      showCrossplatformNotification(`Birthday wish sent: ${wish}`);
      setWish("");
    }
  };

  // Handle celebration planning form
  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (celebrationPlan.trim()) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 5000);
      setShowPlanForm(false);
      // Cross-platform notification instead of alert
      showCrossplatformNotification(
        `Celebration plan created: ${celebrationPlan}`
      );
      setCelebrationPlan("");
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Header */}
      <motion.header
        className="flex justify-between items-center w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎂 Birthday Celebration
        </motion.div>

        {currentUser && (
          <motion.button
            onClick={handleLogout}
            className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out"
            whileHover={{ scale: 1.05, backgroundColor: "#be185d" }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Logout
          </motion.button>
        )}
      </motion.header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center w-full">
        {/* Birthday cake animation for first-time users */}
        {currentUser && <BirthdayCake username={username} />}

        {!currentUser ? (
          <AnimatePresence mode="wait">
            <motion.div
              className="w-full max-w-md mx-auto"
              key={showRegister ? "register" : "login"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {showRegister ? (
                <Register onLoginClick={toggleAuthForm} />
              ) : (
                <Login onRegisterClick={toggleAuthForm} />
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence>
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-64 h-64 relative mb-8 cursor-pointer flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: [0, -1, 1, -1, 0] }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setConfetti(true)}
              >
                {/* Cake display for logged-in users */}
                <motion.div
                  className="w-48 h-20 bg-yellow-200 rounded-md mx-auto relative mt-16"
                  animate={{
                    boxShadow: confetti
                      ? [
                          "0px 0px 0px rgba(0,0,0,0.1)",
                          "0px 10px 30px rgba(252, 231, 243, 0.8)",
                          "0px 5px 15px rgba(252, 231, 243, 0.5)",
                        ]
                      : "0px 5px 15px rgba(0,0,0,0.1)",
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: confetti ? 3 : 0,
                    repeatType: "reverse",
                  }}
                >
                  <motion.div
                    className="w-48 h-16 bg-pink-300 rounded-md absolute -top-16 left-0"
                    animate={{ y: confetti ? [0, -3, 0] : 0 }}
                    transition={{
                      duration: 0.3,
                      repeat: confetti ? 5 : 0,
                      repeatType: "reverse",
                    }}
                  ></motion.div>
                  <motion.div
                    className="w-48 h-12 bg-blue-300 rounded-md absolute -top-28 left-0"
                    animate={{ y: confetti ? [0, -5, 0] : 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.1,
                      repeat: confetti ? 5 : 0,
                      repeatType: "reverse",
                    }}
                  ></motion.div>

                  {/* Candles - positioned lower to stay within frame */}
                  <motion.div className="absolute -top-30 left-8 w-2 h-10 bg-red-500">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-yellow-500 absolute -top-2"
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          "0 0 5px 2px rgba(255, 255, 0, 0.5)",
                          "0 0 15px 5px rgba(255, 255, 0, 0.7)",
                          "0 0 5px 2px rgba(255, 255, 0, 0.5)",
                        ],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    ></motion.div>
                  </motion.div>
                  <motion.div className="absolute -top-30 left-24 w-2 h-10 bg-green-500">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-yellow-500 absolute -top-2"
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          "0 0 5px 2px rgba(255, 255, 0, 0.5)",
                          "0 0 15px 5px rgba(255, 255, 0, 0.7)",
                          "0 0 5px 2px rgba(255, 255, 0, 0.5)",
                        ],
                      }}
                      transition={{
                        duration: 0.7,
                        delay: 0.1,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    ></motion.div>
                  </motion.div>
                  <motion.div className="absolute -top-30 left-40 w-2 h-10 bg-blue-500">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-yellow-500 absolute -top-2"
                      animate={{
                        scale: [1, 1.2, 1],
                        boxShadow: [
                          "0 0 5px 2px rgba(255, 255, 0, 0.5)",
                          "0 0 15px 5px rgba(255, 255, 0, 0.7)",
                          "0 0 5px 2px rgba(255, 255, 0, 0.5)",
                        ],
                      }}
                      transition={{
                        duration: 0.6,
                        delay: 0.2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    ></motion.div>
                  </motion.div>
                </motion.div>

                {/* Confetti effect when clicked */}
                {confetti && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        style={{
                          position: "absolute",
                          width: Math.random() * 8 + 5 + "px",
                          height: Math.random() * 8 + 5 + "px",
                          borderRadius: Math.random() > 0.5 ? "50%" : "0",
                          backgroundColor: [
                            "#f472b6",
                            "#a855f7",
                            "#ec4899",
                            "#fbbf24",
                            "#60a5fa",
                            "#34d399",
                          ][i % 6],
                        }}
                        initial={{
                          top: "50%",
                          left: "50%",
                        }}
                        animate={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: [1, 0.8, 0],
                          scale: [0, 1, 0.5],
                          rotate: Math.random() * 360,
                        }}
                        transition={{
                          duration: Math.random() * 2 + 1,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.h1
                className="text-3xl font-bold mb-4 text-pink-600"
                animate={{
                  color: confetti
                    ? ["#db2777", "#ec4899", "#db2777"]
                    : "#db2777",
                }}
                transition={{ duration: 1, repeat: confetti ? 3 : 0 }}
              >
                Welcome, {username}!
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Thanks for using our Birthday Cake Celebration App!
              </motion.p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                <AnimatePresence>
                  {showWishForm ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="col-span-1 sm:col-span-2 bg-white p-4 rounded-lg shadow-md"
                    >
                      <form onSubmit={handleWishSubmit}>
                        <h3 className="text-xl font-bold text-pink-600 mb-3">
                          Send a Birthday Wish
                        </h3>
                        <textarea
                          value={wish}
                          onChange={(e) => setWish(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="Write your birthday wish here..."
                          rows={4}
                          required
                        />
                        <div className="flex justify-end gap-2">
                          <motion.button
                            type="button"
                            onClick={() => setShowWishForm(false)}
                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            type="submit"
                            className="bg-pink-500 text-white py-2 px-4 rounded"
                            whileHover={{
                              scale: 1.03,
                              backgroundColor: "#be185d",
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Send Wish
                          </motion.button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.button
                      onClick={() => setShowWishForm(true)}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 10px 20px rgba(219, 39, 119, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Send a Birthday Wish
                    </motion.button>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showPlanForm ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="col-span-1 sm:col-span-2 bg-white p-4 rounded-lg shadow-md"
                    >
                      <form onSubmit={handlePlanSubmit}>
                        <h3 className="text-xl font-bold text-purple-600 mb-3">
                          Plan a Celebration
                        </h3>
                        <textarea
                          value={celebrationPlan}
                          onChange={(e) => setCelebrationPlan(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Describe your celebration plan here..."
                          rows={4}
                          required
                        />
                        <div className="flex justify-end gap-2">
                          <motion.button
                            type="button"
                            onClick={() => setShowPlanForm(false)}
                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            type="submit"
                            className="bg-purple-500 text-white py-2 px-4 rounded"
                            whileHover={{
                              scale: 1.03,
                              backgroundColor: "#7e22ce",
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Create Plan
                          </motion.button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.button
                      onClick={() => setShowPlanForm(true)}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-2"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 10px 20px rgba(139, 92, 246, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Plan a Celebration
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Custom toast notification that works on all platforms */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg border-l-4 border-pink-500 z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <p className="text-gray-800 font-medium">{notificationMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Party emoji background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-5">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {["🎂", "🎁", "🎊", "🎈", "🥳"][i % 5]}
          </div>
        ))}
      </div>
    </div>
  );
}
