"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Cpu,
  FileSearch,
  Languages,
  Play,
  Radio,
  Scale,
  Sparkles,
  TrendingUp,
  Tv,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ChannelData {
  id: string;
  name: string;
  sinhalaName: string;
  tagline: string;
  fairnessScore: number;
  biasCategory: "Balanced" | "Pro-Government Skew" | "Opposition Skew" | "State-Dominant Skew";
  biasRatingColor: string;
  rulingAirtime: number;
  oppositionAirtime: number;
  civicAirtime: number;
  sentimentRuling: number; // -100 to +100
  sentimentOpposition: number; // -100 to +100
  dominantEntity: string;
  mlConfidence: number;
  monitoredBulletins: number;
  sampleHeadline: string;
  predictedFraming: string;
}

const CHANNELS: ChannelData[] = [
  {
    id: "derana",
    name: "Ada Derana",
    sinhalaName: "අද දෙරණ",
    tagline: "Prime Time 6:55 PM & 8:00 PM News",
    fairnessScore: 66,
    biasCategory: "Pro-Government Skew",
    biasRatingColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    rulingAirtime: 54,
    oppositionAirtime: 28,
    civicAirtime: 18,
    sentimentRuling: 42,
    sentimentOpposition: -26,
    dominantEntity: "Ministry of Finance & Cabinet Briefs",
    mlConfidence: 94.6,
    monitoredBulletins: 420,
    sampleHeadline: "රජයේ ආර්ථික පුනර්ජීවන ප්‍රතිපත්ති සහ ජාත්‍යන්තර මූල්‍ය අරමුදල් සමාලෝචනය",
    predictedFraming: "Development-Optimistic / Incumbent Slant",
  },
  {
    id: "hiru",
    name: "Hiru News",
    sinhalaName: "හිරු News",
    tagline: "Prime Time 6:55 PM News Bulletin",
    fairnessScore: 62,
    biasCategory: "Pro-Government Skew",
    biasRatingColor: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    rulingAirtime: 57,
    oppositionAirtime: 25,
    civicAirtime: 18,
    sentimentRuling: 48,
    sentimentOpposition: -38,
    dominantEntity: "Executive Leadership & Law Enforcement",
    mlConfidence: 93.8,
    monitoredBulletins: 395,
    sampleHeadline: "නීතිය හා සාමය සුරැකීමේ විශේෂ මෙහෙයුම් සහ දේශපාලන සංවාදය",
    predictedFraming: "Sensationalized / Executive-Centric",
  },
  {
    id: "sirasa",
    name: "Sirasa News 1st",
    sinhalaName: "සිරස News 1st",
    tagline: "Prime Time 7:00 PM & 10:00 PM News",
    fairnessScore: 74,
    biasCategory: "Opposition Skew",
    biasRatingColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    rulingAirtime: 32,
    oppositionAirtime: 46,
    civicAirtime: 22,
    sentimentRuling: -34,
    sentimentOpposition: 29,
    dominantEntity: "Opposition Coalitions & Public Grievances",
    mlConfidence: 95.1,
    monitoredBulletins: 450,
    sampleHeadline: "ජනතා බදු බර ඉහළ යෑම සහ විපක්ෂයේ ඒකාබද්ධ විරෝධතා ව්‍යාපාරය",
    predictedFraming: "Watchdog / Anti-Incumbent Tonality",
  },
  {
    id: "itn",
    name: "ITN News",
    sinhalaName: "ස්වාධීන රූපවාහිනිය",
    tagline: "State Broadcaster 7:00 PM Bulletin",
    fairnessScore: 49,
    biasCategory: "State-Dominant Skew",
    biasRatingColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    rulingAirtime: 71,
    oppositionAirtime: 16,
    civicAirtime: 13,
    sentimentRuling: 68,
    sentimentOpposition: -52,
    dominantEntity: "State Development Projects & State Ministers",
    mlConfidence: 96.4,
    monitoredBulletins: 380,
    sampleHeadline: "ජාතික සංවර්ධන ව්‍යාපෘති විවෘත කිරීම සහ රාජ්‍ය ප්‍රතිපත්ති ප්‍රකාශය",
    predictedFraming: "Uncritical State-Promotional Bias",
  },
  {
    id: "rupavahini",
    name: "SLRC Rupavahini",
    sinhalaName: "ශ්‍රී ලංකා රූපවාහිනී සංස්ථාව",
    tagline: "National Broadcaster 8:00 PM Bulletin",
    fairnessScore: 55,
    biasCategory: "State-Dominant Skew",
    biasRatingColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    rulingAirtime: 65,
    oppositionAirtime: 20,
    civicAirtime: 15,
    sentimentRuling: 55,
    sentimentOpposition: -30,
    dominantEntity: "Presidential Secretariat & State Ceremonies",
    mlConfidence: 95.9,
    monitoredBulletins: 410,
    sampleHeadline: "රාජ්‍ය නායකත්වයේ නව ආර්ථික ක්‍රියාන්විතය පිළිබඳ විශේෂ වාර්තාව",
    predictedFraming: "Protocol & Incumbent Alignment",
  },
];

