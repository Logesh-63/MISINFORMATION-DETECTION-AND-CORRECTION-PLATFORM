import React from "react";
import { AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";

export default function RiskBadge({ level = "Low" }) {
  const config = {
    Low: {
      icon: ShieldCheck,
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-400",
      glow: "shadow-green-500/10",
    },
    Medium: {
      icon: AlertTriangle,
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      text: "text-yellow-400",
      glow: "shadow-yellow-500/10",
    },
    High: {
      icon: ShieldAlert,
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-400",
      glow: "shadow-red-500/10",
    },
  };

  const c = config[level] || config.Low;
  const Icon = c.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${c.bg} ${c.border} ${c.glow} shadow-lg`}
    >
      <Icon className={`w-3.5 h-3.5 ${c.text}`} />
      <span className={`text-xs font-semibold ${c.text}`}>{level} Risk</span>
    </div>
  );
}
