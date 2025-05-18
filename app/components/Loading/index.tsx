// components/Loading.tsx
"use client";

import { motion } from "framer-motion";

type LoadingProps = {
  message?: string;
};

export default function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className={"flex flex-col items-center justify-center h-full " }>
      <div className="relative w-20 h-20">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute top-0 left-0 w-20 h-28 bg-gradient-to-br from-indigo-200 to-indigo-400 rounded-xl shadow-md"
            style={{ zIndex: 3 - i }}
            animate={{
              x: [0, -10 + i * 5, 0],
              rotate: [0, -2 + i, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 1.5 + i * 0.2,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <p className="mt-10 text-sm text-matchita-text italic animate-pulse">{message}</p>
    </div>
  );
}