export function Hero() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelData>(CHANNELS[0]);
  const [activeTab, setActiveTab] = useState<"airtime" | "sentiment" | "prediction">("airtime");
  const [demoInput, setDemoInput] = useState<string>(
    "විපක්ෂ නායකවරයා ආණ්ඩුවේ ආර්ථික කළමනාකරණය දැඩි විවේචනයට ලක් කරයි (Opposition Leader severely criticizes government economic management)"
  );
  const [analyzingDemo, setAnalyzingDemo] = useState(false);
  const [demoResult, setDemoResult] = useState<{
    sentiment: string;
    biasLabel: string;
    confidence: string;
    rulingPolarity: string;
    oppositionPolarity: string;
  } | null>({
    sentiment: "Negative Tone (-0.72)",
    biasLabel: "Opposition Skew / Critical Framing",
    confidence: "96.4%",
    rulingPolarity: "Target: Ruling Administration (-0.78)",
    oppositionPolarity: "Source: Opposition Actor (+0.55)",
  });

  const handleSimulateAnalysis = () => {
    setAnalyzingDemo(true);
    setTimeout(() => {
      setAnalyzingDemo(false);
      if (demoInput.toLowerCase().includes("විපක්ෂ") || demoInput.toLowerCase().includes("opposition") || demoInput.toLowerCase().includes("critic")) {
        setDemoResult({
          sentiment: "Negative / Adversarial (-0.76)",
          biasLabel: "Opposition-Favored / Critical Slant",
          confidence: "95.8%",
          rulingPolarity: "Target: Ruling Coalition (-0.81)",
          oppositionPolarity: "Source: Opposition (+0.64)",
        });
      } else if (demoInput.toLowerCase().includes("රජය") || demoInput.toLowerCase().includes("president") || demoInput.toLowerCase().includes("development")) {
        setDemoResult({
          sentiment: "Positive / Promotional (+0.68)",
          biasLabel: "Pro-Incumbent / Government Alignment",
          confidence: "94.2%",
          rulingPolarity: "Target: Government Policy (+0.75)",
          oppositionPolarity: "Opposition Coverage (Omitted)",
        });
      } else {
        setDemoResult({
          sentiment: "Neutral / Informational (0.08)",
          biasLabel: "Balanced / Objective Framing",
          confidence: "91.3%",
          rulingPolarity: "Neutral Airtime (Equal)",
          oppositionPolarity: "Neutral Airtime (Equal)",
        });
      }
    }, 600);
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Background Ambient Glows & Tech Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.18),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-14 lg:pb-28">
        {/* Top Intelligence Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Sri Lankan Broadcast Intelligence
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-cyan-400 font-medium flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5" /> Multimodal Machine Learning
            </span>
          </div>
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs py-1 px-2.5 font-mono"
          >
            IIT Final Year Project (FYP)
          </Badge>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Machine Learning-Based{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Bias Analysis & Prediction
            </span>{" "}
            of Sri Lankan Television News
          </h1>
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            An automated multimodal AI framework decoding political slant, airtime disparity, entity sentiment,
            and predictive framing across Sri Lanka&apos;s leading Sinhala and English prime-time broadcasts.
          </p>

          {/* Quick Meta Badges */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-2 text-xs sm:text-sm text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900/80 border border-slate-800">
              <Tv className="w-4 h-4 text-cyan-400" /> Ada Derana, Hiru, Sirasa, ITN, Rupavahini
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900/80 border border-slate-800">
              <Languages className="w-4 h-4 text-emerald-400" /> Sinhala (සිංහල) & Multilingual ASR
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-900/80 border border-slate-800">
              <Scale className="w-4 h-4 text-purple-400" /> Fairness Index & Diarization
            </span>
          </div>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 px-6 py-6 rounded-xl border border-cyan-400/20"
            >
              <Link href="/analytics" className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Explore Bias Dashboard
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-slate-200 px-6 py-6 rounded-xl shadow-sm"
            >
              <Link href="/methodology" className="flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-slate-400" />
                Research Methodology
              </Link>
            </Button>
          </div>
        </div>

        {/* Interactive Bias Simulator & Live Media Monitor */}
        <div className="mt-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 shadow-2xl backdrop-blur-xl p-4 sm:p-6 lg:p-8">
          {/* Card Header & Channel Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Live Broadcast Audit Console
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  MODEL: RoBERTa-SL-News v2.4
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select a television network to inspect audited prime-time bias indices and airtime distributions.
              </p>
            </div>

            {/* Channel Selectors */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {CHANNELS.map((ch) => {
                const isActive = selectedChannel.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch)}
                    className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10"
                        : "bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50"
                    }`}
                  >
                    <span>{ch.name}</span>
                    <span className="text-[10px] opacity-70">({ch.sinhalaName})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid: Left Column (Channel Details & Visual Metrics) | Right Column (Interactive News Tester) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
            {/* Left Column: 7 Cols */}
            <div className="lg:col-span-7 space-y-6">
              {/* Channel Summary Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">{selectedChannel.name}</span>
                    <span className="text-sm text-slate-400">({selectedChannel.sinhalaName})</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{selectedChannel.tagline}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    Audited Sample:{" "}
                    <strong className="text-slate-300">{selectedChannel.monitoredBulletins}</strong> broadcast bulletins
                  </div>
                </div>

                <div className="flex sm:flex-col items-end gap-1.5">
                  <div className="text-xs text-slate-400">Calculated Slant:</div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${selectedChannel.biasRatingColor}`}
                  >
                    {selectedChannel.biasCategory}
                  </span>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex border-b border-slate-800 gap-6 text-sm">
                <button
                  onClick={() => setActiveTab("airtime")}
                  className={`pb-2.5 font-medium transition-colors relative ${
                    activeTab === "airtime" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Airtime Allocation Skew
                  {activeTab === "airtime" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("sentiment")}
                  className={`pb-2.5 font-medium transition-colors relative ${
                    activeTab === "sentiment" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Entity Sentiment Polarity
                  {activeTab === "sentiment" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("prediction")}
                  className={`pb-2.5 font-medium transition-colors relative ${
                    activeTab === "prediction" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Headline Framing Analysis
                  {activeTab === "prediction" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full" />
                  )}
                </button>
              </div>

              {/* Tab 1: Airtime Allocation */}
              {activeTab === "airtime" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                    <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
                      <span className="text-slate-300 font-medium">Broadcast Screen-time & Speech Diarization</span>
                      <span className="text-xs text-slate-400 font-mono">
                        Fairness Score: <strong className="text-cyan-300">{selectedChannel.fairnessScore}/100</strong>
                      </span>
                    </div>

                    {/* Progress Bar Multi-Segment */}
                    <div className="w-full h-5 rounded-lg bg-slate-800 overflow-hidden flex shadow-inner">
                      <div
                        style={{ width: `${selectedChannel.rulingAirtime}%` }}
                        className="bg-emerald-500 hover:bg-emerald-400 transition-all flex items-center justify-center text-[10px] font-bold text-slate-950"
                        title={`Ruling Alliance: ${selectedChannel.rulingAirtime}%`}
                      >
                        {selectedChannel.rulingAirtime}%
                      </div>
                      <div
                        style={{ width: `${selectedChannel.oppositionAirtime}%` }}
                        className="bg-blue-500 hover:bg-blue-400 transition-all flex items-center justify-center text-[10px] font-bold text-white"
                        title={`Opposition Parties: ${selectedChannel.oppositionAirtime}%`}
                      >
                        {selectedChannel.oppositionAirtime}%
                      </div>
                      <div
                        style={{ width: `${selectedChannel.civicAirtime}%` }}
                        className="bg-slate-600 hover:bg-slate-500 transition-all flex items-center justify-center text-[10px] font-bold text-slate-200"
                        title={`Public/Civic/Neutral: ${selectedChannel.civicAirtime}%`}
                      >
                        {selectedChannel.civicAirtime}%
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                        <span>Ruling Party ({selectedChannel.rulingAirtime}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                        <span>Opposition Coalitions ({selectedChannel.oppositionAirtime}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-slate-600" />
                        <span>Public & Civic ({selectedChannel.civicAirtime}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Airtime Disparity Insight */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                      <div className="text-slate-400">Disparity Ratio (Gov/Opp)</div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {(selectedChannel.rulingAirtime / selectedChannel.oppositionAirtime).toFixed(2)}x
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {selectedChannel.rulingAirtime > selectedChannel.oppositionAirtime
                          ? "Gov receives significantly higher airtime weight"
                          : "Opposition receives higher coverage density"}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                      <div className="text-slate-400">Dominant News Entity</div>
                      <div className="text-xs font-semibold text-cyan-300 truncate mt-0.5" title={selectedChannel.dominantEntity}>
                        {selectedChannel.dominantEntity}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Derived from Sinhala Named Entity Recognition (NER)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Sentiment Polarity */}
              {activeTab === "sentiment" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-4">
                    <div className="text-xs text-slate-400">
                      Aspect-Based Sentiment Polarity Scores [-100 (Extremely Negative) to +100 (Extremely Positive)]:
                    </div>

                    {/* Ruling Party Sentiment Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">Coverage of Ruling Coalition</span>
                        <span
                          className={`font-mono font-bold ${
                            selectedChannel.sentimentRuling >= 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {selectedChannel.sentimentRuling > 0 ? `+${selectedChannel.sentimentRuling}` : selectedChannel.sentimentRuling} / 100
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden relative">
                        <div
                          style={{
                            width: `${Math.abs(selectedChannel.sentimentRuling)}%`,
                            marginLeft: selectedChannel.sentimentRuling < 0 ? "0" : "50%",
                          }}
                          className={`h-full ${
                            selectedChannel.sentimentRuling >= 0 ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Opposition Sentiment Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">Coverage of Opposition Parties</span>
                        <span
                          className={`font-mono font-bold ${
                            selectedChannel.sentimentOpposition >= 0 ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {selectedChannel.sentimentOpposition > 0 ? `+${selectedChannel.sentimentOpposition}` : selectedChannel.sentimentOpposition} / 100
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden relative">
                        <div
                          style={{
                            width: `${Math.abs(selectedChannel.sentimentOpposition)}%`,
                            marginLeft: selectedChannel.sentimentOpposition < 0 ? "0" : "50%",
                          }}
                          className={`h-full ${
                            selectedChannel.sentimentOpposition >= 0 ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-900/40 text-xs text-blue-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Multilingual Sentiment Engine:</strong> Analyzes speech inflection, emotive adjectives in Sinhala/Tamil bulletins, and speech-act framing to isolate implicit vs. explicit bias.
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 3: Headline Framing */}
              {activeTab === "prediction" && (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
                  <div className="text-xs text-slate-400">Sample Bulletin Lead Extract:</div>
                  <blockquote className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-200 italic font-serif">
                    &ldquo;{selectedChannel.sampleHeadline}&rdquo;
                  </blockquote>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">Detected Editorial Framing:</span>
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 font-mono font-medium">
                      {selectedChannel.predictedFraming}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: 5 Cols (Interactive Bias Predictor / Demo Terminal) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-cyan-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-2xl rounded-full" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Live ML Bias Classifier
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-slate-800 text-cyan-400 text-[10px]">
                    Interactive Inference
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 mb-3">
                  Test a Sri Lankan news headline or speech transcript in Sinhala or English to forecast political slant:
                </p>

                {/* Input Textarea */}
                <textarea
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  placeholder="Enter news text or speech transcription in Sinhala or English..."
                />

                {/* Quick Pre-fills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    onClick={() =>
                      setDemoInput(
                        "ජනාධිපතිතුමා නව ආර්ථික සංවර්ධන ව්‍යාපෘති රැසක් ජනතා අයිතියට පත් කරයි (President inaugurates multiple economic development initiatives)"
                      )
                    }
                    className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    + Govt Sample
                  </button>
                  <button
                    onClick={() =>
                      setDemoInput(
                        "විපක්ෂයේ ඒකාබද්ධ විරෝධතාව කොළඹ දී ඇරඹේ; ආණ්ඩුවේ ප්‍රතිපත්ති හෙළා දකී (Joint opposition protest begins in Colombo; condemns policies)"
                      )
                    }
                    className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    + Opposition Sample
                  </button>
                  <button
                    onClick={() =>
                      setDemoInput(
                        "ශ්‍රී ලංකා මහ බැංකුව පොලී අනුපාතික නොවෙනස්ව තබා ගැනීමට තීරණය කරයි (Central Bank of Sri Lanka decides to maintain interest rates unchanged)"
                      )
                    }
                    className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    + Neutral Policy
                  </button>
                </div>

                <Button
                  onClick={handleSimulateAnalysis}
                  disabled={analyzingDemo}
                  className="w-full mt-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-2 h-auto"
                >
                  {analyzingDemo ? (
                    <span className="flex items-center gap-1.5">
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full" />
                      Running Neural Pipeline...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Classify Bias & Slant
                    </span>
                  )}
                </Button>

                {/* Classification Output Card */}
                {demoResult && (
                  <div className="mt-3.5 p-3 rounded-lg bg-slate-950/90 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-1.5 border-b border-slate-800/80">
                      <span className="text-slate-400">Predicted Bias Label:</span>
                      <span className="font-semibold text-cyan-300">{demoResult.biasLabel}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Tone & Sentiment:</span>
                      <span className="text-slate-200 font-mono">{demoResult.sentiment}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Classification Confidence:</span>
                      <span className="text-emerald-400 font-mono font-bold">{demoResult.confidence}</span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-0.5">
                      <div>• {demoResult.rulingPolarity}</div>
                      <div>• {demoResult.oppositionPolarity}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Model Attribution Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Architecture: Whisper + RoBERTa Fine-tuned</span>
                <span className="text-cyan-400 font-mono">F1-Score: 92.8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid / Research Capabilities */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
              <Tv className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Broadcast Audio & Video ASR</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Automated transcription of Sinhala, Tamil, and English news bulletins utilizing fine-tuned Whisper acoustic models.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Airtime & Speaker Diarization</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Precision screen-time and speech-length quantification to expose political coverage disparity between government and opposition.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Aspect-Based Sentiment</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Evaluates contextual tonality, emotive adjective weighting, and editorial framing directed at political actors and civic policies.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">Predictive Trend Forecasting</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Machine learning time-series models anticipating shifts in media slant during election cycles and political crises.
            </p>
          </div>
        </div>

        {/* Project Metrics Summary Strip */}
        <div className="mt-8 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">5+</div>
            <div className="text-xs text-slate-400 mt-1">Prime-Time TV Channels</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">1,800+</div>
            <div className="text-xs text-slate-400 mt-1">News Bulletins Indexed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">3</div>
            <div className="text-xs text-slate-400 mt-1">National Languages</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">92.8%</div>
            <div className="text-xs text-slate-400 mt-1">ML Bias Classification F1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
