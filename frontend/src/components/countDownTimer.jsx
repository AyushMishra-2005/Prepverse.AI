// components/CountdownTimer.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CountdownTimer = ({ duration = 30, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="relative w-24 h-24">
      <svg className="transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50" cy="50" r="45"
          className="stroke-current text-gray-300"
          strokeWidth="10"
          fill="none"
        />
        <motion.circle
          cx="50" cy="50" r="45"
          stroke="currentColor"
          className="text-blue-500"
          strokeWidth="10"
          strokeDasharray="282.6"
          strokeDashoffset={(282.6 * (100 - percentage)) / 100}
          fill="none"
          initial={false}
          animate={{ strokeDashoffset: (282.6 * (100 - percentage)) / 100 }}
          transition={{ duration: 1 }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {timeLeft}s
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
