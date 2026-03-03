import React from "react";
import { motion } from "framer-motion";
import { BarChart3, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import TruthMeter from "./TruthMeter";

export default function OverallSummary({ claims }) {
  if (!claims || claims.length === 0) return null;

  const avgConfidence = Math.round(
    claims.reduce((sum, c) => sum + (c.confidence_score || 0), 0) /
      claims.length,
  );
  const avgBias = Math.round(
    claims.reduce((sum, c) => sum + (c.bias_score || 0), 0) / claims.length,
  );

  const classificationCounts = claims.reduce((acc, c) => {
    acc[c.classification] = (acc[c.classification] || 0) + 1;
    return acc;
  }, {});

  const highRiskCount = claims.filter((c) => c.risk_level === "High").length;
  const verifiedCount = classificationCounts["Verified True"] || 0;
  const falseCount = classificationCounts["False"] || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-semibold text-white">Analysis Summary</h2>
        <span className="ml-auto text-xs text-slate-500">
          {claims.length} claims analyzed
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center p-4 rounded-xl bg-slate-800/30">
          <TruthMeter score={avgConfidence} size={80} />
          <span className="text-[10px] text-slate-500 mt-1">
            Avg Confidence
          </span>
        </div>

        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-emerald-400" />}
          value={verifiedCount}
          label="Verified True"
          color="text-emerald-400"
        />
        <StatCard
          icon={<XCircle className="w-5 h-5 text-red-400" />}
          value={falseCount}
          label="False Claims"
          color="text-red-400"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
          value={highRiskCount}
          label="High Risk"
          color="text-amber-400"
        />
      </div>

      {/* Classification Breakdown */}
      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(classificationCounts).map(([label, count]) => (
          <div
            key={label}
            className="px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/30"
          >
            <span className="text-xs text-slate-400">{label}: </span>
            <span className="text-xs font-semibold text-white">{count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/30">
      {icon}
      <span className={`text-2xl font-bold mt-2 ${color}`}>{value}</span>
      <span className="text-[10px] text-slate-500 text-center">{label}</span>
    </div>
  );
}
