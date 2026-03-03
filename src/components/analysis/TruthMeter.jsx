import React from "react";
import { motion } from "framer-motion";

export default function TruthMeter({ score = 0, size = 160 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 75)
      return {
        stroke: "#22c55e",
        glow: "rgba(34, 197, 94, 0.3)",
        label: "High Credibility",
      };
    if (s >= 50)
      return {
        stroke: "#eab308",
        glow: "rgba(234, 179, 8, 0.3)",
        label: "Moderate",
      };
    if (s >= 25)
      return {
        stroke: "#f97316",
        glow: "rgba(249, 115, 22, 0.3)",
        label: "Low Credibility",
      };
    return {
      stroke: "#ef4444",
      glow: "rgba(239, 68, 68, 0.3)",
      label: "Very Low",
    };
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(99, 102, 241, 0.1)"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color.stroke}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color.glow})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold"
            style={{ color: color.stroke }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
            Credibility
          </span>
        </div>
      </div>
      <span className="text-xs font-medium" style={{ color: color.stroke }}>
        {color.label}
      </span>
    </div>
  );
}
