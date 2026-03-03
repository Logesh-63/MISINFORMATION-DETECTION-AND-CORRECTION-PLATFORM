import { motion } from "framer-motion";

export default function BiasMeter({ score = 0 }) {
  const getColor = (s) => {
    if (s <= 20) return "#22c55e";
    if (s <= 40) return "#84cc16";
    if (s <= 60) return "#eab308";
    if (s <= 80) return "#f97316";
    return "#ef4444";
  };

  const getLabel = (s) => {
    if (s <= 20) return "Minimal Bias";
    if (s <= 40) return "Low Bias";
    if (s <= 60) return "Moderate Bias";
    if (s <= 80) return "High Bias";
    return "Extreme Bias";
  };

  const color = getColor(score);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-slate-400 uppercase tracking-wider">
          Bias Detection
        </span>
        <span className="text-xs font-medium" style={{ color }}>
          {getLabel(score)}
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}40` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-600">0</span>
        <span className="text-[10px] text-slate-600">100</span>
      </div>
    </div>
  );
}
