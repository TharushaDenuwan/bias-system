"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  AlertTriangle,
  BarChart3,
  Binary,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Cpu,
  FileText,
  Info,
  Layers,
  Play,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Upload
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface ProbabilityMap {
  [className: string]: number;
}

interface PredictionOutput {
  status: "success" | "error";
  input_length_chars?: number;
  cleaned_length_chars?: number;
  predictions?: {
    bias_level?: {
      predicted_label: string;
      model_used: string;
      class_probabilities?: ProbabilityMap;
    };
    bias_direction?: {
      predicted_label: string;
      model_used: string;
      class_probabilities?: ProbabilityMap;
    };
  };
  disclaimer?: string;
  message?: string;
}

const PRESET_EXAMPLES = [
  {
    title: "Anti-Government Criticism",
    sinhalaTitle: "විපක්ෂ විවේචනය (Anti-Gov)",
    category: "Anti-Government",
    badgeColor: "border-rose-500/40 text-rose-300 bg-rose-500/10",
    text: "ගොවීන්ට වෙලාවට පොහොර ටික දෙන්නවත් බැරි තරමට මේ ආණ්ඩුව අසමත් බවත් රට දැඩි ආර්ථික අර්බුදයකට ඇද දමා ඇති බවත් විපක්ෂ නායකවරයා දැඩි ලෙස පවසයි.",
  },
  {
    title: "Pro-Government Development",
    sinhalaTitle: "රාජ්‍ය සංවර්ධනය (Pro-Gov)",
    category: "Pro-Government",
    badgeColor: "border-sky-500/40 text-sky-300 bg-sky-500/10",
    text: "ජනාධිපතිතුමා නව ආර්ථික සංවර්ධන ව්‍යාපෘති රැසක් ජනතා අයිතියට පත් කරමින් රට ස්ථාවරත්වයට ගෙන ඒමට රජය කඩිනම් ක්‍රියාමාර්ග ගන්නා බව ප්‍රකාශ කළේය.",
  },
  {
    title: "Neutral Central Bank Policy",
    sinhalaTitle: "මහ බැංකු වාර්තාව (Neutral)",
    category: "Neutral",
    badgeColor: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
    text: "ශ්‍රී ලංකා මහ බැංකුව විසින් ප්‍රතිපත්තිමය පොලී අනුපාතික නොවෙනස්ව පවත්වා ගැනීමට අද දින තීරණය කළ අතර උද්ධමනය පාලනය වී ඇති බව නිවේදනය කළේය.",
  },
  {
    title: "High Controversy Dispute",
    sinhalaTitle: "දූෂණ විරෝධය (High Bias)",
    category: "High Bias",
    badgeColor: "border-amber-500/40 text-amber-300 bg-amber-500/10",
    text: "දූෂිත දේශපාලන අධිකාරිය මහජන ධනය කොල්ලකෑම වහා නතර කළ යුතු බවට සිවිල් සංවිධාන සහ වෘත්තීය සමිති කොළඹදී දැවැන්ත විරෝධතාවක් පැවැත්වූහ.",
  },
];

// Evaluation metrics verified directly from evaluate.py summary report
const EVAL_SUMMARY = [
  {
    target: "Bias Direction",
    model: "Word TF-IDF + LogReg",
    accuracy: 91.4,
    macroF1: 90.0,
    weightedF1: 91.4,
    precision: 91.2,
    recall: 89.2,
    samples: 500,
    isBest: true,
  },
  {
    target: "Bias Direction",
    model: "Char TF-IDF + LogReg",
    accuracy: 88.6,
    macroF1: 88.4,
    weightedF1: 88.7,
    precision: 88.8,
    recall: 88.9,
    samples: 500,
    isBest: false,
  },
  {
    target: "Bias Direction",
    model: "Char TF-IDF + Linear SVM",
    accuracy: 88.2,
    macroF1: 83.5,
    weightedF1: 87.4,
    precision: 92.2,
    recall: 80.0,
    samples: 500,
    isBest: false,
  },
  {
    target: "Bias Level",
    model: "Word TF-IDF + LogReg",
    accuracy: 88.8,
    macroF1: 86.7,
    weightedF1: 88.8,
    precision: 87.1,
    recall: 86.4,
    samples: 500,
    isBest: true,
  },
  {
    target: "Bias Level",
    model: "Char TF-IDF + LogReg",
    accuracy: 86.4,
    macroF1: 83.9,
    weightedF1: 86.6,
    precision: 82.8,
    recall: 85.3,
    samples: 500,
    isBest: false,
  },
  {
    target: "Bias Level",
    model: "Char TF-IDF + Linear SVM",
    accuracy: 81.8,
    macroF1: 74.1,
    weightedF1: 79.9,
    precision: 92.9,
    recall: 68.3,
    samples: 500,
    isBest: false,
  },
];

