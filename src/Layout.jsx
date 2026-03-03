import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, BarChart3, History, Zap } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { name: "Dashboard", icon: Zap, page: "Dashboard" },
    { name: "History", icon: History, page: "History" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <style>{`
        :root {
          --background: 240 20% 5%;
          --foreground: 0 0% 100%;
          --card: 240 20% 8%;
          --card-foreground: 0 0% 100%;
          --popover: 240 20% 8%;
          --popover-foreground: 0 0% 100%;
          --primary: 239 84% 67%;
          --primary-foreground: 0 0% 100%;
          --secondary: 240 20% 15%;
          --secondary-foreground: 0 0% 100%;
          --muted: 240 20% 15%;
          --muted-foreground: 240 5% 60%;
          --accent: 240 20% 15%;
          --accent-foreground: 0 0% 100%;
          --destructive: 0 84% 60%;
          --destructive-foreground: 0 0% 100%;
          --border: 240 20% 18%;
          --input: 240 20% 18%;
          --ring: 239 84% 67%;
        }
      `}</style>

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-indigo-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to={createPageUrl("Dashboard")}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <Shield className="w-8 h-8 text-indigo-400" />
                <div className="absolute inset-0 blur-lg bg-indigo-500/30 rounded-full" />
              </div>
              <div>
                <span className="text-lg font-bold neon-text">
                  TruthLens AI
                </span>
                <span className="hidden sm:block text-[10px] text-slate-500 -mt-1">
                  Misinformation Analysis
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    currentPageName === item.page
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>

      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/3 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
