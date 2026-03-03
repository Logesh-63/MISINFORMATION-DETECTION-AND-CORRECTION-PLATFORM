import React from "react";
import { motion } from "framer-motion";
import { Brain, Scan, Database, FileCheck } from "lucide-react";

const steps = [
  { icon: Scan, label: "Extracting claims..." },
  { icon: Brain, label: "Analyzing context..." },
  { icon: Database, label: "Evaluating evidence..." },
  { icon: FileCheck, label: "Generating report..." },
];

export default function ScanningAnimation({ currentStep = 0 }) {
  return (
    <div className="glass-card p-8 max-w-md mx-auto">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Brain */}
        <div className="relative">
          <motion.div
            className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 20px rgba(99, 102, 241, 0.2)",
                "0 0 50px rgba(139, 92, 246, 0.4)",
                "0 0 20px rgba(99, 102, 241, 0.2)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-10 h-10 text-indigo-400" />
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-indigo-400/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <h3 className="text-lg font-semibold neon-text">
          AI Analysis in Progress
        </h3>

        {/* Steps */}
        <div className="w-full space-y-3">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === currentStep;
            const isDone = i < currentStep;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-500 ${
                  isActive
                    ? "bg-indigo-500/10 border border-indigo-500/30"
                    : isDone
                      ? "bg-green-500/5 border border-green-500/20"
                      : "bg-slate-800/30 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? "text-indigo-400"
                      : isDone
                        ? "text-green-400"
                        : "text-slate-600"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isActive
                      ? "text-indigo-300"
                      : isDone
                        ? "text-green-300"
                        : "text-slate-600"
                  }`}
                >
                  {step.label}
                </span>
                {isActive && (
                  <motion.div
                    className="ml-auto w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                )}
                {isDone && (
                  <span className="ml-auto text-green-400 text-xs">✓</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