export function Hero() {
  const [inputText, setInputText] = useState<string>(
    "ගොවීන්ට වෙලාවට පොහොර ටික දෙන්නවත් බැරි තරමට මේ ආණ්ඩුව අසමත් බවත් රට දැඩි ආර්ථික අර්බුදයකට ඇද දමා ඇති බවත් විපක්ෂ නායකවරයා දැඩි ලෙස පවසයි."
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeEvalTab, setActiveEvalTab] = useState<"direction" | "level">("direction");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Run initial prediction once on component load
  useEffect(() => {
    executePrediction(
      "ගොවීන්ට වෙලාවට පොහොර ටික දෙන්නවත් බැරි තරමට මේ ආණ්ඩුව අසමත් බවත් රට දැඩි ආර්ථික අර්බුදයකට ඇද දමා ඇති බවත් විපක්ෂ නායකවරයා දැඩි ලෙස පවසයි."
    );
  }, []);

  const executePrediction = async (textToAnalyze: string) => {
    if (!textToAnalyze || textToAnalyze.trim().length < 5) {
      setErrorMsg("Please provide at least 5 characters of Sinhala news text.");
      return;
    }

    setAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze }),
      });

      const data: PredictionOutput = await response.json();

      if (!response.ok || data.status === "error") {
        throw new Error(data.message || `Prediction failed with status ${response.status}`);
      }

      setResult(data);
    } catch (err: any) {
      console.error("Bias Analysis Execution Error:", err);
      setErrorMsg(err?.message || "Could not connect to bias prediction model.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        executePrediction(content);
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      executePrediction(inputText);
    }
  };

  // Helper colors for Direction label
  const getDirectionBadge = (label?: string) => {
    switch (label?.toLowerCase()) {
      case "anti-government":
        return {
          title: "Anti-Government",
          sinhala: "ආණ්ඩු විරෝධී / විවේචනාත්මක",
          badge: "bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-rose-500/10",
          barColor: "bg-rose-500",
          ring: "ring-rose-500/30",
        };
      case "pro-government":
        return {
          title: "Pro-Government",
          sinhala: "ආණ්ඩු හිතවාදී / සහයෝගී",
          badge: "bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-sky-500/10",
          barColor: "bg-sky-500",
          ring: "ring-sky-500/30",
        };
      default:
        return {
          title: "Neutral",
          sinhala: "මධ්‍යස්ථ / කරුණුමය",
          badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10",
          barColor: "bg-emerald-500",
          ring: "ring-emerald-500/30",
        };
    }
  };

  // Helper colors for Level label
  const getLevelBadge = (label?: string) => {
    switch (label?.toLowerCase()) {
      case "high":
        return {
          title: "High Severity",
          sinhala: "ඉහළ පක්ෂග්‍රාහීත්වය",
          badge: "bg-rose-500/15 text-rose-300 border-rose-500/40 shadow-rose-500/10",
          barColor: "bg-rose-500",
          desc: "Substantial emotional or partisan framing detected in language.",
        };
      case "medium":
        return {
          title: "Medium Severity",
          sinhala: "මධ්‍යම පක්ෂග්‍රාහීත්වය",
          badge: "bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-amber-500/10",
          barColor: "bg-amber-500",
          desc: "Noticeable political slant or selective topic emphasis.",
        };
      case "low":
        return {
          title: "Low Severity",
          sinhala: "අඩු පක්ෂග්‍රාහීත්වය",
          badge: "bg-blue-500/15 text-blue-300 border-blue-500/40 shadow-blue-500/10",
          barColor: "bg-blue-500",
          desc: "Minor stylistic framing with mostly objective information.",
        };
      default:
        return {
          title: "Neutral / Balanced",
          sinhala: "මධ්‍යස්ථ / අපක්ෂපාතී",
          badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10",
          barColor: "bg-emerald-500",
          desc: "No significant partisan slant or emotional bias detected.",
        };
    }
  };

  const directionData = result?.predictions?.bias_direction;
  const levelData = result?.predictions?.bias_level;
  const directionMeta = getDirectionBadge(directionData?.predicted_label);
  const levelMeta = getLevelBadge(levelData?.predicted_label);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Radiant Tech Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-15%,rgba(14,165,233,0.18),rgba(2,6,23,0))]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[450px] h-[450px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-[1720px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-8 pb-20 lg:pt-12 lg:pb-28">
        {/* Top Research Pill Header */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Machine Learning Bias Analysis
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-cyan-400 font-medium flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5" /> Sinhala Unicode NLP Pipeline
            </span>
          </div>

          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs py-1 px-3 font-mono"
          >
            Informatics Institute of Technology (IIT) • FYP
          </Badge>
        </div>

        {/* Project Hero Header */}
        <div className="text-center max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Machine Learning-Based{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Bias Analysis & Prediction
            </span>{" "}
            of Sri Lankan Television News
          </h1>
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto leading-relaxed">
            An academic research platform providing real-time natural language inference to detect
            political alignment (<span className="text-cyan-300 font-medium">Bias Direction</span>) and
            framing severity (<span className="text-sky-300 font-medium">Bias Level</span>) across Sinhala news text.
          </p>

          {/* Quick Architecture Feature Badges */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-3 text-xs sm:text-sm text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> TF-IDF Char/Word n-gram Pipelines
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <Scale className="w-3.5 h-3.5 text-emerald-400" /> Calibrated Class Probabilities (Platt Scaling)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <Binary className="w-3.5 h-3.5 text-purple-400" /> Sinhala ZWJ Unicode Normalization
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE BIAS DETECTION WORKBENCH (id="detector")          */}
        {/* ============================================================== */}
        <section
          id="detector"
          className="scroll-mt-20 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl p-5 sm:p-7 lg:p-8 xl:p-9 relative"
        >
          <div id="classifier" className="absolute -top-20 left-0 pointer-events-none" />
          {/* Workbench Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Live Bias Prediction Console
                </h2>
                <p className="text-xs text-slate-400">
                  Input Sinhala news headlines, statements, or broadcast transcripts to run live model inference.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800/80 text-cyan-300 border border-slate-700">
                ACTIVE MODEL: Char/Word TF-IDF + LogReg
              </span>
            </div>
          </div>

          {/* Quick-load Presets */}
          <div className="pt-5 pb-3">
            <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center justify-between">
              <span>Quick-Load Verified Research Samples:</span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Click any preset to test immediately
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-4">
              {PRESET_EXAMPLES.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(preset.text);
                    executePrediction(preset.text);
                  }}
                  className="text-left p-3 sm:p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                      {preset.title}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono border shrink-0 ${preset.badgeColor}`}
                    >
                      {preset.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Core Grid: Text Input Area (Left 7 Cols ~58%) + Real-time Results (Right 5 Cols ~42%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 pt-4">
            {/* Left 7 Columns: Input Console (58% width on desktop) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <label htmlFor="sinhala-input" className="font-medium text-slate-300">
                    Sinhala News Text (සිංහල පුවත් පෙළ):
                  </label>
                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span>
                      Words: <strong className="text-slate-200">{wordCount}</strong>
                    </span>
                    <span>
                      Chars: <strong className="text-slate-200">{charCount}</strong>
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    id="sinhala-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={7}
                    placeholder="මෙතැනට සිංහල පුවත් සිරස්තලයක් හෝ ප්‍රකාශයක් ඇතුළත් කරන්න (Enter Sinhala news headline or statement here)..."
                    className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm leading-relaxed focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition resize-y font-sans shadow-inner min-h-[175px]"
                  />
                  {inputText && (
                    <button
                      onClick={() => setInputText("")}
                      className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-xs transition"
                      title="Clear Text"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {/* File Upload Option */}
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs h-9 px-3 gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>Upload .txt News</span>
                  </Button>

                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px]">Ctrl+Enter</kbd> to analyze
                  </span>
                </div>

                {/* Submit Inference Button */}
                <Button
                  onClick={() => executePrediction(inputText)}
                  disabled={analyzing}
                  size="default"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs h-9 px-5 shadow-lg shadow-cyan-500/20 rounded-lg cursor-pointer"
                >
                  {analyzing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full" />
                      Classifying News Text...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Predict Bias & Direction
                    </span>
                  )}
                </Button>
              </div>

              {/* Preprocessing Unicode Info Note */}
              <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Sinhala Preprocessing:</strong> Automatically normalizes Zero-Width Joiners (ZWJ),
                  replaces irregular diacritics, strips punctuation, and cleans sublinear character sequences
                  via <code className="text-slate-300 font-mono">clean_sinhala_text()</code> before inference.
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Real-Time Prediction Results Output Card (42% width on desktop) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/25 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

              <div className="space-y-4">
                {/* Result Card Title & Copy Button */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Inference Diagnostics
                    </span>
                  </div>
                  {result && (
                    <button
                      onClick={handleCopyJson}
                      className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                      title="Copy Raw Prediction JSON"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy JSON</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {analyzing ? (
                  <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="animate-spin h-9 w-9 border-3 border-cyan-400 border-t-transparent rounded-full" />
                    <div className="text-xs text-slate-300 font-medium">
                      Executing Character n-gram TF-IDF Matrix...
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Applying calibrated multi-class decision boundary
                    </div>
                  </div>
                ) : result?.status === "success" ? (
                  <div className="space-y-4">
                    {/* 1. PREDICTED BIAS DIRECTION */}
                    {directionData && (
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-medium">
                            1. Bias Direction (දේශපාලන පෙළගැස්ම):
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${directionMeta.badge}`}
                          >
                            {directionData.predicted_label}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 font-medium">
                          {directionMeta.sinhala}
                        </div>

                        {/* Probability Breakdown for Direction */}
                        {directionData.class_probabilities && (
                          <div className="pt-2 border-t border-slate-900 space-y-2">
                            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                              Calibrated Probabilities:
                            </div>
                            {Object.entries(directionData.class_probabilities).map(
                              ([cls, prob]) => {
                                const percent = Math.round(prob * 100);
                                const isCurrent = cls === directionData.predicted_label;
                                return (
                                  <div key={cls} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span
                                        className={
                                          isCurrent
                                            ? "text-cyan-300 font-semibold"
                                            : "text-slate-400"
                                        }
                                      >
                                        {cls}
                                      </span>
                                      <span
                                        className={
                                          isCurrent
                                            ? "text-cyan-300 font-mono font-bold"
                                            : "text-slate-500 font-mono"
                                        }
                                      >
                                        {percent}%
                                      </span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                      <div
                                        style={{ width: `${percent}%` }}
                                        className={`h-full rounded-full transition-all duration-500 ${
                                          isCurrent ? directionMeta.barColor : "bg-slate-600"
                                        }`}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 2. PREDICTED BIAS LEVEL */}
                    {levelData && (
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-medium">
                            2. Bias Severity Level (පක්ෂග්‍රාහීත්ව මට්ටම):
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${levelMeta.badge}`}
                          >
                            {levelData.predicted_label}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 font-medium">
                          {levelMeta.sinhala} •{" "}
                          <span className="text-slate-400">{levelMeta.desc}</span>
                        </div>

                        {/* Probability Breakdown for Level */}
                        {levelData.class_probabilities && (
                          <div className="pt-2 border-t border-slate-900 space-y-2">
                            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                              Severity Distribution:
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-2.5">
                              {Object.entries(levelData.class_probabilities).map(
                                ([cls, prob]) => {
                                  const percent = Math.round(prob * 100);
                                  const isCurrent = cls === levelData.predicted_label;
                                  return (
                                    <div
                                      key={cls}
                                      className={`p-2.5 rounded-lg border text-left ${
                                        isCurrent
                                          ? "bg-slate-900 border-cyan-500/40 text-cyan-200"
                                          : "bg-slate-950 border-slate-800 text-slate-400"
                                      }`}
                                    >
                                      <div className="text-[10px] uppercase font-mono flex justify-between">
                                        <span>{cls}</span>
                                        <span className="font-bold">{percent}%</span>
                                      </div>
                                      <div className="w-full h-1 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                                        <div
                                          style={{ width: `${percent}%` }}
                                          className={`h-full ${
                                            isCurrent ? "bg-cyan-400" : "bg-slate-600"
                                          }`}
                                        />
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-14 text-center text-xs text-slate-500 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-500">
                      <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-300">Ready for Live Inference</p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Enter Sinhala news text on the left or select a sample preset above to preview model predictions and confidence distributions.
                    </p>
                  </div>
                )}
              </div>

              {/* Research Disclaimer & Ethics Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400 leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Academic Research Disclaimer</span>
                </div>
                <p className="text-slate-400">
                  Model probabilities represent statistical linguistic patterns learned from training
                  annotations and <strong>never</strong> represent verified factual truth or definitive
                  proof of bias.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* MODEL EVALUATION BENCHMARK SUITE (id="evaluation")             */}
        {/* ============================================================== */}
        <section id="evaluation" className="scroll-mt-20 mt-16 pt-10 border-t border-slate-800/80 relative">
          <div id="sentiment" className="absolute -top-20 left-0 pointer-events-none" />
          <div id="airtime" className="absolute -top-20 left-0 pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-2">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Empirical Verification Suite</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Model Performance & Evaluation Metrics
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Evaluation results generated by <code className="text-slate-300 font-mono">evaluate.py</code> on 500 validated test samples.
              </p>
            </div>

            {/* Target Tab Switcher */}
            <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setActiveEvalTab("direction")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeEvalTab === "direction"
                    ? "bg-cyan-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Bias Direction (Alignment)
              </button>
              <button
                onClick={() => setActiveEvalTab("level")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeEvalTab === "level"
                    ? "bg-cyan-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Bias Level (Severity)
              </button>
            </div>
          </div>

          {/* Metric Highlights Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xl:gap-6 mb-8">
            <div className="p-4 xl:p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Best Accuracy</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono mt-1">
                {activeEvalTab === "direction" ? "91.4%" : "88.8%"}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Word TF-IDF + LogReg</div>
            </div>

            <div className="p-4 xl:p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Macro F1-Score</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono mt-1">
                {activeEvalTab === "direction" ? "90.0%" : "86.7%"}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Balanced multi-class</div>
            </div>

            <div className="p-4 xl:p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Weighted F1-Score</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1">
                {activeEvalTab === "direction" ? "91.4%" : "88.8%"}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Class-frequency weighted</div>
            </div>

            <div className="p-4 xl:p-5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Test Set Samples</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono mt-1">
                500
              </div>
              <div className="text-[11px] text-slate-500 mt-1">100% verified ground truth</div>
            </div>
          </div>

          {/* Evaluation Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 shadow-inner">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 xl:px-6">Model Pipeline</th>
                  <th className="py-3.5 px-4 xl:px-6">Accuracy</th>
                  <th className="py-3.5 px-4 xl:px-6">Macro F1</th>
                  <th className="py-3.5 px-4 xl:px-6">Weighted F1</th>
                  <th className="py-3.5 px-4 xl:px-6">Macro Precision</th>
                  <th className="py-3.5 px-4 xl:px-6">Macro Recall</th>
                  <th className="py-3.5 px-4 xl:px-6">Evaluation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {EVAL_SUMMARY.filter((row) =>
                  activeEvalTab === "direction"
                    ? row.target === "Bias Direction"
                    : row.target === "Bias Level"
                ).map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-800/40 transition ${
                      row.isBest ? "bg-cyan-500/5" : ""
                    }`}
                  >
                    <td className="py-4 px-4 xl:px-6 font-semibold text-slate-200 flex items-center gap-2">
                      <span>{row.model}</span>
                      {row.isBest && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          TOP BENCHMARK
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 xl:px-6 font-mono font-bold text-white">
                      {row.accuracy.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 xl:px-6 font-mono text-cyan-300 font-semibold">
                      {row.macroF1.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 xl:px-6 font-mono text-emerald-300 font-semibold">
                      {row.weightedF1.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 xl:px-6 font-mono text-slate-300">
                      {row.precision.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 xl:px-6 font-mono text-slate-300">
                      {row.recall.toFixed(1)}%
                    </td>
                    <td className="py-4 px-4 xl:px-6">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Converged (500 samples)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ============================================================== */}
        {/* NLP PIPELINE ARCHITECTURE (id="pipelines")                      */}
        {/* ============================================================== */}
        <section id="pipelines" className="mt-16 pt-10 border-t border-slate-800/80">
          <div className="max-w-4xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-2">
              <Binary className="w-3.5 h-3.5" />
              <span>Machine Learning Methodology</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Four-Stage Natural Language Processing Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Engineered specifically for agglutinative Sinhala syntax and broadcast news framing analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
            {/* Stage 1 */}
            <div className="p-5 xl:p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 font-mono font-bold text-sm">
                01
              </div>
              <h3 className="text-sm font-semibold text-white">Sinhala Normalization</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Normalizes Zero-Width Joiners (ZWJ <code className="text-slate-300">\u200D</code>), removes
                extraneous whitespace, and regularizes kombuva/al-lakuna combinations in Sinhala Unicode.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="p-5 xl:p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-3 font-mono font-bold text-sm">
                02
              </div>
              <h3 className="text-sm font-semibold text-white">Sub-word & Character n-grams</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Extracts character 3–5 n-grams and word 1–2 n-grams with sublinear term frequency scaling to
                capture morphological roots and political keywords.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="p-5 xl:p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 font-mono font-bold text-sm">
                03
              </div>
              <h3 className="text-sm font-semibold text-white">Decoupled Target Modeling</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Independent classifiers fitted with balanced class weights for <em>Bias Direction</em> (Anti/Neutral/Pro-Gov)
                and <em>Bias Level</em> (Neutral/Low/Med/High).
              </p>
            </div>

            {/* Stage 4 */}
            <div className="p-5 xl:p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 font-mono font-bold text-sm">
                04
              </div>
              <h3 className="text-sm font-semibold text-white">Platt Scaling Calibration</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Applies cross-validated probability calibration (<code className="text-slate-300 font-mono">CalibratedClassifierCV</code>)
                so predicted probabilities reflect genuine confidence distributions.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* DATASET & SCOPE (id="dataset")                                  */}
        {/* ============================================================== */}
        <section id="dataset" className="scroll-mt-20 mt-16 pt-10 border-t border-slate-800/80 relative">
          <div id="channels" className="absolute -top-20 left-0 pointer-events-none" />
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl xl:max-w-4xl">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Research Dataset & Ground Truth
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                1,248 Annotated Sinhala Political News Records & 500-Item Benchmark Corpus
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Curated from major Sri Lankan print and television news archives (Lankadeepa, Derana, Hiru, Sirasa, ITN, Rupavahini)
                with rigorous multi-annotator validation across governance, elections, and economic policies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs px-4 h-9"
              >
                <Link href="/about" className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Research Ethics</span>
                </Link>
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  const elem = document.getElementById("detector");
                  elem?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 h-9 cursor-pointer"
              >
                <span>Back to Live Detector</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
