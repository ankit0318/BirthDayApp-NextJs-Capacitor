"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { storageService } from "@/lib/storage";

interface BirthdayCakeProps {
  username?: string;
  onCelebrationComplete?: () => void;
}

/**
 * BirthdayCake Component
 *
 * Displays an animated birthday cake for first-time users with a personalized message.
 * Uses Framer Motion for smooth animations across all platforms.
 */
const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  username = "Friend",
  onCelebrationComplete,
}) => {
  const [visible, setVisible] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [candlesOut, setCandlesOut] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    // Function to check if this is the first login
    const checkFirstLogin = async () => {
      try {
        const isFirstLogin = await storageService.isFirstLogin();
        setVisible(isFirstLogin);

        // If it's the first login, we'll mark it as seen after showing the animation
        if (isFirstLogin) {
          setTimeout(() => {
            storageService.markFirstLoginComplete();
            // Show celebratory message after a delay
            setShowMessage(true);
          }, 4000); // Mark as complete after animation ends
        }
      } catch (error) {
        console.error("Error checking first login status:", error);
      }
    };

    checkFirstLogin();
  }, []);

  // Handle the completion of the celebration
  const handleCelebrationComplete = () => {
    setVisible(false);
    if (onCelebrationComplete) {
      onCelebrationComplete();
    }
  };

  // Handle blowing candles
  const handleBlowCandles = () => {
    if (candlesOut) return;

    setIsBlowing(true);
    setTimeout(() => {
      setCandlesOut(true);
      setIsBlowing(false);
      setConfettiActive(true);
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setConfettiActive(false);
      }, 5000);
    }, 1000);
  };

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-sm mx-auto text-center relative overflow-hidden"
        initial={{ scale: 0.5, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2,
        }}
      >
        {/* Interactive instruction */}
        {!candlesOut && (
          <motion.p
            className="text-gray-500 text-sm absolute top-2 left-0 right-0 mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            Click the candles to blow them out!
          </motion.p>
        )}

        {/* Cake Base */}
        <div className="mx-auto w-64 relative mb-6 pt-12">
          <motion.div
            className="w-48 h-20 bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-md mx-auto relative cursor-pointer"
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              boxShadow: isBlowing
                ? "0 0 20px rgba(255, 255, 0, 0.5)"
                : "0 5px 15px rgba(0, 0, 0, 0.1)",
            }}
            transition={{ delay: 1 }}
          >
            {/* Cake decorations */}
            <motion.div
              className="absolute bottom-0 left-0 w-full h-4 flex justify-around"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 rounded-full bg-pink-300"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 1.5 + i * 0.1 }}
                />
              ))}
            </motion.div>

            {/* Cake layers */}
            <motion.div
              className="w-48 h-16 bg-gradient-to-r from-pink-300 to-pink-200 rounded-md absolute -top-16 left-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1, y: isBlowing ? -2 : 0 }}
              transition={{ delay: 1.2 }}
            >
              {/* Layer decorations */}
              <motion.div className="absolute bottom-2 left-0 w-full h-2 flex justify-around">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.4 + i * 0.1 }}
                  />
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="w-48 h-12 bg-gradient-to-r from-blue-300 to-blue-200 rounded-md absolute -top-28 left-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1, y: isBlowing ? -4 : 0 }}
              transition={{ delay: 1.4 }}
            >
              {/* Top layer decorations */}
              <motion.div className="absolute top-1 left-0 w-full flex justify-center">
                <motion.div
                  className="w-20 h-3 rounded-full bg-blue-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6 }}
                />
              </motion.div>
            </motion.div>

            {/* Candles - now clickable and positioned lower */}
            <div
              className="absolute -top-28 left-0 w-full flex justify-around"
              onClick={handleBlowCandles}
            >
              {/* First candle */}
              <motion.div
                className="w-2 h-8 bg-red-500 cursor-pointer"
                initial={{ height: 0 }}
                animate={{ height: 8 }}
                transition={{ delay: 1.6 }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-yellow-500 absolute -top-2"
                  initial={{ scale: 0 }}
                  animate={
                    candlesOut
                      ? { opacity: 0, scale: 0 }
                      : {
                          scale: [0.8, 1.2, 0.8],
                          boxShadow: [
                            "0 0 5px 2px rgba(255, 255, 0, 0.5)",
                            "0 0 20px 10px rgba(255, 255, 0, 0.7)",
                            "0 0 5px 2px rgba(255, 255, 0, 0.5)",
                          ],
                        }
                  }
                  transition={{
                    duration: 0.8,
                    repeat: candlesOut ? 0 : Infinity,
                    repeatType: "reverse",
                  }}
                />
                {isBlowing && !candlesOut && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-12 bg-blue-400 rounded-full opacity-50"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: [0.5, 0.2, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.div>

              {/* Second candle */}
              <motion.div
                className="w-2 h-8 bg-green-500 cursor-pointer"
                initial={{ height: 0 }}
                animate={{ height: 8 }}
                transition={{ delay: 1.7 }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-yellow-500 absolute -top-2"
                  initial={{ scale: 0 }}
                  animate={
                    candlesOut
                      ? { opacity: 0, scale: 0 }
                      : {
                          scale: [0.8, 1.2, 0.8],
                          boxShadow: [
                            "0 0 5px 2px rgba(255, 255, 0, 0.5)",
                            "0 0 20px 10px rgba(255, 255, 0, 0.7)",
                            "0 0 5px 2px rgba(255, 255, 0, 0.5)",
                          ],
                        }
                  }
                  transition={{
                    duration: 0.9,
                    delay: 0.1,
                    repeat: candlesOut ? 0 : Infinity,
                    repeatType: "reverse",
                  }}
                />
                {isBlowing && !candlesOut && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-12 bg-blue-400 rounded-full opacity-50"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: [0.5, 0.2, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.div>

              {/* Third candle */}
              <motion.div
                className="w-2 h-8 bg-blue-500 cursor-pointer"
                initial={{ height: 0 }}
                animate={{ height: 8 }}
                transition={{ delay: 1.8 }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-yellow-500 absolute -top-2"
                  initial={{ scale: 0 }}
                  animate={
                    candlesOut
                      ? { opacity: 0, scale: 0 }
                      : {
                          scale: [0.8, 1.2, 0.8],
                          boxShadow: [
                            "0 0 5px 2px rgba(255, 255, 0, 0.5)",
                            "0 0 20px 10px rgba(255, 255, 0, 0.7)",
                            "0 0 5px 2px rgba(255, 255, 0, 0.5)",
                          ],
                        }
                  }
                  transition={{
                    duration: 0.7,
                    delay: 0.2,
                    repeat: candlesOut ? 0 : Infinity,
                    repeatType: "reverse",
                  }}
                />
                {isBlowing && !candlesOut && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-12 bg-blue-400 rounded-full opacity-50"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: [0.5, 0.2, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Message */}
        <AnimatePresence>
          {!showMessage && candlesOut ? (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="mb-4"
            >
              <motion.h2
                className="text-2xl font-bold text-pink-600"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                You did it!
              </motion.h2>
              <motion.p
                className="text-gray-600 mt-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Make a wish!
              </motion.p>
            </motion.div>
          ) : (
            <motion.div className="mb-4">
              <motion.h2
                className="text-2xl font-bold text-pink-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: showMessage ? 0 : 2.5 }}
              >
                Happy Birthday, {username}!
              </motion.h2>

              <motion.p
                className="text-gray-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: showMessage ? 0.2 : 3 }}
              >
                Welcome to our celebration app! We&apos;re so excited you joined
                us today.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti effect - enhanced */}
        <div className="absolute inset-0 pointer-events-none">
          {(candlesOut || confettiActive) &&
            [...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: Math.random() * 8 + 5 + "px",
                  height: Math.random() * 8 + 5 + "px",
                  borderRadius: Math.random() > 0.5 ? "50%" : "0",
                  background: [
                    "#ff77e9",
                    "#7928ca",
                    "#ff4500",
                    "#ffeb3b",
                    "#4299e1",
                    "#34d399",
                    "#f472b6",
                    "#a855f7",
                    "#fbbf24",
                  ][i % 9],
                }}
                initial={{
                  top: "50%",
                  left: "50%",
                  scale: 0,
                }}
                animate={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  scale: [0, 1, 0.5],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
        </div>

        {/* Continue button with enhanced animation */}
        <motion.button
          onClick={handleCelebrationComplete}
          className={`mt-4 ${
            candlesOut
              ? "bg-gradient-to-r from-purple-600 to-pink-600"
              : "bg-gradient-to-r from-pink-500 to-rose-500"
          } text-white font-bold py-3 px-8 rounded-full shadow-lg focus:outline-none relative overflow-hidden`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: candlesOut ? 1 : 4 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 8px 25px rgba(219, 39, 119, 0.4)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            className="absolute inset-0 bg-white opacity-20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          Continue to App
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default BirthdayCake;
