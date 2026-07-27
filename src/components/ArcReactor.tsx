import React from "react";
import { motion } from "motion/react";

interface ArcReactorProps {
  state: "idle" | "listening" | "thinking" | "speaking";
}

export default function ArcReactor({ state }: ArcReactorProps) {
  // Determine reactor color scheme based on current state
  const colors = {
    idle: {
      glow: "rgba(6, 182, 212, 0.4)", // cyan-500
      core: "bg-cyan-400",
      ring: "text-cyan-500/60",
      accent: "text-cyan-300",
    },
    listening: {
      glow: "rgba(168, 85, 247, 0.6)", // purple-500
      core: "bg-purple-400 animate-ping",
      ring: "text-purple-500/80",
      accent: "text-purple-300",
    },
    thinking: {
      glow: "rgba(245, 158, 11, 0.6)", // amber-500
      core: "bg-amber-400",
      ring: "text-amber-500/80",
      accent: "text-amber-300",
    },
    speaking: {
      glow: "rgba(16, 185, 129, 0.6)", // emerald-500
      core: "bg-emerald-400",
      ring: "text-emerald-500/80",
      accent: "text-emerald-300",
    },
  }[state];

  // Adjust animation speeds based on state
  const speedMultiplier = {
    idle: 1,
    listening: 2,
    thinking: 3.5,
    speaking: 1.5,
  }[state];

  return (
    <div className="relative flex items-center justify-center w-64 h-64 mx-auto select-none" id="arc-reactor-container">
      {/* Background Glow */}
      <div
        className="absolute rounded-full w-48 h-48 blur-2xl transition-all duration-700"
        style={{ backgroundColor: colors.glow }}
      />

      {/* Outer Holographic Grid Ring - Spins Clockwise */}
      <motion.div
        className="absolute w-56 h-56"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 30 / speedMultiplier,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 100 100" className={`w-full h-full ${colors.ring}`}>
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 8 2 8 8 4"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            strokeOpacity="0.3"
          />
        </svg>
      </motion.div>

      {/* Middle Segmented Ring - Spins Counter-Clockwise */}
      <motion.div
        className="absolute w-44 h-44"
        animate={{ rotate: -360 }}
        transition={{
          repeat: Infinity,
          duration: 15 / speedMultiplier,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 100 100" className={`w-full h-full ${colors.ring}`}>
          {/* Segmented notches */}
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="currentColor"
            strokeWidth="3.5"
            fill="none"
            strokeDasharray="15 6 4 6"
          />
          {/* Internal diagnostic marks */}
          <path
            d="M 50 2 L 50 8 M 50 92 L 50 98 M 2 50 L 8 50 M 92 50 L 98 50"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
        </svg>
      </motion.div>

      {/* Inner Tech Shards Ring - Spins Clockwise */}
      <motion.div
        className="absolute w-32 h-32"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 8 / speedMultiplier,
          ease: "linear",
        }}
      >
        <svg viewBox="0 0 100 100" className={`w-full h-full ${colors.accent}`}>
          {/* Triangular shard teeth pointed inwards */}
          <circle
            cx="50"
            cy="50"
            r="28"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            strokeDasharray="1 15"
            strokeLinecap="round"
          />
          <path
            d="M 50 15 L 48 20 L 52 20 Z M 50 85 L 48 80 L 52 80 Z M 15 50 L 20 48 L 20 52 Z M 85 50 L 80 48 L 80 52 Z"
            fill="currentColor"
            opacity="0.8"
          />
        </svg>
      </motion.div>

      {/* Power Core - Dynamic Pulsing */}
      <motion.div
        className={`absolute rounded-full w-14 h-14 flex items-center justify-center transition-all duration-500`}
        animate={
          state === "listening"
            ? { scale: [1, 1.2, 1] }
            : state === "thinking"
            ? { scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }
            : state === "speaking"
            ? { scale: [1, 1.25, 1.1, 1.3, 1] }
            : { scale: [1, 1.05, 1] }
        }
        transition={{
          repeat: Infinity,
          duration: state === "speaking" ? 0.4 : 2,
          ease: "easeInOut",
        }}
      >
        {/* Glowing inner core */}
        <div className={`absolute inset-0 rounded-full ${colors.core} filter blur-md opacity-80`} />
        <div className="relative rounded-full w-8 h-8 bg-white shadow-lg flex items-center justify-center">
          {/* Little tech markings inside the central glass */}
          <div className="w-4 h-4 rounded-full border border-cyan-500/30 border-dashed animate-spin" />
        </div>
      </motion.div>

      {/* Visualizer Waves for Speaking state */}
      {state === "speaking" && (
        <div className="absolute inset-x-0 bottom-[-20px] flex justify-center items-end gap-1 h-8 px-4">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-emerald-400 rounded-full"
              animate={{
                height: [
                  "4px",
                  `${Math.floor(10 + Math.random() * 26)}px`,
                  "4px",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.3 + i * 0.05,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {state === "listening" && (
        <div className="absolute inset-x-0 bottom-[-20px] flex justify-center items-center gap-1.5 text-xs text-purple-400 font-mono tracking-wider bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
          SYSTEM LISTENING...
        </div>
      )}

      {state === "thinking" && (
        <div className="absolute inset-x-0 bottom-[-20px] flex justify-center items-center gap-1.5 text-xs text-amber-400 font-mono tracking-wider bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
          COMPUTING VECTORS...
        </div>
      )}
    </div>
  );
}
