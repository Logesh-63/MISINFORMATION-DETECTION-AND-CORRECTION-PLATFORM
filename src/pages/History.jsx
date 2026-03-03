import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  History as HistoryIcon,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
} from "lucide-react";
import ClaimCard from "@/components/analysis/ClaimCard";
import ClassificationBadge from "@/components/analysis/ClassificationBadge";
import { format } from "date-fns";

export default function History() {
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [filterClassification, setFilterClassification] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: claims = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["claims"],
    queryFn: () => base44.entities.Claim.list("-created_date", 200),
  });

  // Group claims by batch
  const batches = claims.reduce((acc, claim) => {
    const batchId = claim.analysis_batch_id || claim.id;
    if (!acc[batchId]) {
      acc[batchId] = {
        id: batchId,
        claims: [],
        created_date: claim.created_date,
        original_text: claim.original_text,
      };
    }
    acc[batchId].claims.push(claim);
    return acc;
  }, {});

  const batchList = Object.values(batches).sort(
    (a, b) => new Date(b.created_date) - new Date(a.created_date),
  );

  // Filter
  const filteredBatches = batchList.filter((batch) => {
    const matchesSearch =
      !searchQuery ||
      batch.original_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.claims.some((c) =>
        c.claim_text?.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesFilter =
      filterClassification === "all" ||
      batch.claims.some((c) => c.classification === filterClassification);

    return matchesSearch && matchesFilter;
  });

  const handleDeleteBatch = async (batch) => {
    for (const claim of batch.claims) {
      await base44.entities.Claim.delete(claim.id);
    }
    refetch();
  };

  const classifications = [
    "all",
    "Verified True",
    "False",
    "Partially Misleading",
    "Unverifiable",
    "Opinion",
    "Prediction",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white">Analysis History</h1>
          <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-md">
            {batchList.length} analyses
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search analyses..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            {classifications.map((c) => (
              <button
                key={c}
                onClick={() => setFilterClassification(c)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterClassification === c
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                    : "bg-slate-800/30 text-slate-500 hover:text-slate-300 border border-transparent"
                }`}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Batch List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-3/4 mb-3" />
              <div className="h-3 bg-slate-800/50 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HistoryIcon className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 text-sm">No analyses found</p>
          <p className="text-slate-600 text-xs mt-1">
            Run an analysis from the Dashboard to see results here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBatches.map((batch) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card glass-card-hover overflow-hidden"
            >
              {/* Batch Header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() =>
                  setExpandedBatch(expandedBatch === batch.id ? null : batch.id)
                }
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 line-clamp-2 mb-2">
                      {batch.original_text?.slice(0, 200)}
                      {(batch.original_text?.length || 0) > 200 ? "..." : ""}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px]">
                          {batch.created_date
                            ? format(
                                new Date(batch.created_date),
                                "MMM d, yyyy HH:mm",
                              )
                            : "Unknown"}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-600">•</span>
                      <span className="text-[10px] text-slate-500">
                        {batch.claims.length} claims
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {[
                          ...new Set(batch.claims.map((c) => c.classification)),
                        ].map((cls) => (
                          <ClassificationBadge key={cls} classification={cls} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBatch(batch);
                      }}
                      className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedBatch === batch.id ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Claims */}
              <AnimatePresence>
                {expandedBatch === batch.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-3 border-t border-slate-800/50 pt-4">
                      {batch.claims.map((claim, i) => (
                        <ClaimCard key={claim.id} claim={claim} index={i} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
