import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, RotateCcw } from "lucide-react";

export default function TextInput({ onSubmit, isLoading }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return;
    onSubmit(text.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const sampleTexts = [
    "The Great Wall of China is visible from space. It was built over 3000 years ago and is the longest wall ever built at 13,000 miles.",
    "Drinking 8 glasses of water per day is medically necessary. Humans use only 10% of their brains. Lightning never strikes the same place twice.",
    "Climate change is entirely caused by solar activity. The Earth's temperature has always fluctuated naturally. Electric vehicles produce zero emissions.",
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-semibold text-white">Analyze Content</h2>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste any text, article, or claim to analyze for misinformation..."
          className="w-full h-40 bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-white placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm leading-relaxed"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent scanning-animation" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">
            Try:
          </span>
          {sampleTexts.map((sample, i) => (
            <button
              key={i}
              onClick={() => setText(sample)}
              disabled={isLoading}
              className="text-[10px] px-2 py-1 rounded-md bg-slate-800/50 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 transition-all border border-transparent hover:border-indigo-500/20 disabled:opacity-50"
            >
              Sample {i + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {text && (
            <button
              onClick={() => setText("")}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium hover:from-indigo-500 hover:to-violet-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
          >
            <Send className="w-4 h-4" />
            Analyze
          </motion.button>
        </div>
      </div>

      <p className="text-[10px] text-slate-600 mt-3">
        Press Ctrl+Enter to analyze • Multi-paragraph support
      </p>
    </div>
  );
}
