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
    sinhalaTitle: "විපක්ෂ විවේචනය",
    category: "Anti-Gov",
    badgeStyle: "bg-[#1C2D38] text-[#89989F] border-[#2D4A5A]",
    text: "ගොවීන්ට වෙලාවට පොහොර ටික දෙන්නවත් බැරි තරමට මේ ආණ්ඩුව අසමත් බවත් රට දැඩි ආර්ථික අර්බුදයකට ඇද දමා ඇති බවත් විපක්ෂ නායකවරයා දැඩි ලෙස පවසයි.",
  },
  {
    title: "Pro-Government Development",
    sinhalaTitle: "රාජ්‍ය සංවර්ධනය",
    category: "Pro-Gov",
    badgeStyle: "bg-[#1C2D38] text-[#89989F] border-[#2D4A5A]",
    text: "ජනාධිපතිතුමා නව ආර්ථික සංවර්ධන ව්‍යාපෘති රැසක් ජනතා අයිතියට පත් කරමින් රට ස්ථාවරත්වයට ගෙන ඒමට රජය කඩිනම් ක්‍රියාමාර්ග ගන්නා බව ප්‍රකාශ කළේය.",
  },
  {
    title: "Neutral Central Bank Report",
    sinhalaTitle: "මහ බැංකු වාර්තාව",
    category: "Neutral",
    badgeStyle: "bg-[#1C2D38] text-[#89989F] border-[#2D4A5A]",
    text: "ශ්‍රී ලංකා මහ බැංකුව විසින් ප්‍රතිපත්තිමය පොලී අනුපාතික නොවෙනස්ව පවත්වා ගැනීමට අද දින තීරණය කළ අතර උද්ධමනය පාලනය වී ඇති බව නිවේදනය කළේය.",
  },
  {
    title: "High-Bias Controversy",
    sinhalaTitle: "දූෂණ විරෝධය",
    category: "High Bias",
    badgeStyle: "bg-[#1C2D38] text-[#89989F] border-[#2D4A5A]",
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

  // Direction label helper — monochrome MongoDB style
  const getDirectionBadge = (label?: string) => {
    switch (label?.toLowerCase()) {
      case "anti-government":
        return {
          title: "Anti-Government",
          sinhala: "ආණ්ඩු විරෝධී / විවේචනාත්මක",
          badge: "bg-[#3D1515] text-[#FF6B6B] border-[#7A2E2E]",
          barColor: "bg-[#FF6B6B]",
        };
      case "pro-government":
        return {
          title: "Pro-Government",
          sinhala: "ආණ්ඩු හිතවාදී / සහයෝගී",
          badge: "bg-[#0D2D3D] text-[#00ED64] border-[#1C4D5A]",
          barColor: "bg-[#00ED64]",
        };
      default:
        return {
          title: "Neutral",
          sinhala: "මධ්‍යස්ථ / කරුණුමය",
          badge: "bg-[#1C2D38] text-[#89989F] border-[#2D4A5A]",
          barColor: "bg-[#89989F]",
        };
    }
  };

  // Level label helper — monochrome MongoDB style
  const getLevelBadge = (label?: string) => {
    switch (label?.toLowerCase()) {
      case "high":
        return {
          title: "High Severity",
          sinhala: "ඉහළ පක්ෂග්‍රාහීත්වය",
          badge: "bg-[#3D1515] text-[#FF6B6B] border-[#7A2E2E]",
          barColor: "bg-[#FF6B6B]",
          desc: "Substantial emotional or partisan framing detected in language.",
        };
      case "medium":
        return {
          title: "Medium Severity",
          sinhala: "මධ්‍යම පක්ෂග්‍රාහීත්වය",
          badge: "bg-[#2D2010] text-[#F5A623] border-[#5A3E10]",
          barColor: "bg-[#F5A623]",
          desc: "Noticeable political slant or selective topic emphasis.",
        };
      case "low":
        return {
          title: "Low Severity",
          sinhala: "අඩු පක්ෂග්‍රාහීත්වය",
          badge: "bg-[#0D2D3D] text-[#00D4FF] border-[#1C4D5A]",
          barColor: "bg-[#00D4FF]",
          desc: "Minor stylistic framing with mostly objective information.",
        };
      default:
        return {
          title: "Neutral / Balanced",
          sinhala: "මධ්‍යස්ථ / අපක්ෂපාතී",
          badge: "bg-[#0D2D1A] text-[#00ED64] border-[#1C4D2A]",
          barColor: "bg-[#00ED64]",
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
    <div className="relative w-full bg-[#001E2B] text-white min-h-screen">
      {/* Subtle background texture — single very faint glow, no neon */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,237,100,0.04),transparent)] pointer-events-none" />

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <div className="relative w-full max-w-[1720px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-28 pb-20 lg:pt-32 lg:pb-28">

        {/* ── HERO HEADER ────────────────────────────────────────────── */}
        <div className="text-center max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto mb-14">
          {/* Status pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D2D1A] border border-[#1C4D2A] text-[11px] font-medium text-[#00ED64] tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ED64] animate-pulse" />
              Live ML Inference
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C2D38] border border-[#2D4A5A] text-[11px] font-medium text-[#89989F] tracking-wide">
              <BrainCircuit className="w-3 h-3" />
              Sinhala NLP Pipeline
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C2D38] border border-[#2D4A5A] text-[11px] font-medium text-[#89989F] tracking-wide">
              IIT Sri Lanka · FYP
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-bold tracking-tight text-white leading-[1.15]">
            Machine Learning-Based Bias Analysis
            <br />
            <span className="text-[#00ED64]">&amp; Prediction</span>
            {" "}of Sri Lankan Television News
          </h1>

          <p className="mt-5 text-sm sm:text-base lg:text-lg text-[#89989F] max-w-3xl mx-auto leading-relaxed font-normal">
            An academic research platform providing real-time natural language inference to detect
            political alignment (<span className="text-white font-medium">Bias Direction</span>) and
            framing severity (<span className="text-white font-medium">Bias Level</span>) across Sinhala broadcast news text.
          </p>

          {/* Feature tags */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-2 text-[11px] text-[#89989F]">
            {[
              { icon: <Cpu className="w-3 h-3" />, label: "TF-IDF Char/Word n-gram Pipelines" },
              { icon: <Scale className="w-3 h-3" />, label: "Platt-Calibrated Class Probabilities" },
              { icon: <Binary className="w-3 h-3" />, label: "Sinhala ZWJ Unicode Normalization" },
            ].map((tag) => (
              <span key={tag.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#112733] border border-[#1C2D38] font-medium">
                {tag.icon}
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  INTERACTIVE BIAS DETECTION WORKBENCH  (id="detector")         */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="detector" className="scroll-mt-20">
          <div id="classifier" className="absolute -top-20 left-0 pointer-events-none" />

          {/* Card wrapper */}
          <div className="rounded-2xl bg-[#112733] border border-[#1C2D38] shadow-xl overflow-hidden">

            {/* Card header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[#1C2D38] bg-[#0D1F28]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#001E2B] border border-[#1C2D38] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#00ED64]" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Live Bias Prediction Console</h2>
                  <p className="text-[11px] text-[#5C6C75] mt-0.5">
                    Input Sinhala news text to run live model inference
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#001E2B] border border-[#1C2D38] text-[10px] font-mono text-[#89989F] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ED64]" />
                Char/Word TF-IDF + LogReg
              </span>
            </div>

            {/* Quick-load presets */}
            <div className="px-6 pt-5 pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-[#5C6C75] uppercase tracking-wider">
                  Quick-Load Research Samples
                </span>
                <span className="text-[11px] text-[#3D5A6A] hidden sm:inline">
                  Click any sample to test immediately
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {PRESET_EXAMPLES.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(preset.text);
                      executePrediction(preset.text);
                    }}
                    className="group text-left p-3.5 rounded-xl bg-[#001E2B] border border-[#1C2D38] hover:border-[#2D4A5A] hover:bg-[#0D2535] transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-white group-hover:text-[#00ED64] transition-colors leading-tight">
                        {preset.title}
                      </span>
                      <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded font-mono border ${preset.badgeStyle}`}>
                        {preset.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#5C6C75] line-clamp-2 leading-relaxed font-normal">
                      {preset.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#1C2D38]" />

            {/* Main 2-column grid: Input + Diagnostics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

              {/* LEFT: Text input panel (7/12) */}
              <div className="lg:col-span-7 p-6 lg:border-r border-[#1C2D38] flex flex-col gap-4">

                {/* Label row */}
                <div className="flex items-center justify-between">
                  <label htmlFor="sinhala-input" className="text-xs font-semibold text-[#89989F]">
                    Sinhala News Text <span className="font-normal text-[#3D5A6A]">(සිංහල පුවත් පෙළ)</span>
                  </label>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-[#3D5A6A]">
                    <span>Words: <strong className="text-[#89989F]">{wordCount}</strong></span>
                    <span>Chars: <strong className="text-[#89989F]">{charCount}</strong></span>
                  </div>
                </div>

                {/* Textarea */}
                <div className="relative flex-1">
                  <textarea
                    id="sinhala-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={7}
                    placeholder="මෙතැනට සිංහල පුවත් සිරස්තලයක් හෝ ප්‍රකාශයක් ඇතුළත් කරන්න (Enter Sinhala news headline or statement here)..."
                    className="w-full p-4 rounded-xl bg-[#001E2B] border border-[#1C2D38] text-white placeholder-[#3D5A6A] text-sm leading-relaxed focus:outline-none focus:border-[#2D4A5A] focus:ring-1 focus:ring-[#00ED64]/30 transition resize-y font-sans min-h-[175px]"
                  />
                  {inputText && (
                    <button
                      onClick={() => setInputText("")}
                      className="absolute top-3 right-3 text-[#3D5A6A] hover:text-[#89989F] p-1.5 rounded-md bg-[#112733] hover:bg-[#1C2D38] transition cursor-pointer"
                      title="Clear"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Error state */}
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-[#2D1515] border border-[#7A2E2E] text-[#FF6B6B] text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Action bar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-[#89989F] bg-[#001E2B] border border-[#1C2D38] hover:border-[#2D4A5A] hover:text-white transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload .txt
                    </button>
                    <span className="text-[10px] text-[#3D5A6A] hidden sm:inline">
                      Press <kbd className="px-1.5 py-0.5 rounded bg-[#1C2D38] font-mono text-[9px] text-[#89989F]">Ctrl+Enter</kbd> to analyze
                    </span>
                  </div>

                  <button
                    onClick={() => executePrediction(inputText)}
                    disabled={analyzing}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-md text-xs font-semibold bg-[#00ED64] text-[#001E2B] hover:bg-[#00D957] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                  >
                    {analyzing ? (
                      <>
                        <span className="animate-spin h-3.5 w-3.5 border-2 border-[#001E2B] border-t-transparent rounded-full" />
                        Classifying...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Predict Bias
                      </>
                    )}
                  </button>
                </div>

                {/* Preprocessing note */}
                <div className="p-3 rounded-lg bg-[#001E2B] border border-[#1C2D38] text-[10px] text-[#5C6C75] flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-[#3D5A6A] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#89989F]">Sinhala Preprocessing:</strong> Automatically normalizes Zero-Width Joiners (ZWJ), replaces irregular diacritics, strips punctuation, and cleans sublinear character sequences via{" "}
                    <code className="text-[#89989F] font-mono">clean_sinhala_text()</code> before inference.
                  </span>
                </div>
              </div>

              {/* RIGHT: Inference diagnostics panel (5/12) */}
              <div className="lg:col-span-5 p-6 flex flex-col gap-4 bg-[#0D1F28]">

                {/* Panel header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-[#1C2D38]">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#00ED64]" />
                    <span className="text-xs font-semibold text-white uppercase tracking-wide">
                      Inference Diagnostics
                    </span>
                  </div>
                  {result && (
                    <button
                      onClick={handleCopyJson}
                      className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-md bg-[#112733] hover:bg-[#1C2D38] text-[#89989F] border border-[#1C2D38] hover:border-[#2D4A5A] transition cursor-pointer"
                      title="Copy JSON"
                    >
                      {copied ? (
                        <><Check className="w-3 h-3 text-[#00ED64]" /><span className="text-[#00ED64]">Copied</span></>
                      ) : (
                        <><Copy className="w-3 h-3" /><span>Copy JSON</span></>
                      )}
                    </button>
                  )}
                </div>

                {/* Loading state */}
                {analyzing ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 space-y-3 text-center">
                    <div className="animate-spin h-9 w-9 border-2 border-[#1C2D38] border-t-[#00ED64] rounded-full" />
                    <div className="text-xs font-medium text-white">Running TF-IDF Classification...</div>
                    <div className="text-[11px] text-[#5C6C75]">Applying calibrated multi-class boundary</div>
                  </div>

                /* Result state */
                ) : result?.status === "success" ? (
                  <div className="space-y-4 flex-1">

                    {/* Bias Direction result */}
                    {directionData && (
                      <div className="rounded-xl bg-[#001E2B] border border-[#1C2D38] p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[#5C6C75] uppercase tracking-wider">
                            Bias Direction
                          </span>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${directionMeta.badge}`}>
                            {directionData.predicted_label}
                          </span>
                        </div>
                        <div className="text-xs text-[#89989F]">{directionMeta.sinhala}</div>

                        {directionData.class_probabilities && (
                          <div className="pt-2 border-t border-[#1C2D38] space-y-2">
                            <div className="text-[10px] font-mono text-[#3D5A6A] uppercase tracking-wider">
                              Calibrated Probabilities
                            </div>
                            {Object.entries(directionData.class_probabilities).map(([cls, prob]) => {
                              const percent = Math.round(prob * 100);
                              const isCurrent = cls === directionData.predicted_label;
                              return (
                                <div key={cls} className="space-y-1">
                                  <div className="flex justify-between text-[11px]">
                                    <span className={isCurrent ? "text-white font-semibold" : "text-[#5C6C75]"}>{cls}</span>
                                    <span className={isCurrent ? "text-white font-mono font-semibold" : "text-[#3D5A6A] font-mono"}>{percent}%</span>
                                  </div>
                                  <div className="w-full h-1 rounded-full bg-[#1C2D38] overflow-hidden">
                                    <div
                                      style={{ width: `${percent}%` }}
                                      className={`h-full rounded-full transition-all duration-500 ${isCurrent ? directionMeta.barColor : "bg-[#2D4A5A]"}`}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bias Level result */}
                    {levelData && (
                      <div className="rounded-xl bg-[#001E2B] border border-[#1C2D38] p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[#5C6C75] uppercase tracking-wider">
                            Bias Severity Level
                          </span>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${levelMeta.badge}`}>
                            {levelData.predicted_label}
                          </span>
                        </div>
                        <div className="text-xs text-[#89989F]">
                          {levelMeta.sinhala} <span className="text-[#5C6C75]">· {levelMeta.desc}</span>
                        </div>

                        {levelData.class_probabilities && (
                          <div className="pt-2 border-t border-[#1C2D38] space-y-2">
                            <div className="text-[10px] font-mono text-[#3D5A6A] uppercase tracking-wider">
                              Severity Distribution
                            </div>
                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                              {Object.entries(levelData.class_probabilities).map(([cls, prob]) => {
                                const percent = Math.round(prob * 100);
                                const isCurrent = cls === levelData.predicted_label;
                                return (
                                  <div
                                    key={cls}
                                    className={`p-2.5 rounded-lg border text-left transition ${
                                      isCurrent
                                        ? "bg-[#0D2D1A] border-[#1C4D2A] text-[#00ED64]"
                                        : "bg-[#112733] border-[#1C2D38] text-[#5C6C75]"
                                    }`}
                                  >
                                    <div className="text-[10px] uppercase font-mono flex justify-between">
                                      <span>{cls}</span>
                                      <span className="font-semibold">{percent}%</span>
                                    </div>
                                    <div className="w-full h-1 rounded-full bg-[#1C2D38] mt-1.5 overflow-hidden">
                                      <div
                                        style={{ width: `${percent}%` }}
                                        className={`h-full ${isCurrent ? levelMeta.barColor : "bg-[#2D4A5A]"}`}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                /* Empty state */
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#112733] border border-[#1C2D38] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#3D5A6A]" />
                    </div>
                    <div className="text-sm font-semibold text-[#89989F]">Ready for Inference</div>
                    <p className="text-[11px] text-[#5C6C75] max-w-xs leading-relaxed">
                      Enter Sinhala news text or select a research sample above to preview model predictions and probability distributions.
                    </p>
                  </div>
                )}

                {/* Research disclaimer footer */}
                <div className="pt-3 mt-auto border-t border-[#1C2D38] text-[10px] text-[#3D5A6A] leading-relaxed space-y-1">
                  <div className="flex items-center gap-1.5 text-[#5C6C75] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3D5A6A]" />
                    Academic Research Disclaimer
                  </div>
                  <p>
                    Model probabilities reflect statistical patterns from training annotations and{" "}
                    <strong className="text-[#5C6C75]">never</strong> represent verified factual truth or definitive proof of bias.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  MODEL EVALUATION BENCHMARK SUITE  (id="evaluation")           */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="evaluation" className="scroll-mt-20 mt-20 pt-12 border-t border-[#1C2D38] relative">
          <div id="sentiment" className="absolute -top-20 left-0 pointer-events-none" />
          <div id="airtime" className="absolute -top-20 left-0 pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0D2D1A] border border-[#1C4D2A] text-[10px] font-semibold text-[#00ED64] uppercase tracking-widest mb-3">
                <BarChart3 className="w-3 h-3" />
                Empirical Verification
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Model Performance & Evaluation Metrics
              </h2>
              <p className="text-xs text-[#5C6C75] mt-1.5 max-w-xl">
                Results generated by <code className="text-[#89989F] font-mono">evaluate.py</code> on 500 validated test samples.
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex p-0.5 rounded-lg bg-[#112733] border border-[#1C2D38] self-start">
              {(["direction", "level"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveEvalTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeEvalTab === tab
                      ? "bg-[#00ED64] text-[#001E2B] shadow-sm"
                      : "text-[#89989F] hover:text-white"
                  }`}
                >
                  {tab === "direction" ? "Bias Direction" : "Bias Level"}
                </button>
              ))}
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Best Accuracy", value: activeEvalTab === "direction" ? "91.4%" : "88.8%", sub: "Word TF-IDF + LogReg", color: "text-[#00ED64]" },
              { label: "Macro F1-Score", value: activeEvalTab === "direction" ? "90.0%" : "86.7%", sub: "Balanced multi-class", color: "text-white" },
              { label: "Weighted F1-Score", value: activeEvalTab === "direction" ? "91.4%" : "88.8%", sub: "Class-frequency weighted", color: "text-white" },
              { label: "Test Set Samples", value: "500", sub: "100% verified ground truth", color: "text-white" },
            ].map((card) => (
              <div key={card.label} className="p-4 xl:p-5 rounded-xl bg-[#112733] border border-[#1C2D38]">
                <div className="text-[11px] text-[#5C6C75] font-medium mb-1">{card.label}</div>
                <div className={`text-2xl sm:text-3xl font-bold font-mono ${card.color}`}>{card.value}</div>
                <div className="text-[10px] text-[#3D5A6A] mt-1">{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Evaluation table */}
          <div className="overflow-x-auto rounded-xl border border-[#1C2D38] bg-[#112733]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D1F28] text-[#5C6C75] font-mono uppercase text-[10px] tracking-wider border-b border-[#1C2D38]">
                <tr>
                  {["Model Pipeline", "Accuracy", "Macro F1", "Weighted F1", "Precision", "Recall", "Status"].map((h) => (
                    <th key={h} className="py-3.5 px-4 xl:px-5 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C2D38]">
                {EVAL_SUMMARY.filter((row) =>
                  activeEvalTab === "direction" ? row.target === "Bias Direction" : row.target === "Bias Level"
                ).map((row, idx) => (
                  <tr key={idx} className={`hover:bg-[#0D1F28] transition ${row.isBest ? "bg-[#0D2D1A]/30" : ""}`}>
                    <td className="py-4 px-4 xl:px-5 font-semibold text-white flex items-center gap-2">
                      {row.model}
                      {row.isBest && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#00ED64]/10 text-[#00ED64] border border-[#00ED64]/30">
                          BEST
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 xl:px-5 font-mono font-bold text-white">{row.accuracy.toFixed(1)}%</td>
                    <td className="py-4 px-4 xl:px-5 font-mono text-[#00ED64] font-semibold">{row.macroF1.toFixed(1)}%</td>
                    <td className="py-4 px-4 xl:px-5 font-mono text-[#89989F] font-semibold">{row.weightedF1.toFixed(1)}%</td>
                    <td className="py-4 px-4 xl:px-5 font-mono text-[#89989F]">{row.precision.toFixed(1)}%</td>
                    <td className="py-4 px-4 xl:px-5 font-mono text-[#89989F]">{row.recall.toFixed(1)}%</td>
                    <td className="py-4 px-4 xl:px-5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#00ED64] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Converged
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  NLP PIPELINE ARCHITECTURE  (id="pipelines")                    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="pipelines" className="mt-20 pt-12 border-t border-[#1C2D38]">
          <div className="max-w-3xl mb-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0D2D38] border border-[#1C4D5A] text-[10px] font-semibold text-[#89989F] uppercase tracking-widest mb-3">
              <Binary className="w-3 h-3" />
              Machine Learning Methodology
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Four-Stage Natural Language Processing Architecture
            </h2>
            <p className="text-xs text-[#5C6C75] mt-1.5">
              Engineered specifically for agglutinative Sinhala syntax and broadcast news framing analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
            {[
              {
                stage: "01",
                color: "text-[#00ED64]",
                bg: "bg-[#0D2D1A]",
                border: "border-[#1C4D2A]",
                title: "Sinhala Normalization",
                body: "Normalizes Zero-Width Joiners (ZWJ \\u200D), removes extraneous whitespace, and regularizes kombuva/al-lakuna combinations in Sinhala Unicode.",
              },
              {
                stage: "02",
                color: "text-[#89989F]",
                bg: "bg-[#1C2D38]",
                border: "border-[#2D4A5A]",
                title: "Sub-word & Character n-grams",
                body: "Extracts character 3–5 n-grams and word 1–2 n-grams with sublinear TF scaling to capture morphological roots and political keywords.",
              },
              {
                stage: "03",
                color: "text-[#89989F]",
                bg: "bg-[#1C2D38]",
                border: "border-[#2D4A5A]",
                title: "Decoupled Target Modeling",
                body: "Independent classifiers with balanced class weights for Bias Direction (Anti/Neutral/Pro-Gov) and Bias Level (Neutral/Low/Med/High).",
              },
              {
                stage: "04",
                color: "text-[#00ED64]",
                bg: "bg-[#0D2D1A]",
                border: "border-[#1C4D2A]",
                title: "Platt Scaling Calibration",
                body: "Cross-validated probability calibration (CalibratedClassifierCV) so predicted probabilities reflect genuine confidence distributions.",
              },
            ].map((s) => (
              <div key={s.stage} className="p-5 xl:p-6 rounded-xl bg-[#112733] border border-[#1C2D38] hover:border-[#2D4A5A] transition-all duration-200">
                <div className={`w-9 h-9 rounded-lg ${s.bg} border ${s.border} flex items-center justify-center ${s.color} mb-4 font-mono font-bold text-sm`}>
                  {s.stage}
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-[#5C6C75] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  DATASET & SCOPE  (id="dataset")                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="dataset" className="scroll-mt-20 mt-20 pt-12 border-t border-[#1C2D38] relative">
          <div id="channels" className="absolute -top-20 left-0 pointer-events-none" />

          <div className="rounded-2xl bg-[#112733] border border-[#1C2D38] p-7 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00ED64]" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#5C6C75]">
                  Research Dataset & Ground Truth
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                1,248 Annotated Sinhala Political News Records & 500-Item Benchmark Corpus
              </h3>
              <p className="text-xs text-[#5C6C75] leading-relaxed">
                Curated from major Sri Lankan print and television news archives (Lankadeepa, Derana, Hiru, Sirasa, ITN, Rupavahini)
                with rigorous multi-annotator validation across governance, elections, and economic policies.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-[#89989F] bg-[#001E2B] border border-[#1C2D38] hover:border-[#2D4A5A] hover:text-white transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Research Ethics
              </Link>
              <button
                onClick={() => {
                  const elem = document.getElementById("detector");
                  elem?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-[#00ED64] text-[#001E2B] hover:bg-[#00D957] transition cursor-pointer"
              >
                Back to Live Detector
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
