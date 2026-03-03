import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import TextInput from "@/components/analysis/TextInput";
import ScanningAnimation from "@/components/analysis/ScanningAnimation";
import ClaimCard from "@/components/analysis/ClaimCard";
import OverallSummary from "@/components/analysis/OverallSummary";
import { Shield, Zap, Brain, Eye } from "lucide-react";

export default function Dashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [results, setResults] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setScanStep((prev) => Math.min(prev + 1, 3));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const analyzeText = async (text) => {
    setIsAnalyzing(true);
    setScanStep(0);
    setResults(null);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are TruthLens AI, an advanced misinformation analysis engine. Analyze the following text by:

1. CLAIM EXTRACTION: Split the text into individual factual claims. Each distinct assertion should be a separate claim.
2. For EACH claim, perform deep analysis:
   - Classify as: "Verified True", "False", "Partially Misleading", "Unverifiable", "Opinion", or "Prediction"
   - Detect temporal references (future → Prediction), subjective language (→ Opinion), ambiguity
   - Evaluate evidence: determine if evidence supports, refutes, or is neutral
   - Calculate confidence_score (0-100) based on evidence strength, consistency, and data availability
   - Calculate bias_score (0-100) where 0 = no bias, 100 = extreme bias
   - Determine risk_level: "Low", "Medium", or "High"
   - Provide detailed reasoning explaining your classification step by step
   - Summarize evidence found
   - If False or Partially Misleading, suggest a corrected statement
   - Document assumptions made
   - Document limitations of the analysis
   - Note any conflicting perspectives

IMPORTANT RULES:
- Never be overconfident without strong evidence
- If evidence is insufficient, classify as "Unverifiable"
- If partially correct, classify as "Partially Misleading" with explanation
- Handle conflicting information by noting multiple perspectives
- Be transparent about uncertainty

TEXT TO ANALYZE:
"""
${text}
"""`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          claims: {
            type: "array",
            items: {
              type: "object",
              properties: {
                claim_text: { type: "string" },
                classification: { type: "string" },
                confidence_score: { type: "number" },
                bias_score: { type: "number" },
                risk_level: { type: "string" },
                reasoning: { type: "string" },
                evidence_summary: { type: "string" },
                suggested_correction: { type: "string" },
                assumptions: { type: "string" },
                limitations: { type: "string" },
                conflict_notes: { type: "string" },
              },
            },
          },
        },
      },
    });

    const claims = response.claims || [];

    // Save to database
    const batchId =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const savePromises = claims.map((claim) =>
      base44.entities.Claim.create({
        ...claim,
        original_text: text,
        analysis_batch_id: batchId,
      }),
    );
    await Promise.all(savePromises);

    setResults(claims);
    setIsAnalyzing(false);
    setScanStep(0);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-medium text-indigo-300">
            AI-Powered Real-Time Analysis
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="neon-text">TruthLens AI</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
          Intelligent misinformation detection with contextual reasoning,
          evidence evaluation, and transparent explainability.
        </p>

        <div className="flex items-center justify-center gap-8 mt-8">
          <FeatureTag
            icon={<Brain className="w-4 h-4" />}
            label="Context-Aware"
          />
          <FeatureTag
            icon={<Eye className="w-4 h-4" />}
            label="Transparent AI"
          />
          <FeatureTag
            icon={<Shield className="w-4 h-4" />}
            label="Responsible"
          />
        </div>
      </motion.div>

      {/* Input Section */}
      <TextInput onSubmit={analyzeText} isLoading={isAnalyzing} />

      {/* Scanning Animation */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <ScanningAnimation currentStep={scanStep} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {results && (
        <div ref={resultsRef} className="space-y-6">
          <OverallSummary claims={results} />
          <div className="space-y-4">
            {results.map((claim, i) => (
              <ClaimCard key={i} claim={claim} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureTag({ icon, label }) {
  return (
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
