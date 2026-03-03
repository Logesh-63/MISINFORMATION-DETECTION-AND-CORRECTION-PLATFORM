import React from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

export default function ClassificationBadge({ classification }) {
  const config = {
    "Verified True": {
      icon: CheckCircle,
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
    },
    False: {
      icon: XCircle,
      bg: "bg-red-500/15",
      border: "border-red-500/30",
      text: "text-red-400",
    },
    "Partially Misleading": {
      icon: AlertCircle,
      bg: "bg-amber-500/15",
      border: "border-amber-500/30",
      text: "text-amber-400",
    },
    Unverifiable: {
      icon: HelpCircle,
      bg: "bg-slate-500/15",
      border: "border-slate-500/30",
      text: "text-slate-400",
    },
    Opinion: {
      icon: MessageCircle,
      bg: "bg-purple-500/15",
      border: "border-purple-500/30",
      text: "text-purple-400",
    },
    Prediction: {
      icon: TrendingUp,
      bg: "bg-cyan-500/15",
      border: "border-cyan-500/30",
      text: "text-cyan-400",
    },
  };

  const c = config[classification] || config["Unverifiable"];
  const Icon = c.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${c.bg} ${c.border}`}
    >
      <Icon className={`w-4 h-4 ${c.text}`} />
      <span className={`text-sm font-semibold ${c.text}`}>
        {classification}
      </span>
    </div>
  );
}
