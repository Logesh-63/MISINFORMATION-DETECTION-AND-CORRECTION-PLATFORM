import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Lightbulb,
  AlertTriangle,
  FileText,
  Info,
} from "lucide-react";
import TruthMeter from "./TruthMeter";
import BiasMeter from "./BiasMeter";
import RiskBadge from "./RiskBadge";
import ClassificationBadge from "./ClassificationBadge";

export default function ClaimCard({ claim, index }) {
  const [expanded, setExpanded] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="glass-card glass-card-hover overflow-hidden"
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                Claim #{index + 1}
              </span>
              <RiskBadge level={claim.risk_level || "Low"} />
            </div>
            <p className="text-white/90 text-base leading-relaxed">
              {claim.claim_text}
            </p>
          </div>
          <TruthMeter score={claim.confidence_score || 0} size={100} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <ClassificationBadge classification={claim.classification} />
        </div>

        <BiasMeter score={claim.bias_score || 0} />

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showReasoning
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            {showReasoning ? "Hide" : "Show"} AI Reasoning
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
          >
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            {expanded ? "Less" : "More"} Details
          </button>
        </div>
      </div>

      {/* AI Reasoning Panel */}
      <AnimatePresence>
        {showReasoning && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-300">
                    AI Reasoning
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {claim.reasoning || "No reasoning provided."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-4">
              {/* Evidence Summary */}
              {claim.evidence_summary && (
                <DetailBlock
                  icon={<FileText className="w-4 h-4 text-cyan-400" />}
                  title="Evidence Summary"
                  content={claim.evidence_summary}
                  borderColor="border-cyan-500/20"
                  bgColor="bg-cyan-500/5"
                />
              )}

              {/* Suggested Correction */}
              {claim.suggested_correction && (
                <DetailBlock
                  icon={<Lightbulb className="w-4 h-4 text-amber-400" />}
                  title="Suggested Correction"
                  content={claim.suggested_correction}
                  borderColor="border-amber-500/20"
                  bgColor="bg-amber-500/5"
                />
              )}

              {/* Assumptions */}
              {claim.assumptions && (
                <DetailBlock
                  icon={<Info className="w-4 h-4 text-purple-400" />}
                  title="Assumptions"
                  content={claim.assumptions}
                  borderColor="border-purple-500/20"
                  bgColor="bg-purple-500/5"
                />
              )}

              {/* Limitations */}
              {claim.limitations && (
                <DetailBlock
                  icon={<AlertTriangle className="w-4 h-4 text-orange-400" />}
                  title="Limitations"
                  content={claim.limitations}
                  borderColor="border-orange-500/20"
                  bgColor="bg-orange-500/5"
                />
              )}

              {/* Conflict Notes */}
              {claim.conflict_notes && (
                <DetailBlock
                  icon={<AlertTriangle className="w-4 h-4 text-rose-400" />}
                  title="Conflicting Perspectives"
                  content={claim.conflict_notes}
                  borderColor="border-rose-500/20"
                  bgColor="bg-rose-500/5"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailBlock({ icon, title, content, borderColor, bgColor }) {
  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-semibold text-white/80">{title}</span>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{content}</p>
    </div>
  );
}
